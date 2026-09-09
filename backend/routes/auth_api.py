from flask import Blueprint, jsonify, request, session
from models import db, User, UserProfile

auth_bp = Blueprint('auth_api', __name__, url_prefix='/api/auth')

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    if 'user_id' not in session:
        return jsonify({'authenticated': False, 'user': None})
    user = db.session.get(User, session['user_id'])
    if not user:
        return jsonify({'authenticated': False, 'user': None})
    
    prof_data = session.get('profile_data')
    if not prof_data and user.seeker_profile:
        prof_data = {
            'full_name': user.seeker_profile.full_name or '',
            'phone': user.seeker_profile.phone or '',
            'headline': user.seeker_profile.headline or '',
            'skills': user.seeker_profile.skills or '',
            'location': user.seeker_profile.location or '',
            'bio': user.seeker_profile.bio or '',
            'resume_filename': user.seeker_profile.resume_filename or ''
        }

    return jsonify({
        'authenticated': True,
        'user': {
            'id': user.id,
            'email': user.email,
            'full_name': user.full_name,
            'role': user.role,
            'profile': prof_data or {}
        }
    })

@auth_bp.route('/login', methods=['POST'])
def login_api():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password required'}), 400

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        session['user_id'] = user.id
        session['user_role'] = user.role
        return jsonify({
            'success': True,
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name,
                'role': user.role
            }
        })
    return jsonify({'error': 'Invalid credentials'}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout_api():
    session.clear()
    return jsonify({'success': True})
