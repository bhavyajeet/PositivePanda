from enum import IntEnum

from articles_api.extensions import db


class ArticleType(IntEnum):
    NOT_CLASSIFIED = 0
    BAD = 1
    GOOD = 2
    ERROR = 3


class Article(db.Document):
    hash = db.StringField()
    publish_date = db.DateTimeField()
    kind = db.EnumField(ArticleType)
    score = db.FloatField()
    keywords = db.ListField(db.StringField())
