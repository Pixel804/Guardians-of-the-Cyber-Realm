from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # Import and register blueprints
    from api.auth import auth_bp
    from api.security import security_bp
    from api.monitoring import monitoring_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(security_bp, url_prefix="/api/security")
    app.register_blueprint(monitoring_bp, url_prefix="/api/monitoring")

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
