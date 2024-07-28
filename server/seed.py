from config import app, db
from models import User

def delete_all_users():
    with app.app_context():
        User.query.delete()
        db.session.commit()
    

def enter_user():
    with app.app_context():
        user = User(username="sheryl", email="sheryl@gmail.com")
        db.session.add(user)
        db.session.commit()

if __name__ == '__main__':
    pass
    delete_all_users()
    # enter_user()

    print('Seeding successful!')