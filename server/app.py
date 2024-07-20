from config import app
from flask import make_response
from flask_migrate import Migrate
from models import db

@app.route('/')
def index():
    return make_response({"message": "Welcome to the Task Management App!"}, 200)

if __name__ == "__main__":
    app.run(port=4000, debug=True)