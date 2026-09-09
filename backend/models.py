from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(60), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False) # 'seeker' or 'recruiter'
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    # Relationships
    seeker_profile = db.relationship('UserProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    company_profile = db.relationship('CompanyProfile', backref='user', uselist=False, cascade='all, delete-orphan')
    job_postings = db.relationship('JobPosting', backref='recruiter', lazy=True, cascade='all, delete-orphan')
    applications = db.relationship('Application', backref='seeker', lazy=True, cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='user', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def is_seeker(self):
        return self.role == 'seeker'
        
    def is_recruiter(self):
        return self.role == 'recruiter'

    @property
    def full_name(self):
        if self.seeker_profile and self.seeker_profile.full_name:
            return self.seeker_profile.full_name
        return self.username.replace('_', ' ').title()


class UserProfile(db.Model):
    __tablename__ = 'user_profile'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    full_name = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    headline = db.Column(db.String(150))
    bio = db.Column(db.Text)
    skills = db.Column(db.String(255))
    location = db.Column(db.String(100))
    resume_filename = db.Column(db.String(255))


class CompanyProfile(db.Model):
    __tablename__ = 'company_profile'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    company_name = db.Column(db.String(100), nullable=False)
    logo_url = db.Column(db.String(255))
    website = db.Column(db.String(150))
    location = db.Column(db.String(100))
    description = db.Column(db.Text)


class JobPosting(db.Model):
    __tablename__ = 'job_posting'
    
    id = db.Column(db.Integer, primary_key=True)
    recruiter_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    company_name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), default='Engineering')
    location = db.Column(db.String(100), nullable=False)
    job_type = db.Column(db.String(50), nullable=False, default='Full-time')
    salary_range = db.Column(db.String(50))
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text)
    skills_required = db.Column(db.String(255))
    status = db.Column(db.String(20), default='Active') # 'Active' or 'Closed'
    created_at = db.Column(db.DateTime, default=datetime.now)
    
    # Relationships
    applications = db.relationship('Application', backref='job', lazy=True, cascade='all, delete-orphan')


class Application(db.Model):
    __tablename__ = 'application'
    
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('job_posting.id'), nullable=False)
    seeker_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    resume_filename = db.Column(db.String(255), nullable=False)
    cover_letter = db.Column(db.Text)
    status = db.Column(db.String(30), default='Pending') # 'Pending', 'Under Review', 'Interview Scheduled', 'Accepted', 'Rejected'
    recruiter_notes = db.Column(db.Text)
    interview_date = db.Column(db.String(100)) # Date & Time of scheduled interview
    interview_link = db.Column(db.String(255)) # Google Meet/Zoom link or office address
    applied_at = db.Column(db.DateTime, default=datetime.now)


class Notification(db.Model):
    __tablename__ = 'notification'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    link = db.Column(db.String(255))
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
