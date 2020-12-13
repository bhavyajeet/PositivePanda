from flask import Flask, Blueprint
from flask_restx import Api
from werkzeug.middleware.proxy_fix import ProxyFix

from articles_api import config
from articles_api.extensions import db
from articles_api.api.article import api as Article

blueprint = Blueprint("api", __name__)
api = Api(blueprint, version="0.0.1", title="Middleman Backend")
api.add_namespace(Article)

app = Flask(__name__, static_folder=None)
app.wsgi_app = ProxyFix(app.wsgi_app)
app.register_blueprint(blueprint)

app.config["MONGODB_SETTINGS"] = {
    "host": config.MONGO_HOST,
    "port": config.MONGO_PORT,
    "db": config.MONGO_DB,
}

db.init_app(app)

if __name__ == "__main__":
    app.run(debug=True)
