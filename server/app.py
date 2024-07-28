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
        "/login": ["POST"],
        "/me": ["GET"],
        "/logout": ["DELETE"]
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

        username = request.json.get('username')
        email = request.json.get('email')
        password = request.json.get('password')

        # if not username or not email:
        #     return make_response({"error": "Username/email and password are required"}, 400)

        # user = User.query.filter(or_(User.username == request.json.get('username'), User.email.like(f"%{request.json.get('email')}%"))).first()

        if username and not email:
            user = User.query.filter(User.username == username).first()

        elif email and not username:
            user = User.query.filter(User.email == email).first()

        if user and user.authenticate(password):
            session['user_id'] = user.id

            return make_response(user.to_dict(), 201)
        
        return make_response({"error": "Incorrect username/password"}, 401)
    
class Logout(Resource):
    def delete(self):
        session.pop('user_id', None)

        return make_response({"message": "Logout successful!"}, 200)

class CheckSession(Resource):
    def get(self):

        if 'user_id' in session:
            user = User.query.filter(User.id == session['user_id']).first()

            if user:
                return make_response(user.to_dict(), 200)
        
        return make_response({"error": "No user is currently signed in."}, 403)

api.add_resource(Signup, '/signup', endpoint="signup")
api.add_resource(Login, '/login', endpoint="login")
api.add_resource(Logout, '/logout', endpoint="logout")
api.add_resource(CheckSession, '/me', endpoint="me")

if __name__ == "__main__":
    app.run(port=4000, debug=True)