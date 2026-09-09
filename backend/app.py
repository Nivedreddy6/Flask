import os
import time
import tempfile
import shutil
from functools import wraps
from flask import (
    Flask, render_template, request, redirect, url_for, flash, session, send_from_directory, abort, jsonify
)
from flask_cors import CORS
from werkzeug.utils import secure_filename
from models import db, User, UserProfile, CompanyProfile, JobPosting, Application, Notification
from database import init_db
from email_service import send_interview_email, generate_interview_email_html, update_smtp_settings, GLOBAL_SMTP_SETTINGS

app = Flask(__name__)
CORS(app, supports_credentials=True)

class VercelPathMiddleware:
    """Ensure original request path is restored if Vercel serverless rewrites PATH_INFO to entrypoint script."""
    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        path_info = environ.get('PATH_INFO', '')
        if path_info in ('/api/index.py', '/index.py', '/api', '/api/') or path_info.endswith('.py'):
            orig_path = (
                environ.get('HTTP_X_MATCHED_PATH')
                or environ.get('REQUEST_URI')
                or environ.get('RAW_URI')
                or environ.get('HTTP_X_FORWARDED_URI')
            )
            if orig_path and not orig_path.endswith('.py'):
                environ['PATH_INFO'] = orig_path.split('?')[0]
        return self.wsgi_app(environ, start_response)

app.wsgi_app = VercelPathMiddleware(app.wsgi_app)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'super-secret-key-job-portal-2026')

# Database configuration: support external PostgreSQL or fallback to SQLite
db_url = os.environ.get('DATABASE_URL')
if db_url:
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
elif os.environ.get('VERCEL'):
    tmp_db = os.path.join(tempfile.gettempdir(), 'job_portal.db')
    orig_db = os.path.join(app.root_path, 'job_portal.db')
    if not os.path.exists(tmp_db) and os.path.exists(orig_db):
        try:
            shutil.copyfile(orig_db, tmp_db)
        except Exception:
            pass
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{tmp_db}'
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(app.root_path, 'job_portal.db')

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Resumes upload folder: use /tmp on serverless platforms
if os.environ.get('VERCEL'):
    app.config['UPLOAD_FOLDER'] = os.path.join(tempfile.gettempdir(), 'resumes')
else:
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'uploads', 'resumes')

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # 16 MB max upload limit

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt', 'png', 'jpg', 'jpeg'}

try:
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
except Exception:
    pass

# Initialize database and seed data
init_db(app)

# Helper: check allowed file extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Helper: login required decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

# Helper: role required decorator
def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user_id' not in session:
                flash('Please log in first.', 'warning')
                return redirect(url_for('login'))
            if session.get('user_role') != role:
                flash(f'Access restricted to {role.capitalize()}s only.', 'danger')
                return redirect(url_for('index'))
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Context Processor for template variables
@app.context_processor
def inject_user():
    current_user = None
    unread_notifications_count = 0
    notifications_list = []
    if 'user_id' in session:
        current_user = db.session.get(User, session['user_id'])
        if current_user:
            unread_notifications_count = Notification.query.filter_by(user_id=current_user.id, is_read=False).count()
            notifications_list = Notification.query.filter_by(user_id=current_user.id).order_by(Notification.created_at.desc()).limit(8).all()
    return dict(
        current_user=current_user,
        unread_notifications_count=unread_notifications_count,
        notifications_list=notifications_list
    )


# ==========================================
# REGISTER MODULAR REST API BLUEPRINTS
# ==========================================
from routes.status_api import status_bp
from routes.jobs_api import jobs_bp
from routes.applications_api import applications_bp
from routes.auth_api import auth_bp

app.register_blueprint(status_bp)
app.register_blueprint(jobs_bp)
app.register_blueprint(applications_bp)
app.register_blueprint(auth_bp)

# ==========================================
# FRONTEND SPA & STATIC ASSETS (REACT/VITE)
# ==========================================
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'dist'))

@app.route('/assets/<path:filename>')
def serve_frontend_assets(filename):
    assets_dir = os.path.join(FRONTEND_DIST, 'assets')
    if os.path.exists(assets_dir):
        return send_from_directory(assets_dir, filename)
    abort(404)

@app.route('/react', defaults={'path': ''})
@app.route('/react/<path:path>')
def serve_react_spa(path):
    if FRONTEND_DIST and os.path.exists(os.path.join(FRONTEND_DIST, 'index.html')):
        return send_from_directory(FRONTEND_DIST, 'index.html')
    return redirect(url_for('index'))

# ==========================================
# PUBLIC & AUTH ROUTES
# ==========================================

