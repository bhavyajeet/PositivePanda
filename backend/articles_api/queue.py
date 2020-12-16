import time

import pika

from articles_api import config


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
