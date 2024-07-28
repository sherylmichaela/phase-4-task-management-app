from config import app, db
from models import User, Task

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
    
def enter_user():
    with app.app_context():
        user = User(username="sheryl", email="sheryl@gmail.com")
        db.session.add(user)
        db.session.commit()
        print('New user entered!')

if __name__ == '__main__':
    pass
    # delete_all_users()
    delete_all_tasks()
    # enter_user()