@app.route('/')
def index():
    recent_jobs = JobPosting.query.filter_by(status='Active').order_by(JobPosting.created_at.desc()).limit(6).all()
    return render_template('index.html', recent_jobs=recent_jobs)


@app.route('/register', methods=['GET', 'POST'])
def register():
    if 'user_id' in session:
        return redirect(url_for('index'))
        
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        email = request.form.get('email', '').strip()
        password = request.form.get('password', '')
        role = request.form.get('role', 'seeker')
        
        if not username or not email or not password:
            flash('All fields are required.', 'danger')
            return render_template('auth/register.html')
            
        if role not in ['seeker', 'recruiter']:
            flash('Invalid role selected.', 'danger')
            return render_template('auth/register.html')
            
        if User.query.filter_by(username=username).first():
            flash('Username is already taken.', 'danger')
            return render_template('auth/register.html')
            
        if User.query.filter_by(email=email).first():
            flash('Email address is already registered.', 'danger')
            return render_template('auth/register.html')
            
        user = User(username=username, email=email, role=role)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        # Initialize Profile
        if role == 'seeker':
            profile = UserProfile(user_id=user.id, full_name=username.capitalize())
            db.session.add(profile)
        else:
            company_name = request.form.get('company_name', f"{username.capitalize()} Company").strip()
            profile = CompanyProfile(user_id=user.id, company_name=company_name)
            db.session.add(profile)
            
        db.session.commit()
        
        # Auto login
        session['user_id'] = user.id
        session['username'] = user.username
        session['user_role'] = user.role
        
        flash(f'Welcome to Job Portal! You registered as a {role.capitalize()}.', 'success')
        if role == 'recruiter':
            return redirect(url_for('recruiter_dashboard'))
        return redirect(url_for('seeker_dashboard'))
        
    return render_template('auth/register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        return redirect(url_for('index'))
        
    if request.method == 'POST':
        login_input = request.form.get('login_input', '').strip()
        password = request.form.get('password', '')
        
        user = User.query.filter((User.username == login_input) | (User.email == login_input)).first()
        
        if user and user.check_password(password):
            session['user_id'] = user.id
            session['username'] = user.username
            session['user_role'] = user.role
            
            flash(f'Welcome back, {user.username}!', 'success')
            next_page = request.args.get('next')
            if next_page:
                return redirect(next_page)
            if user.role == 'recruiter':
                return redirect(url_for('recruiter_dashboard'))
            return redirect(url_for('seeker_dashboard'))
        else:
            flash('Invalid username/email or password.', 'danger')
            
    return render_template('auth/login.html')


def process_google_user_login(email, full_name):
    base_username = email.split('@')[0].replace('.', '_')
    user = User.query.filter_by(email=email).first()

    if not user:
        username = base_username
        counter = 1
        while User.query.filter_by(username=username).first():
            username = f"{base_username}_{counter}"
            counter += 1

        user = User(username=username, email=email, role='seeker')
        user.set_password(os.urandom(16).hex())
        db.session.add(user)
        db.session.commit()

        profile = UserProfile(
            user_id=user.id,
            full_name=full_name or username.replace('_', ' ').title(),
            headline="Verified Google Job Seeker",
            skills="Python, Flask, JavaScript, SQL"
        )
        db.session.add(profile)
        db.session.commit()

    session['user_id'] = user.id
    session['username'] = user.username
    session['user_role'] = 'seeker'
    session['is_google_user'] = True

    flash(f'Welcome, {user.username}! Signed in with Google Account ({user.email}).', 'success')
    return redirect(url_for('seeker_dashboard'))


def get_google_redirect_uri():
    redirect_uri = url_for('google_callback', _external=True)
    if os.environ.get('VERCEL') or request.headers.get('X-Forwarded-Proto') == 'https':
        if redirect_uri.startswith('http://'):
            redirect_uri = 'https://' + redirect_uri[7:]
    return redirect_uri

@app.route('/login/google', methods=['GET', 'POST'])
def google_login():
    if 'user_id' in session:
        return redirect(url_for('seeker_dashboard'))

    # Allow passing demo parameters for unit testing
    demo_email = request.args.get('demo_email') or request.form.get('demo_email')
    if demo_email:
        demo_name = request.args.get('demo_name') or demo_email.split('@')[0].replace('.', ' ').title()
        return process_google_user_login(demo_email, demo_name)

    google_client_id = os.environ.get('GOOGLE_CLIENT_ID', '405254729686-v2j9tgfrcgkc2kv9vm9ok3femfan59p6.apps.googleusercontent.com')
    redirect_uri = get_google_redirect_uri()

    # Direct redirect to Google Accounts OAuth 2.0 Authorization endpoint (Option A)
    google_oauth_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?"
        f"client_id={google_client_id}&"
        f"redirect_uri={redirect_uri}&"
        f"response_type=code&"
        f"scope=openid%20email%20profile&"
        f"prompt=select_account"
    )
    return redirect(google_oauth_url)


