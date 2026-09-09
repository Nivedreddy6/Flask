import os
import re
from datetime import datetime
from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename
from models import db, Application, JobPosting, User, UserProfile, Notification
from email_service import send_interview_email

applications_bp = Blueprint('applications_api', __name__, url_prefix='/api')

def calculate_ats_score(applicant_skills, applicant_headline, job_skills, job_reqs):
    """Calculate an ATS match percentage (0-100%) and identify matched/missing keywords."""
    if not applicant_skills:
        applicant_skills = ""
    if not job_skills:
        job_skills = ""
    
    # Extract keywords
    def extract_keywords(text):
        if not text:
            return set()
        words = re.findall(r'[a-zA-Z0-9\+#\.]+', text.lower())
        stopwords = {'and', 'or', 'the', 'with', 'for', 'in', 'to', 'of', 'a', 'an', 'is', 'years', 'experience', 'strong'}
        return {w for w in words if len(w) > 1 and w not in stopwords}

    app_kw = extract_keywords(f"{applicant_skills} {applicant_headline}")
    job_kw = extract_keywords(f"{job_skills} {job_reqs}")

    if not job_kw:
        return 85, list(app_kw)[:5], []

    matched = [kw for kw in job_kw if kw in app_kw]
    missing = [kw for kw in job_kw if kw not in app_kw]

    match_ratio = len(matched) / len(job_kw)
    score = int(min(98, max(45, (match_ratio * 70) + 30)))

    return score, matched[:6], missing[:4]


@applications_bp.route('/applications', methods=['GET'])
def get_applications():
    """Fetch all candidate applications with rich ATS metadata & match score."""
    applications = Application.query.order_by(Application.applied_at.desc()).all()
    apps_data = []
    
    for a in applications:
        company = a.job.company_name if a.job else "Unknown Company"
        applicant_name = a.seeker.username if a.seeker else "Applicant"
        applicant_email = a.seeker.email if a.seeker else "candidate@example.com"
        headline = ""
        skills = ""
        resume_url = ""

        if a.seeker and a.seeker.seeker_profile:
            p = a.seeker.seeker_profile
            applicant_name = p.full_name or applicant_name
            headline = p.headline or ""
            skills = p.skills or ""

        # Calculate ATS Match Score
        job_skills = a.job.skills_required if a.job else ""
        job_reqs = a.job.requirements if a.job else ""
        ats_score, matched_kw, missing_kw = calculate_ats_score(skills, headline, job_skills, job_reqs)

        if a.resume_filename:
            resume_url = f"/static/uploads/resumes/{a.resume_filename}"

        apps_data.append({
            'id': a.id,
            'job_id': a.job_id,
            'job_title': a.job.title if a.job else "Unknown Position",
            'department': a.job.category if a.job else "Engineering",
            'company': company,
            'applicant_name': applicant_name,
            'applicant_email': applicant_email,
            'headline': headline,
            'skills': skills,
            'cover_letter': a.cover_letter or "",
            'resume_filename': a.resume_filename or "",
            'resume_url': resume_url,
            'status': a.status or 'Applied',
            'recruiter_notes': a.recruiter_notes or "",
            'interview_date': a.interview_date or "",
            'interview_link': a.interview_link or "",
            'applied_at': a.applied_at.strftime('%b %d, %Y') if a.applied_at else '',
            'ats_score': ats_score,
            'matched_keywords': matched_kw,
            'missing_keywords': missing_kw
        })
    return jsonify({'applications': apps_data})


@applications_bp.route('/applications/<int:app_id>/status', methods=['POST', 'PATCH'])
def update_application_status(app_id):
    """Transition candidate through ATS pipeline stages."""
    application = db.session.get(Application, app_id)
    if not application:
        return jsonify({'error': 'Application not found'}), 404

    data = request.get_json() or {}
    new_status = data.get('status')

    valid_statuses = ['Applied', 'Reviewing', 'Shortlisted', 'Interview Scheduled', 'Hired', 'Rejected']
    if not new_status or new_status not in valid_statuses:
        return jsonify({'error': f'Invalid status. Choose from: {", ".join(valid_statuses)}'}), 400

    old_status = application.status
    application.status = new_status

    # Create candidate notification
    if application.seeker_id:
        notif = Notification(
            user_id=application.seeker_id,
            message=f"Your application for {application.job.title if application.job else 'the position'} is now: {new_status}",
            link="/applications"
        )
        db.session.add(notif)

    db.session.commit()

    return jsonify({
        'success': True,
        'message': f'Candidate status updated from "{old_status}" to "{new_status}".',
        'application_id': application.id,
        'status': application.status
    })


@applications_bp.route('/applications/<int:app_id>/notes', methods=['POST'])
def save_application_notes(app_id):
    """Save internal recruiter notes and interview rubrics."""
    application = db.session.get(Application, app_id)
    if not application:
        return jsonify({'error': 'Application not found'}), 404

    data = request.get_json() or {}
    notes = data.get('notes', '')

    application.recruiter_notes = notes
    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Recruiter notes saved successfully.',
        'recruiter_notes': application.recruiter_notes
    })


