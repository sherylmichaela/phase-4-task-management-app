from config import db, bcrypt
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
import re


class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    _hashed_password = db.Column(db.String, nullable=False)

    tasks = db.relationship('Task', back_populates='user')

    serialize_rules = ('-_hashed_password', '-tasks.user')

    @hybrid_property #getter
    def hashed_password(self):
        return self._hashed_password
    
    @hashed_password.setter # name of the property
    def hashed_password(self, password):
        hashed_password = bcrypt.generate_password_hash(password.encode('utf-8'))

        self._hashed_password = hashed_password.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._hashed_password, password.encode('utf-8'))
    
    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise ValueError('username is required')
        
        # Max 20 characters long. Starts with a letter only. Can't finish with special characters at the end of the string.
        pattern = r'^[a-zA-Z][a-zA-Z0-9_.]{2,18}[a-zA-Z0-9]$'

        if not re.match(pattern, username):
            raise ValueError('invalid username')
        
        user = User.query.filter(User.username == username).first()

        if user:
            raise ValueError('username is already taken')
        
        return username
    
    @validates('email')
    def validate_password(self, key, email):
        if not email:
            raise ValueError('email is required')
        
        pattern = r'^[a-zA-Z0-9_.-]+\@[a-zA-Z0-9]+\.[a-zA-Z]{2,5}$'

        if not re.match(pattern, email):
            raise ValueError('invalid email address')
        
        return email
        
    def __repr__(self):
        return f"<User {self.id}: {self.username}>"
    

class Task(db.Model, SerializerMixin):
    __tablename__ = "tasks"

    id = db.Column(db.Integer, primary_key=True)
    task_name = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(255))
    task_due_date = db.Column(db.DateTime)
    task_status = db.Column(db.String, default="Not Completed")
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('User', back_populates='tasks')
    subtasks = db.relationship('Subtask', back_populates='task')
    tasktags = db.relationship('TaskTag', back_populates='task')
    tags = association_proxy('tasktags', 'tag', creator=lambda t: TaskTag(tag=t))

    serialize_rules = ('-user_id', '-user.tasks', '-subtasks.task', '-tasktags.task')

    def __repr__(self):
        return f"Task {self.id}: {self.task_name} due by {self.task_due_date} | Status: {self.task_status}"
    

class Tag(db.Model, SerializerMixin):
    __tablename__ = "tags"

    id = db.Column(db.Integer, primary_key=True)
    tag_name = db.Column(db.String(255), nullable=False, unique=True)

    tasktags = db.relationship('TaskTag', back_populates='tag')
    tasks = association_proxy('tasktags', 'task', creator=lambda t: TaskTag(task=t))

    serialize_rules = ('-tasktags.tag', '-tasks.tasktags')

    def __repr__(self):
        return f"Tag {self.id}: {self.tag_name}"
    

class TaskTag(db.Model, SerializerMixin): # Only main tasks (not subtasks) can be tagged
    __tablename__ = "tasktags"

    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'))
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.id'))

    task = db.relationship('Task', back_populates='tasktags')
    tag = db.relationship('Tag', back_populates='tasktags')

    serialize_rules = ('-task.tasktags', '-tag.tasktags', '-tag_id')

    def __repr__(self):
        return f"The task [{self.task.task_name}] has tag [{self.tag.tag}] "
    

class Subtask(db.Model, SerializerMixin):
    __tablename__ = "subtasks"

    id = db.Column(db.Integer, primary_key=True)
    subtask_name = db.Column(db.String(255))
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'))
    subtask_due_date = db.Column(db.DateTime)
    subtask_status = db.Column(db.String, default="Not Completed")

    task = db.relationship('Task', back_populates='subtasks')

    serialize_rules = ('-task.subtasks', )

    def __repr__(self):
        return f"Subtask: {self.subtask_name} due by {self.subtask_due_date} | Status: {self.subtask_status}"