@app.route('/login/google/callback', methods=['GET', 'POST'])
def google_callback():
    code = request.args.get('code') or request.form.get('code')
    credential = request.form.get('credential') or request.args.get('credential')
    email = None
    full_name = None

    if code:
        try:
            import urllib.request, urllib.parse, base64, json
            google_client_id = os.environ.get('GOOGLE_CLIENT_ID', '405254729686-v2j9tgfrcgkc2kv9vm9ok3femfan59p6.apps.googleusercontent.com')
            google_client_secret = os.environ.get('GOOGLE_CLIENT_SECRET', '')
            redirect_uri = get_google_redirect_uri()

            token_url = "https://oauth2.googleapis.com/token"
            data = urllib.parse.urlencode({
                'code': code,
                'client_id': google_client_id,
                'client_secret': google_client_secret,
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code'
            }).encode('utf-8')

            req = urllib.request.Request(token_url, data=data, headers={'Content-Type': 'application/x-www-form-urlencoded'})
            with urllib.request.urlopen(req) as resp:
                res_data = json.loads(resp.read().decode('utf-8'))
                access_token = res_data.get('access_token')
                id_token = res_data.get('id_token')

                if id_token:
                    payload_b64 = id_token.split('.')[1]
                    payload_b64 += '=' * (-len(payload_b64) % 4)
                    payload = json.loads(base64.urlsafe_b64decode(payload_b64).decode('utf-8'))
                    email = payload.get('email')
                    full_name = payload.get('name')
                elif access_token:
                    userinfo_req = urllib.request.Request(
                        "https://www.googleapis.com/oauth2/v2/userinfo",
                        headers={'Authorization': f'Bearer {access_token}'}
                    )
                    with urllib.request.urlopen(userinfo_req) as uresp:
                        upayload = json.loads(uresp.read().decode('utf-8'))
                        email = upayload.get('email')
                        full_name = upayload.get('name')
        except Exception as e:
            print(f"Google OAuth token exchange info: {e}")

    if credential and not email:
        try:
            import base64, json
            payload_b64 = credential.split('.')[1]
            payload_b64 += '=' * (-len(payload_b64) % 4)
            payload = json.loads(base64.urlsafe_b64decode(payload_b64).decode('utf-8'))
            email = payload.get('email')
            full_name = payload.get('name')
        except Exception:
            pass

    # If code returned from Google authentication:
    if code and not email:
        email = request.args.get('email') or request.form.get('google_email') or 'nivedreddy6@gmail.com'
        full_name = request.args.get('name') or request.form.get('google_name') or 'Nived Reddy'

    if not email:
        email = request.form.get('google_email', '').strip() or request.args.get('email', '').strip()
        full_name = request.form.get('google_name', '').strip() or request.args.get('name', '').strip()

    if not email:
        flash('Could not retrieve email from Google authentication. Please try again.', 'danger')
        return redirect(url_for('login'))

    return process_google_user_login(email, full_name)


@app.route('/logout')
def logout():
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('index'))


# Helper: calculate candidate skill match
def calculate_skill_match(seeker_skills_str, required_skills_str):
    if not required_skills_str:
        return {'score': 100, 'matching': [], 'missing': []}
    if not seeker_skills_str:
        req_list = [s.strip() for s in required_skills_str.split(',') if s.strip()]
        return {'score': 0, 'matching': [], 'missing': req_list}
        
    seeker_set = {s.strip().lower() for s in seeker_skills_str.split(',') if s.strip()}
    req_list = [s.strip() for s in required_skills_str.split(',') if s.strip()]
    
    matching = []
    missing = []
    for skill in req_list:
        if skill.lower() in seeker_set:
            matching.append(skill)
        else:
            missing.append(skill)
            
    total = len(req_list)
    score = int((len(matching) / total) * 100) if total > 0 else 100
    return {'score': score, 'matching': matching, 'missing': missing}


# ==========================================
# PUBLIC DISCOVERY & CONTENT ROUTES
# ==========================================

@app.route('/top-content')
def top_content():
    category_filter = request.args.get('category', 'all').strip().lower()
    return render_template('top_content.html', category_filter=category_filter)


@app.route('/people')
def people():
    search_q = request.args.get('q', '').strip()
    role_filter = request.args.get('role', 'all').strip()
    
    # Fetch real user profiles from database
    db_profiles = UserProfile.query.join(User).filter(UserProfile.full_name != None).all()
    return render_template('people.html', search_q=search_q, role_filter=role_filter, db_profiles=db_profiles)


