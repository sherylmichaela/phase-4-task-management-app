from config import app, api
from flask import make_response, session, request
from models import db, User
from flask_restful import Resource
from sqlalchemy import or_

@app.route('/')
def index():
    return make_response({"message": "Welcome to the Task Management App!"}, 200)

@app.before_request
def authenticate():
    exempted_routes = {
        "/": ["GET"],
        "/signup": ["POST"],
        "/login": ["POST"]
    }

    if request.path in exempted_routes:
        allowed_methods = exempted_routes[request.path]

        if request.method in allowed_methods:
            return None
        
    if 'user' not in session:
        return make_response({"message": "Unauthorised"}, 403)

class Signup(Resource):
    def post(self):
        user = User(username=request.json.get('username'), email=request.json.get('email'), hashed_password=request.json.get('password'))

        db.session.add(user)
        db.session.commit()

        if user.id:
            session['user'] = user.to_dict() # Include to_dict() to make it JSON serialisable.

            return make_response({"message": "User account has been created."}, 201)
        
        return make_response({"error": "Signup unsucessful"}, 400)
        
    
class Login(Resource):
    def post(self):

        user_identifier = request.json.get('username') or request.json.get('email')
        user_password = request.json.get('password')

        if not user_identifier or not user_password:
            return make_response({"error": "Username/email and password are required"}, 400)

        user = User.query.filter(or_(User.username == request.json.get('username'), User.email.like(f"%{request.json.get('email')}%"))).first()

        if user and user.authenticate(user_password):
            session['user'] = user.to_dict()

            return make_response({"message": "Log in successful!"}, 200)
        
        return make_response({"error": "Incorrect username/password"}, 401)
    
class Logout(Resource):
    def delete(self):
        session.pop('user', None)

        return make_response({"message": "Logout successful!"}, 200)

class Tasks(Resource):
    def get(self):

        if 'user' in session:
            return make_response(session['user'], 200)
        
        return make_response({"error": "No user is currently signed in."}, 403)

api.add_resource(Signup, '/signup', endpoint="signup")
api.add_resource(Login, '/login', endpoint="login")
api.add_resource(Logout, '/logout', endpoint="logout")
api.add_resource(Tasks, '/tasks', endpoint="tasks")

if __name__ == "__main__":
    app.run(port=4000, debug=True)