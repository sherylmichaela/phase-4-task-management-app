from config import app, db
from models import User, Task, Tag, TaskTag, Subtask
def delete_all_users():
    with app.app_context():
        User.query.delete()
        db.session.commit()
        print('All users deleted!')

def delete_all_tasks():
    with app.app_context():
        Task.query.delete()
        db.session.commit()
        print('All tasks deleted!')

def delete_all_tags():
    with app.app_context():
        Tag.query.delete()
        db.session.commit()
        print('All tags deleted!')

def delete_all_tasktags():
    with app.app_context():
        TaskTag.query.delete()
        db.session.commit()
        print('All tasktags deleted!')

def delete_all_subtasks():
    with app.app_context():
        Subtask.query.delete()
        db.session.commit()
        print('All subtasks deleted!')
    
def enter_user():
    with app.app_context():
        user = User(username="sheryl", email="sheryl@gmail.com")
        db.session.add(user)
        db.session.commit()
        print('New user entered!')

if __name__ == '__main__':
    pass
    # delete_all_users()
    # delete_all_tasks()
    # delete_all_tags()
    # delete_all_tasktags()
    # delete_all_subtasks()
    # enter_user()