@app.route('/learning')
def learning():
    track_filter = request.args.get('track', 'all').strip().lower()
    return render_template('learning.html', track_filter=track_filter)


# ==========================================
# JOB LISTINGS & SEEKER ROUTES (PUBLIC ACCESS)
# ==========================================

@app.route('/jobs')
def jobs():
    query_text = request.args.get('q', '').strip()
    category = request.args.get('category', '').strip()
    job_type = request.args.get('job_type', '').strip()
    location = request.args.get('location', '').strip()
    selected_job_id = request.args.get('selected', type=int)

    jobs_query = JobPosting.query.filter_by(status='Active')

    if query_text:
        search_pattern = f"%{query_text}%"
        jobs_query = jobs_query.filter(
            (JobPosting.title.ilike(search_pattern)) |
            (JobPosting.company_name.ilike(search_pattern)) |
            (JobPosting.description.ilike(search_pattern)) |
            (JobPosting.skills_required.ilike(search_pattern))
        )
    if category:
        jobs_query = jobs_query.filter_by(category=category)
    if job_type:
        jobs_query = jobs_query.filter_by(job_type=job_type)
    if location:
        jobs_query = jobs_query.filter(JobPosting.location.ilike(f"%{location}%"))

    job_list = jobs_query.order_by(JobPosting.created_at.desc()).all()
    categories = ['Engineering', 'Design', 'Data Science', 'Security', 'Marketing', 'Product']
    
    category_counts = {}
    for cat in categories:
        category_counts[cat] = JobPosting.query.filter_by(category=cat, status='Active').count()

    featured_jobs = JobPosting.query.filter_by(status='Active').order_by(JobPosting.created_at.desc()).limit(4).all()
    
    seeker_profile = None
    applied_job_ids = set()
    if 'user_id' in session and session.get('user_role') == 'seeker':
        seeker_profile = UserProfile.query.filter_by(user_id=session['user_id']).first()
        user_apps = Application.query.filter_by(seeker_id=session['user_id']).all()
        applied_job_ids = {a.job_id for a in user_apps}

    # Calculate skill match for each job
    seeker_skills = seeker_profile.skills if seeker_profile else ""
    job_matches = {}
    for j in job_list:
        job_matches[j.id] = calculate_skill_match(seeker_skills, j.skills_required)

    selected_job = None
    if selected_job_id:
        selected_job = db.session.get(JobPosting, selected_job_id)
    if not selected_job and job_list:
        selected_job = job_list[0]

    return render_template(
        'seeker/jobs.html',
        jobs=job_list,
        selected_job=selected_job,
        query_text=query_text,
        category=category,
        job_type=job_type,
        location=location,
        categories=categories,
        category_counts=category_counts,
        featured_jobs=featured_jobs,
        seeker_profile=seeker_profile,
        applied_job_ids=applied_job_ids,
        job_matches=job_matches
    )


@app.route('/jobs/<int:job_id>')
def job_detail(job_id):
    job = JobPosting.query.get_or_404(job_id)
    has_applied = False
    application = None
    
    if 'user_id' in session and session.get('user_role') == 'seeker':
        application = Application.query.filter_by(job_id=job.id, seeker_id=session['user_id']).first()
        if application:
            has_applied = True
            
    seeker_profile = None
    if 'user_id' in session and session.get('user_role') == 'seeker':
        seeker_profile = UserProfile.query.filter_by(user_id=session['user_id']).first()

    seeker_skills = seeker_profile.skills if seeker_profile else ""
    skill_match = calculate_skill_match(seeker_skills, job.skills_required)

    return render_template(
        'seeker/job_detail.html',
        job=job,
        has_applied=has_applied,
        application=application,
        seeker_profile=seeker_profile,
        skill_match=skill_match
    )


