from flask import Blueprint, jsonify, request
from models import db, Application, JobPosting, User

applications_bp = Blueprint('applications_api', __name__, url_prefix='/api')

@applications_bp.route('/applications', methods=['GET'])
def get_applications():
    applications = Application.query.order_by(Application.applied_at.desc()).limit(20).all()
    apps_data = []
    for a in applications:
        company = a.job.company_name if a.job else "Unknown Company"
        applicant_name = a.seeker.username if a.seeker else "Applicant"
        if a.seeker and a.seeker.seeker_profile and a.seeker.seeker_profile.full_name:
            applicant_name = a.seeker.seeker_profile.full_name

        apps_data.append({
            'id': a.id,
            'job_title': a.job.title if a.job else "Unknown Position",
            'company': company,
            'applicant_name': applicant_name,
            'status': a.status,
            'applied_at': a.applied_at.strftime('%b %d, %Y') if a.applied_at else ''
        })
    return jsonify({'applications': apps_data})
