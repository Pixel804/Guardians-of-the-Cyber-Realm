from flask import jsonify
from api import monitoring_bp

@monitoring_bp.route('/status', methods=['GET'])
def check_status():
    return jsonify({"status": "System is running"}), 200
