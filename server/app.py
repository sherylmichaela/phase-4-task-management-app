from config import app, api
from flask import make_response, session, request
from flask_migrate import Migrate
from models import db, User
from flask_restful import Resource

@app.route('/')
def index():
    return make_response({"message": "Welcome to the Task Management App!"}, 200)

class Signup(Resource):
    def post(self):
        user = User(username=request.json.get('username'), email=request.json.get('email'))

        db.session.add(user)
        db.session.commit()

        if user.id:
            session['user'] = user.to_dict() # Include to_dict() to make it JSON serialisable.

            return make_response({"message": "User account has been created."}, 201)
        
        return make_response({"error": "Signup unsucessful"}, 400)
        
    
class Login(Resource):
    def post(self):
        user = User.query.filter(User.username == request.json.get('username')).first()

        if user:
            session['user'] = user.to_dict()

            return make_response({"message": "Log in successful!"}, 200)
        
        return make_response({"error": "Unauthorised login"}, 403)
    
class Logout(Resource):
    def delete(self):
        session.pop('user', None)

        return make_response({"message": "Logout successful!"}, 200)

class Tasks(Resource):
    def get(self):

        if 'user' in session:
            return make_response(session['user'], 200)
        
        return make_response({"error": "No user is currently signed in."}, 403)

api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(Tasks, '/tasks')

if __name__ == "__main__":
    app.run(port=4000, debug=True)