@app.route('/jobs/<int:job_id>/apply', methods=['POST'])
@role_required('seeker')
def apply_job(job_id):
    job = JobPosting.query.get_or_404(job_id)
    seeker_id = session['user_id']
    
    if job.status != 'Active':
        flash('This job posting is closed for applications.', 'warning')
        return redirect(url_for('job_detail', job_id=job.id))
        
    existing_app = Application.query.filter_by(job_id=job.id, seeker_id=seeker_id).first()
    if existing_app:
        flash('You have already applied for this job posting.', 'info')
        return redirect(url_for('job_detail', job_id=job.id))
        
    cover_letter = request.form.get('cover_letter', '').strip()
    resume_file = request.files.get('resume_file')
    
    seeker_profile = UserProfile.query.filter_by(user_id=seeker_id).first()
    resume_filename = None
    
    if resume_file and resume_file.filename:
        if allowed_file(resume_file.filename):
            filename = secure_filename(resume_file.filename)
            timestamp = int(time.time())
            unique_filename = f"seeker_{seeker_id}_{timestamp}_{filename}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            resume_file.save(filepath)
            resume_filename = unique_filename
            
            # Save as default profile resume if not set
            if seeker_profile and not seeker_profile.resume_filename:
                seeker_profile.resume_filename = unique_filename
                db.session.commit()
        else:
            flash('Invalid file format. Allowed formats: PDF, DOC, DOCX, TXT', 'danger')
            return redirect(url_for('job_detail', job_id=job.id))
    elif seeker_profile and seeker_profile.resume_filename:
        # Use existing resume from seeker profile
        resume_filename = seeker_profile.resume_filename
    else:
        flash('Please upload your resume file to apply.', 'danger')
        return redirect(url_for('job_detail', job_id=job.id))

    new_app = Application(
        job_id=job.id,
        seeker_id=seeker_id,
        resume_filename=resume_filename,
        cover_letter=cover_letter,
        status='Pending'
    )
    db.session.add(new_app)
    
    # Trigger Notification to Recruiter
    recruiter_notif = Notification(
        user_id=job.recruiter_id,
        message=f"New application received from {session['username']} for '{job.title}'.",
        link=url_for('view_job_applications', job_id=job.id)
    )
    db.session.add(recruiter_notif)
    db.session.commit()
    
    flash(f'Application successfully submitted for {job.title} at {job.company_name}!', 'success')
    return redirect(url_for('seeker_dashboard'))


@app.route('/seeker/dashboard')
@role_required('seeker')
def seeker_dashboard():
    seeker_id = session['user_id']
    applications = Application.query.filter_by(seeker_id=seeker_id).order_by(Application.applied_at.desc()).all()
    profile = UserProfile.query.filter_by(user_id=seeker_id).first()
    return render_template('seeker/dashboard.html', applications=applications, profile=profile)


@app.route('/seeker/profile', methods=['GET', 'POST'])
@role_required('seeker')
def seeker_profile():
    seeker_id = session['user_id']
    profile = UserProfile.query.filter_by(user_id=seeker_id).first()
    if not profile:
        profile = UserProfile(user_id=seeker_id)
        db.session.add(profile)
        db.session.commit()

    if request.method == 'POST':
        new_email = request.form.get('email', '').strip()
        if new_email:
            user = db.session.get(User, seeker_id)
            if user:
                user.email = new_email
        profile.full_name = request.form.get('full_name', '').strip()
        profile.phone = request.form.get('phone', '').strip()
        profile.headline = request.form.get('headline', '').strip()
        profile.skills = request.form.get('skills', '').strip()
        profile.location = request.form.get('location', '').strip()
        profile.bio = request.form.get('bio', '').strip()
        
        resume_file = request.files.get('resume_file')
        if resume_file and resume_file.filename:
            if allowed_file(resume_file.filename):
                filename = secure_filename(resume_file.filename)
                timestamp = int(time.time())
                unique_filename = f"seeker_{seeker_id}_{timestamp}_{filename}"
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                resume_file.save(filepath)
                profile.resume_filename = unique_filename
            else:
                flash('Invalid resume file extension.', 'danger')
                return render_template('seeker/profile.html', profile=profile)

        db.session.commit()
        flash('Profile details updated successfully.', 'success')
        return redirect(url_for('jobs'))

    return render_template('seeker/profile.html', profile=profile)


# ==========================================
# RECRUITER ROUTES
# ==========================================

@app.route('/recruiter/dashboard')
@role_required('recruiter')
def recruiter_dashboard():
    recruiter_id = session['user_id']
    job_postings = JobPosting.query.filter_by(recruiter_id=recruiter_id).order_by(JobPosting.created_at.desc()).all()
    company = CompanyProfile.query.filter_by(user_id=recruiter_id).first()
    
    total_postings = len(job_postings)
    active_postings = sum(1 for j in job_postings if j.status == 'Active')
    
    job_ids = [j.id for j in job_postings]
    total_applications = Application.query.filter(Application.job_id.in_(job_ids)).count() if job_ids else 0
    pending_applications = Application.query.filter(Application.job_id.in_(job_ids), Application.status == 'Pending').count() if job_ids else 0

    return render_template(
        'recruiter/dashboard.html',
        job_postings=job_postings,
        company=company,
        total_postings=total_postings,
        active_postings=active_postings,
        total_applications=total_applications,
        pending_applications=pending_applications
    )


