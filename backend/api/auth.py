from flask import request, jsonify
from backend.models.users import User
from backend.app import db, jwt, bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from api import auth_bp

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"message": "User already exists"}), 400

    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    
    if user and user.check_password(data['password']):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token)
    
    return jsonify({"message": "Invalid credentials"}), 401
