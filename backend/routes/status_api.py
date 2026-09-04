from flask import Blueprint, jsonify
from models import db, User, JobPosting

status_bp = Blueprint('status_api', __name__, url_prefix='/api')

@status_bp.route('/status', methods=['GET'])
def get_status():
    total_jobs = JobPosting.query.filter_by(status='Active').count()
    total_users = User.query.count()
    return jsonify({
        'status': 'online',
        'framework': 'Flask 3.0 (Modular Blueprints) + React (Vite)',
        'total_active_jobs': total_jobs,
        'total_users': total_users
    })
