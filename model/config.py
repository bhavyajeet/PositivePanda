"""
Config params
"""

import os

RABBITMQ_Q = os.getenv("RABBITMQ_Q", "classify-requests")
RABBITMQ_CREDS = {
    "username": os.getenv("RABBITMQ_USERNAME", "guest"),
    "password": os.getenv("RABBITMQ_PASSWORD", "guest"),
}
RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))

ARTICLES_API_HOST = os.getenv("ARTICLES_API_HOST", "articles_api")
ARTICLES_API_PORT = int(os.getenv("ARTICLES_API_PORT", "5000"))
SECRET = os.getenv("SECRET", "ssshhh")

GOOD_THRESHOLD = float(os.getenv("GOOD_THRESHOLD", "0.3"))
