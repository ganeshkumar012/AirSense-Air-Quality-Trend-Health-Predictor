from flask import Flask
from flask_cors import CORS
from config import Config
from routes.air_quality import air_quality_bp
from routes.prediction import prediction_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    
    # Register Blueprints
    app.register_blueprint(air_quality_bp, url_prefix='/api')
    app.register_blueprint(prediction_bp, url_prefix='/api')
    
    @app.route('/')
    def index():
        return {"message": "AirSense API is running", "status": "success"}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=app.config['PORT'], debug=app.config['DEBUG'])