@applications_bp.route('/applications/<int:app_id>/interview', methods=['POST'])
def schedule_application_interview(app_id):
    """Schedule candidate interview, update status, and dispatch HTML email."""
    application = db.session.get(Application, app_id)
    if not application:
        return jsonify({'error': 'Application not found'}), 404

    data = request.get_json() or {}
    interview_date = data.get('interview_date', '')
    interview_link = data.get('interview_link', '')
    recruiter_notes = data.get('notes', '')

    if not interview_date:
        return jsonify({'error': 'Please provide an interview date and time.'}), 400

    application.status = 'Interview Scheduled'
    application.interview_date = interview_date
    application.interview_link = interview_link
    if recruiter_notes:
        application.recruiter_notes = recruiter_notes

    candidate_email = application.seeker.email if application.seeker else "candidate@example.com"
    candidate_name = (
        application.seeker.seeker_profile.full_name
        if application.seeker and application.seeker.seeker_profile and application.seeker.seeker_profile.full_name
        else (application.seeker.username if application.seeker else "Candidate")
    )
    job_title = application.job.title if application.job else "Software Engineer"
    company_name = application.job.company_name if application.job else "TechCorp AI"

    # Send automated email invite
    email_sent = False
    try:
        email_sent = send_interview_email(
            candidate_email=candidate_email,
            candidate_name=candidate_name,
            job_title=job_title,
            company_name=company_name,
            interview_date=interview_date,
            interview_link=interview_link,
            notes=recruiter_notes
        )
    except Exception as e:
        print(f"Error dispatching interview email: {e}")

    # Add notification for candidate
    if application.seeker_id:
        notif = Notification(
            user_id=application.seeker_id,
            message=f"🎉 {company_name} scheduled an interview for {job_title} on {interview_date}!",
            link="/applications"
        )
        db.session.add(notif)

    db.session.commit()

    return jsonify({
        'success': True,
        'message': f'Interview successfully scheduled for {candidate_name} on {interview_date}.',
        'email_dispatched': email_sent,
        'application': {
            'id': application.id,
            'status': application.status,
            'interview_date': application.interview_date,
            'interview_link': application.interview_link,
            'recruiter_notes': application.recruiter_notes
        }
    })


@applications_bp.route('/applications/apply', methods=['POST'])
def apply_to_job():
    """Submit a candidate application with resume upload & instant ATS match calculation."""
    job_id = request.form.get('job_id') or (request.json.get('job_id') if request.is_json else None)
    seeker_name = request.form.get('name') or (request.json.get('name') if request.is_json else None) or "Candidate"
    seeker_email = request.form.get('email') or (request.json.get('email') if request.is_json else None) or "candidate@example.com"
    skills = request.form.get('skills') or (request.json.get('skills') if request.is_json else None) or ""
    headline = request.form.get('headline') or (request.json.get('headline') if request.is_json else None) or ""
    cover_letter = request.form.get('cover_letter') or (request.json.get('cover_letter') if request.is_json else None) or ""

    if not job_id:
        return jsonify({'error': 'Job ID is required.'}), 400

    job = db.session.get(JobPosting, int(job_id))
    if not job:
        return jsonify({'error': 'Job posting not found.'}), 404

    # Handle file upload if present
    resume_filename = "resume.pdf"
    if 'resume' in request.files:
        file = request.files['resume']
        if file and file.filename:
            filename = secure_filename(f"seeker_{int(datetime.now().timestamp())}_{file.filename}")
            upload_path = current_app.config.get('UPLOAD_FOLDER', os.path.join(current_app.root_path, 'static', 'uploads', 'resumes'))
            os.makedirs(upload_path, exist_ok=True)
            file.save(os.path.join(upload_path, filename))
            resume_filename = filename

    # Create seeker user if not existing
    seeker = User.query.filter_by(email=seeker_email).first()
    if not seeker:
        username = seeker_email.split('@')[0]
        seeker = User(username=username, email=seeker_email, role='seeker')
        seeker.set_password('password123')
        db.session.add(seeker)
        db.session.flush()

        profile = UserProfile(
            user_id=seeker.id,
            full_name=seeker_name,
            headline=headline,
            skills=skills,
            resume_filename=resume_filename
        )
        db.session.add(profile)
    else:
        if seeker.seeker_profile:
            if skills: seeker.seeker_profile.skills = skills
            if headline: seeker.seeker_profile.headline = headline
            if resume_filename: seeker.seeker_profile.resume_filename = resume_filename

    # Create Application
    new_app = Application(
        job_id=job.id,
        seeker_id=seeker.id,
        resume_filename=resume_filename,
        cover_letter=cover_letter,
        status='Applied'
    )
    db.session.add(new_app)

    # Add Recruiter notification
    if job.recruiter_id:
        notif = Notification(
            user_id=job.recruiter_id,
            message=f"New ATS Application: {seeker_name} applied for {job.title}.",
            link="/applications"
        )
        db.session.add(notif)

    db.session.commit()

    ats_score, matched_kw, missing_kw = calculate_ats_score(skills, headline, job.skills_required, job.requirements)

    return jsonify({
        'success': True,
        'message': f'Application submitted successfully for {job.title}!',
        'application_id': new_app.id,
        'ats_score': ats_score,
        'matched_keywords': matched_kw,
        'missing_keywords': missing_kw
    }), 201
