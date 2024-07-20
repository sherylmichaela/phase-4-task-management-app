from config import db
from sqlalchemy_serializer import SerializerMixin

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    # is_admin = db.Column(db.Integer, default=0)
    # _hashed_password = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f"<User {self.id}: {self.username}, Admin: {self.is_admin}"