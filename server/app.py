from config import app, api
from flask import make_response, session, request
from models import db, User, Task, Subtask
from flask_restful import Resource
from datetime import datetime
from sqlalchemy import and_

@app.route('/')
def index():
    return make_response({"message": "Welcome to the Task Management App!"}, 200)

class Signup(Resource):
    def post(self):
        user = User(username=request.json.get('username'), email=request.json.get('email'), hashed_password=request.json.get('password'))

        db.session.add(user)
        db.session.commit()

        if user.id:
            session['user'] = user.to_dict() # Include to_dict() to make it JSON serialisable.

            return make_response(user.to_dict(), 201)
        
        return make_response({"error": "Signup unsucessful"}, 403)
        
class Login(Resource):
    def post(self):
        username = request.json.get('username')
        email = request.json.get('email')
        password = request.json.get('password')

        user = User.query.filter(User.username == username).first()

        if not user:
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

class Tasks(Resource):
    def get(self):

        if 'user_id' in session:
            my_tasks = Task.query.filter(Task.user_id == session['user_id']).all()

            if len(my_tasks) > 0:
                tasks = [task.to_dict() for task in my_tasks]
                return make_response(tasks, 200)
             
            return make_response({"message": "No task created yet"}, 200)
        
        return make_response({"error": "Pls log in to view tasks."}, 401)
    
    def post(self):
        task_name = request.json.get('task_name')
        category = request.json.get('category')
        task_due_date = datetime.strptime(request.json.get('task_due_date'), '%Y-%m-%d')
        task_status = request.json.get('task_status', 'pending')

        new_task = Task(task_name=task_name, category=category, task_due_date=task_due_date, task_status=task_status, user_id=session['user_id'])

        db.session.add(new_task)
        db.session.commit()

        if new_task.id:
            return make_response(new_task.to_dict(), 201)
        
        return make_response({"error": "error occurred"}, 400)


class TaskById(Resource):
    # /tasks/<int:id>

    @classmethod
    def find_task(cls, id):
        return Task.query.filter(and_(Task.id == id, Task.user_id == session['user_id'])).first()
    
    def get(self, id):
        task = TaskById.find_task(id)

        if task:
            return make_response(task.to_dict(), 200)
        
        return make_response({"error": "This task doesn't exist or you may not have permission to view this task"}, 401)

    def patch(self, id):
        task = TaskById.find_task(id)
        
        if task:
            for attr in request.json:
                if attr == "task_due_date":
                    request.json[attr] = datetime.strptime(request.json[attr], '%Y-%m-%d')  
                setattr(task, attr, request.json[attr])

            db.session.commit()

            return make_response(task.to_dict(), 200)
        
        return make_response({"error": "No task found"}, 404)
    
    def delete(self, id):
        task = TaskById.find_task(id)

        if task:
            db.session.delete(task)
            db.session.commit()

            return make_response({"message": "Task is deleted successfully"}, 200)
        
        return make_response({"error": "No task found"}, 404)

class Subtasks(Resource):
    # /tasks/<int:task_id>/subtasks

    def get(self, task_id):

        if 'user_id' in session:
            task = Task.query.filter(Task.id == task_id, Task.user_id == session['user_id']).first()

            if task:
                my_subtasks = Subtask.query.filter(Subtask.task_id == task_id).all()

                if len(my_subtasks) > 0:
                    subtasks = [subtask.to_dict() for subtask in my_subtasks]
                    return make_response(subtasks, 200)
             
            return make_response({"message": "No subtask created yet"}, 200)
        
        return make_response({"error": "Pls log in to view subtasks."}, 401)
    
    def post(self, task_id):
        subtask_name = request.json.get('subtask_name')
        subtask_due_date = datetime.strptime(request.json.get('subtask_due_date'), '%Y-%m-%d')
        subtask_status = request.json.get('subtask_status', 'pending')

        new_subtask = Subtask(subtask_name=subtask_name, task_id=task_id, subtask_due_date=subtask_due_date, subtask_status=subtask_status)

        db.session.add(new_subtask)
        db.session.commit()

        if new_subtask.id:
            return make_response(new_subtask.to_dict(), 201)
        
        return make_response({"error": "error occurred"})

# class SubtaskById(Resource):
#     # /tasks/<int:id>/subtasks/<int:id>

#     @classmethod
#     def find_subtask(cls, task_id, subtask_id):
#         return Subtask.query.filter(and_(Subtask.id == subtask_id, Subtask.task_id == task_id, Subtask.task.has(Task.user_id == session['user_id']))).first()
    
#     def get(self, task_id, subtask_id):
#         subtask = SubtaskById.find_subtask(task_id, subtask_id)

#         if subtask:
#             return make_response(subtask.to_dict(), 200)

#         return make_response({"error": "This subtask doesn't exist or you may not have permission to view this subtask"}, 401)


# class AddTags(Resource):
#     # /tasks/<int:id>/addtags

#     @classmethod
#     def find_task(cls, id):
#         task = Task.query.filter(Task.id == id).first()

#         if not task:
#             return make_response({"error": "Task not found"}, 404)

#     def get(self, id):
#         tags = AddTags.find_task(id)
        

api.add_resource(Signup, '/signup', endpoint="signup")
api.add_resource(Login, '/login', endpoint="login")
api.add_resource(Logout, '/logout', endpoint="logout")
api.add_resource(CheckSession, '/me', endpoint="me")

api.add_resource(Tasks, '/tasks', endpoint='tasks')
api.add_resource(TaskById, '/tasks/<int:id>')

api.add_resource(Subtasks, '/tasks/<int:task_id>/subtasks')

# api.add_resource(SubtaskById, '/tasks/<int:task_id>/subtasks/<int:subtask_id>')

if __name__ == "__main__":
    app.run(port=4000, debug=True)