from flask import Blueprint, jsonify, request
from models import db, JobPosting

jobs_bp = Blueprint('jobs_api', __name__, url_prefix='/api')

@jobs_bp.route('/jobs', methods=['GET'])
def get_jobs():
    jobs = JobPosting.query.filter_by(status='Active').order_by(JobPosting.created_at.desc()).limit(20).all()
    jobs_data = []
    for j in jobs:
        jobs_data.append({
            'id': j.id,
            'title': j.title,
            'company': j.company_name or "Unknown Company",
            'location': j.location,
            'job_type': j.job_type,
            'salary_range': j.salary_range,
            'description': j.description,
            'requirements': j.requirements,
            'created_at': j.created_at.strftime('%b %d, %Y') if j.created_at else ''
        })
    return jsonify({'jobs': jobs_data})

@jobs_bp.route('/jobs/<int:job_id>', methods=['GET'])
def get_job_detail(job_id):
    j = db.session.get(JobPosting, job_id)
    if not j:
        return jsonify({'error': 'Job posting not found'}), 404
    return jsonify({
        'id': j.id,
        'title': j.title,
        'company': j.company_name or "Unknown Company",
        'location': j.location,
        'job_type': j.job_type,
        'salary_range': j.salary_range,
        'description': j.description,
        'requirements': j.requirements,
        'created_at': j.created_at.strftime('%b %d, %Y') if j.created_at else ''
    })