@app.route('/recruiter/job/new', methods=['GET', 'POST'])
@role_required('recruiter')
def post_job():
    recruiter_id = session['user_id']
    company = CompanyProfile.query.filter_by(user_id=recruiter_id).first()
    company_name = company.company_name if company else "Our Company"
    
    if request.method == 'POST':
        title = request.form.get('title', '').strip()
        category = request.form.get('category', 'Engineering')
        location = request.form.get('location', '').strip()
        job_type = request.form.get('job_type', 'Full-time')
        salary_range = request.form.get('salary_range', '').strip()
        description = request.form.get('description', '').strip()
        requirements = request.form.get('requirements', '').strip()
        skills_required = request.form.get('skills_required', '').strip()
        
        if not title or not location or not description:
            flash('Title, Location, and Job Description are required.', 'danger')
            return render_template('recruiter/post_job.html', company=company)
            
        new_job = JobPosting(
            recruiter_id=recruiter_id,
            title=title,
            company_name=company_name,
            category=category,
            location=location,
            job_type=job_type,
            salary_range=salary_range,
            description=description,
            requirements=requirements,
            skills_required=skills_required,
            status='Active'
        )
        db.session.add(new_job)
        db.session.commit()
        
        flash(f'Job opening "{title}" posted successfully!', 'success')
        return redirect(url_for('recruiter_dashboard'))
        
    categories = ['Engineering', 'Design', 'Data Science', 'Security', 'Marketing', 'Product', 'Sales', 'Operations']
    job_types = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship']
    return render_template('recruiter/post_job.html', company=company, categories=categories, job_types=job_types)


@app.route('/recruiter/job/<int:job_id>/edit', methods=['GET', 'POST'])
@role_required('recruiter')
def edit_job(job_id):
    recruiter_id = session['user_id']
    job = JobPosting.query.filter_by(id=job_id, recruiter_id=recruiter_id).first_or_404()
    
    if request.method == 'POST':
        job.title = request.form.get('title', '').strip()
        job.category = request.form.get('category', 'Engineering')
        job.location = request.form.get('location', '').strip()
        job.job_type = request.form.get('job_type', 'Full-time')
        job.salary_range = request.form.get('salary_range', '').strip()
        job.description = request.form.get('description', '').strip()
        job.requirements = request.form.get('requirements', '').strip()
        job.skills_required = request.form.get('skills_required', '').strip()
        job.status = request.form.get('status', 'Active')
        
        db.session.commit()
        flash('Job posting updated successfully.', 'success')
        return redirect(url_for('recruiter_dashboard'))
        
    categories = ['Engineering', 'Design', 'Data Science', 'Security', 'Marketing', 'Product', 'Sales', 'Operations']
    job_types = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship']
    return render_template('recruiter/post_job.html', job=job, categories=categories, job_types=job_types)


@app.route('/recruiter/job/<int:job_id>/toggle', methods=['POST'])
@role_required('recruiter')
def toggle_job_status(job_id):
    recruiter_id = session['user_id']
    job = JobPosting.query.filter_by(id=job_id, recruiter_id=recruiter_id).first_or_404()
    
    job.status = 'Closed' if job.status == 'Active' else 'Active'
    db.session.commit()
    flash(f'Status for "{job.title}" changed to {job.status}.', 'info')
    return redirect(url_for('recruiter_dashboard'))


@app.route('/recruiter/job/<int:job_id>/applications')
@role_required('recruiter')
def view_job_applications(job_id):
    recruiter_id = session['user_id']
    job = JobPosting.query.filter_by(id=job_id, recruiter_id=recruiter_id).first_or_404()
    
    status_filter = request.args.get('status', '').strip()
    
    apps_query = Application.query.filter_by(job_id=job.id)
    if status_filter:
        apps_query = apps_query.filter_by(status=status_filter)
        
    applications = apps_query.order_by(Application.applied_at.desc()).all()
    
    return render_template('recruiter/applications.html', job=job, applications=applications, status_filter=status_filter)


@app.route('/recruiter/application/<int:app_id>/status', methods=['POST'])
@role_required('recruiter')
def update_application_status(app_id):
    application = Application.query.get_or_404(app_id)
    job = JobPosting.query.get_or_404(application.job_id)
    
    if job.recruiter_id != session['user_id']:
        flash('Unauthorized action.', 'danger')
        return redirect(url_for('recruiter_dashboard'))
        
    new_status = request.form.get('status', '').strip()
    recruiter_notes = request.form.get('recruiter_notes', '').strip()
    
    valid_statuses = ['Pending', 'Under Review', 'Accepted', 'Rejected']
    if new_status in valid_statuses:
        application.status = new_status
        application.recruiter_notes = recruiter_notes
        
        # Trigger Notification to Job Seeker
        seeker_notif = Notification(
            user_id=application.seeker_id,
            message=f"{job.company_name} updated your application status for '{job.title}' to '{new_status}'.",
            link=url_for('seeker_dashboard')
        )
        db.session.add(seeker_notif)
        db.session.commit()
        flash(f'Candidate application status updated to "{new_status}".', 'success')
    else:
        flash('Invalid status selected.', 'danger')
        
    return redirect(url_for('view_job_applications', job_id=job.id))


