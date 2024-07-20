from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
# from flask_bcrypt import Bcrypt

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
app.config['SECRET_KEY'] = '4f04242b36d4817ea0511c090d30a4e5'

db = SQLAlchemy()

migrate = Migrate(app, db)

db.init_app(app)

api = Api(app)

# bcrypt = Bcrypt(app)

CORS(app)