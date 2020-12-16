"""
Routes for status on articles
"""

from flask_restx import Namespace, Resource, fields, reqparse, inputs

from articles_api import config
from articles_api.helpers import serialize
from articles_api.queue import connect_queue
from articles_api.models import Article
from articles_api.models.article import ArticleType

api = Namespace("article", description="Manage and query articles")

channel = connect_queue(config.RABBITMQ_Q)

# flask restx input parameters
class ArticleTypeConverter(fields.Raw):
    """
    Converts the integer type in db to human readable string
    """

    def format(self, value):
        return ArticleType(value).name


get_parser = reqparse.RequestParser()
get_parser.add_argument(
    "hash", type=str, required=True, help="Need article hash for checking content"
)
get_inputs = api.model("GetArticle", {"hash": fields.String})

article_response = api.model(
    "Article",
    {
        "hash": fields.String,
        "publish_date": fields.DateTime(),
        "type": ArticleTypeConverter(attribute="type"),
    },
)

post_parser = get_parser.copy()
post_parser.add_argument("publish_date", type=inputs.date_from_iso8601)
post_parser.add_argument("type", type=int, required=True)

post_inputs = api.inherit("PostArticle", article_response, {})


@api.route("/")
class ArticleDAO(Resource):
    @api.marshal_with(article_response)
    @api.doc(params={"hash": "Article hash"})
    def get(self):
        """
        Returns the type of article.
        If the article type is unknown, adds it to the query queue.
        """
        args = get_parser.parse_args()
        article_hash = args["hash"]

        article = Article.objects(hash=article_hash).first()

        if not article:
            article = Article(hash=article_hash, type=ArticleType.NOT_CLASSIFIED)
            article.save()

            channel.basic_publish(
                exchange="",
                routing_key=config.RABBITMQ_Q,
                body=serialize({"hash": article_hash}),
            )

        return article

    @api.expect(post_inputs)
    @api.marshal_with(article_response)
    def post(self):
        """
        Set the type of article.
        Adds the article hash and result to database.
        """
        # TODO: add auth

        args = get_parser.parse_args()
        article_hash = args["hash"]

        article = Article.objects(hash=article_hash).first()

        if article:
            article.update(**args)
        else:
            # should not happen, but anyways
            article = Article(**args)
            article.save()

        return article