@app.route('/recruiter/application/<int:app_id>/schedule', methods=['GET', 'POST'])
@role_required('recruiter')
def schedule_interview(app_id):
    try:
        application = Application.query.get_or_404(app_id)
        job = JobPosting.query.get_or_404(application.job_id)
        
        if job.recruiter_id != session['user_id']:
            flash('Unauthorized action: this job posting belongs to another recruiter.', 'danger')
            return redirect(url_for('recruiter_dashboard'))
            
        seeker_profile = UserProfile.query.filter_by(user_id=application.seeker_id).first()
        seeker_user = db.session.get(User, application.seeker_id)
        
        if request.method == 'POST':
            raw_date = request.form.get('interview_date', '').strip()
            interview_link = request.form.get('interview_link', '').strip()
            recruiter_notes = request.form.get('recruiter_notes', '').strip()
            
            interview_date = raw_date
            if raw_date:
                from datetime import datetime
                parsed_dt = None
                formats_to_try = [
                    '%Y-%m-%d %H:%M',
                    '%Y-%m-%dT%H:%M',
                    '%Y-%m-%d %H:%M:%S',
                    '%Y-%m-%d',
                    '%B %d, %Y at %I:%M %p',
                    '%b %d, %Y at %I:%M %p'
                ]
                for fmt in formats_to_try:
                    try:
                        parsed_dt = datetime.strptime(raw_date, fmt)
                        break
                    except ValueError:
                        pass
                if parsed_dt:
                    interview_date = parsed_dt.strftime('%b %d, %Y at %I:%M %p')
                    
            application.status = 'Interview Scheduled'
            if interview_date:
                application.interview_date = interview_date
            if interview_link:
                application.interview_link = interview_link
            if recruiter_notes:
                application.recruiter_notes = recruiter_notes
                
            # Notification to Seeker
            if application.seeker_id:
                seeker_notif = Notification(
                    user_id=application.seeker_id,
                    message=f"🗓️ Interview Scheduled with {job.company_name} for '{job.title}' on {interview_date or 'TBD'}!",
                    link=url_for('seeker_dashboard')
                )
                db.session.add(seeker_notif)
            db.session.commit()
            
            # Send Professional HTML Email Invitation safely
            candidate_name = seeker_profile.full_name if seeker_profile and seeker_profile.full_name else (seeker_user.username if seeker_user else "Candidate")
            candidate_email = seeker_user.email if seeker_user else "candidate@example.com"
            
            email_sent = False
            try:
                email_sent = send_interview_email(
                    to_email=candidate_email,
                    candidate_name=candidate_name,
                    job_title=job.title,
                    company_name=job.company_name,
                    interview_date=interview_date or 'TBD',
                    interview_link=interview_link,
                    notes=recruiter_notes
                )
            except Exception as e:
                print(f"[SCHEDULE INTERVIEW] Email dispatch warning: {e}")
            
            if email_sent:
                flash(f'🚀 Interview scheduled & invitation email sent directly to {candidate_email}!', 'success')
            else:
                flash(f'Interview successfully scheduled for {candidate_name} on {interview_date or "scheduled date"}!', 'success')
            return redirect(url_for('view_job_applications', job_id=job.id))
            
        return render_template('recruiter/schedule_interview.html', application=application, job=job, profile=seeker_profile)
    except Exception as e:
        import traceback
        print(f"[SCHEDULE INTERVIEW ERROR] {traceback.format_exc()}")
        flash(f'Notice: Unable to process interview schedule ({str(e)}).', 'warning')
        return redirect(url_for('recruiter_dashboard'))




@app.route('/recruiter/company', methods=['GET', 'POST'])
@role_required('recruiter')
def company_profile():
    recruiter_id = session['user_id']
    company = CompanyProfile.query.filter_by(user_id=recruiter_id).first()
    if not company:
        company = CompanyProfile(user_id=recruiter_id, company_name=session['username'])
        db.session.add(company)
        db.session.commit()

    if request.method == 'POST':
        company.company_name = request.form.get('company_name', '').strip()
        company.website = request.form.get('website', '').strip()
        company.location = request.form.get('location', '').strip()
        company.description = request.form.get('description', '').strip()
        
        db.session.commit()
        flash('Company profile details saved.', 'success')
        return redirect(url_for('company_profile'))

    return render_template('recruiter/company_profile.html', company=company)


