from enum import IntEnum
import time

import requests
import pika
import msgpack
from newspaper import Article
import numpy as np

from model import Model
import config


class ArticleType(IntEnum):
    NOT_CLASSIFIED = 0
    BAD = 1
    GOOD = 2
    ERROR = 3


def connect_queue(queue_name, backoff_factor=2, max_retries=float("inf")):
    """
    pika setup for RabbitMQ
    """
    sleep_duration = 1
    retries = 0

    credentials = pika.PlainCredentials(
        config.RABBITMQ_CREDS.get("username"), config.RABBITMQ_CREDS.get("password")
    )

    while retries < max_retries:
        try:
            conn = pika.BlockingConnection(
                pika.ConnectionParameters(
                    host=config.RABBITMQ_HOST,
                    port=config.RABBITMQ_PORT,
                    credentials=credentials,
                )
            )
        except pika.exceptions.AMQPConnectionError:
            time.sleep(sleep_duration)
            sleep_duration *= backoff_factor
            retries += 1
            print(f"Failed to connect to queue - {retries}/{max_retries} try")
        else:
            print("Successfully connected to queue")
            break

    channel = conn.channel()
    channel.queue_declare(queue_name)

    return channel


classifier = Model()
channel = connect_queue(config.RABBITMQ_Q)


def calc_words(line):
    return 1 + line.strip().count(" ")


def get_score(article_hash):
    url = "https://news.google.com/articles/" + article_hash
    article = Article(url)

    article.download()
    article.parse()

    raw_text = article.text.replace("\n", " ")
    raw_text = raw_text.replace('"', " ")
    raw_text = raw_text.replace("'", " ")
    lines = raw_text.split(". ")
    lines = list(map(lambda x: x.strip(), filter(bool, lines)))

    if len(lines) == 0:
        raise Exception("No text extracted from newspaper")

    n_words = 0

    sentences = [""]

    for line in lines:
        words = calc_words(line)

        if n_words + words < 64:
            sentences[-1] += " " + line
            n_words += words
        else:
            n_words = words
            sentences.append(line)

    scores = classifier.predict(sentences)
    return np.mean(scores)


def score_article(_ch, _method, _properties, body):
    """
    RabbitMQ callback

    extracts hash, runs model and updates article on API
    """
    article_hash = msgpack.unpackb(body).get("hash")

    try:
        score = get_score(article_hash)
        if score > config.GOOD_THRESHOLD:
            article_type = ArticleType.GOOD
        else:
            article_type = ArticleType.BAD
    except:
        score = None
        article_type = ArticleType.ERROR

    requests.post(
        f"{config.ARTICLES_API_HOST}/article",
        headers={"Authorization": config.SECRET},
        json={"hash": article_hash, "type": article_type, "score": score},
    )


channel.basic_consume(
    queue=config.RABBITMQ_Q, auto_ack=True, on_message_callback=score_article
)
channel.start_consuming()
