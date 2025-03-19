from flask import request, jsonify
from api import security_bp

@security_bp.route('/encrypt', methods=['POST'])
def encrypt_data():
    data = request.json
    message = data['message']
    encrypted_message = message[::-1] 
    return jsonify({"encrypted": encrypted_message})

@security_bp.route('/decrypt', methods=['POST'])
def decrypt_data():
    data = request.json
    encrypted_message = data['encrypted']
    decrypted_message = encrypted_message[::-1] 
    return jsonify({"decrypted": decrypted_message})