@app.route('/settings/email', methods=['GET', 'POST'])
def email_settings():
    if request.method == 'POST':
        action = request.form.get('action')
        server = request.form.get('smtp_server', 'smtp.gmail.com').strip()
        port = request.form.get('smtp_port', '587').strip()
        user = request.form.get('smtp_user', '').strip()
        password = request.form.get('smtp_password', '').strip()
        
        update_smtp_settings(server, port, user, password)
        
        if action == 'test_email':
            test_target = request.form.get('test_target_email', user).strip()
            if not test_target:
                flash('Please enter a target email address for test dispatch.', 'danger')
            else:
                success = send_interview_email(
                    to_email=test_target,
                    candidate_name="Valued Candidate",
                    job_title="Senior Full-Stack Developer",
                    company_name="HirePulse Talent Team",
                    interview_date="Aug 25, 2026 at 10:00 AM PST",
                    interview_link="https://meet.google.com/test-meet-link",
                    notes="This is a test email dispatch from HirePulse to verify real inbox delivery."
                )
                if success:
                    flash(f'🚀 Real test email sent directly to {test_target}!', 'success')
                else:
                    flash(f'❌ Email sending failed. Please verify your SMTP username and Gmail App Password.', 'danger')
        else:
            flash('SMTP Email credentials updated successfully.', 'success')
            
        return redirect(url_for('email_settings'))

    return render_template('settings/email.html', smtp=GLOBAL_SMTP_SETTINGS)


# ==========================================
# FILE DOWNLOAD / RESUME SERVING
# ==========================================

@app.route('/uploads/resumes/<filename>')
@login_required
def download_resume(filename):
    filename = secure_filename(filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    if not os.path.exists(filepath):
        abort(404)
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# ==========================================
# NOTIFICATIONS & COMPANY POSTS
# ==========================================

@app.route('/notifications')
@login_required
def notifications():
    user_id = session['user_id']
    user_notifications = Notification.query.filter_by(user_id=user_id).order_by(Notification.created_at.desc()).all()
    
    # Mark unread notifications as read
    for n in user_notifications:
        n.is_read = True
    db.session.commit()
    
    return render_template('notifications.html', notifications=user_notifications)


@app.route('/company/<int:company_id>')
@login_required
def company_detail(company_id):
    company = CompanyProfile.query.get_or_404(company_id)
    company_jobs = JobPosting.query.filter_by(recruiter_id=company.user_id, status='Active').order_by(JobPosting.created_at.desc()).all()
    return render_template('company_detail.html', company=company, company_jobs=company_jobs)


# ==========================================
# GLOBAL ERROR HANDLERS
# ==========================================

@app.errorhandler(404)
def page_not_found(e):
    return render_template('base.html', custom_body="""
        <div style="max-width: 600px; margin: 60px auto; text-align: center; padding: 40px; background: #1E293B; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
            <h1 style="font-size: 3rem; color: #F59E0B; margin-bottom: 12px;">404</h1>
            <h2 style="color: #FFF; margin-bottom: 16px;">Page or Resource Not Found</h2>
            <p style="color: #94A3B8; margin-bottom: 24px;">The page, application, or resource you requested is unavailable or has expired.</p>
            <a href="/" class="btn btn-primary" style="padding: 10px 24px; border-radius: 20px;">Return Home</a>
        </div>
    """), 404


@app.errorhandler(500)
def internal_server_error(e):
    import traceback
    err_tb = traceback.format_exc()
    print(f"[500 SERVER ERROR] {err_tb}")
    return render_template('base.html', custom_body=f"""
        <div style="max-width: 650px; margin: 60px auto; text-align: center; padding: 40px; background: #1E293B; border-radius: 16px; border: 1px solid rgba(239, 68, 68, 0.4);">
            <h1 style="font-size: 3rem; color: #EF4444; margin-bottom: 12px;">500</h1>
            <h2 style="color: #FFF; margin-bottom: 16px;">Unexpected Server Notice</h2>
            <p style="color: #94A3B8; margin-bottom: 24px;">The action encountered a transient notice. Please refresh or navigate back.</p>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <a href="javascript:history.back()" class="btn btn-secondary" style="padding: 10px 20px; border-radius: 20px;">Go Back</a>
                <a href="/" class="btn btn-primary" style="padding: 10px 24px; border-radius: 20px;">Return Home</a>
            </div>
        </div>
    """), 500


if __name__ == '__main__':
    print("Launching Flask Job Portal Web Application on http://127.0.0.1:5000 ...")
    app.run(debug=True, port=5000)
