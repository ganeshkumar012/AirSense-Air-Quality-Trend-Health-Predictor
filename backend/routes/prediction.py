import pandas as pd
from flask import Blueprint, jsonify, request
from services.ml_service import ml_service
from models.data_model import processed_collection, predictions_collection
from datetime import datetime

prediction_bp = Blueprint('prediction', __name__)

@prediction_bp.route('/train', methods=['POST'])
def train_model():
    try:
        data = list(processed_collection.find())
        if not data:
            return jsonify({"error": "No processed data available for training"}), 400
            
        df = pd.DataFrame(data)
        success = ml_service.train(df)
        
        if success:
            return jsonify({"message": "Models trained successfully"}), 200
        else:
            return jsonify({"error": "Training failed"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@prediction_bp.route('/predict', methods=['POST'])
def predict():
    try:
        content = request.json
        location = content.get('location')
        future_date = content.get('date') # Expected format YYYY-MM-DD
        
        if not location or not future_date:
            return jsonify({"error": "Location and date are required"}), 400
            
        historical_data = list(processed_collection.find({"location": location}))
        if not historical_data:
            # Fallback to any location if specified location has no data
            historical_data = list(processed_collection.find())
            
        if not historical_data:
            return jsonify({"error": "No historical data available for prediction"}), 400
            
        df = pd.DataFrame(historical_data)
        prediction_result = ml_service.predict(future_date, df)
        
        if not prediction_result:
            return jsonify({"error": "Model not trained or prediction failed"}), 500
            
        # Store in prediction history
        prediction_record = {
            "location": location,
            "target_date": future_date,
            "prediction_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            **prediction_result
        }
        predictions_collection.insert_one(prediction_record)
        
        # Remove MongoDB _id before returning
        if '_id' in prediction_record:
            prediction_record.pop('_id')
            
        return jsonify(prediction_record), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@prediction_bp.route('/recommendation/<category>', methods=['GET'])
def get_recommendation(category):
    recommendations = {
        "Safe": {
            "title": "Air Quality is Good",
            "text": "Air quality is considered satisfactory, and air pollution poses little or no risk.",
            "activities": "Normal outdoor activities",
            "color": "Green"
        },
        "Moderate": {
            "title": "Air Quality is Moderate",
            "text": "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.",
            "activities": "Sensitive groups should reduce prolonged or heavy exertion outdoors.",
            "color": "Yellow"
        },
        "Hazardous": {
            "title": "Air Quality is Hazardous",
            "text": "Health alert: everyone may experience more serious health effects.",
            "activities": "Avoid all outdoor physical activities. Everyone should stay indoors and keep activity levels low.",
            "color": "Red"
        }
    }
    
    result = recommendations.get(category, {
        "title": "Unknown Category",
        "text": "No specific recommendations available for this category.",
        "activities": "Consult local health authorities",
        "color": "Gray"
    })
    
    return jsonify(result), 200

@prediction_bp.route('/history', methods=['GET'])
def get_history():
    try:
        cursor = predictions_collection.find().sort('prediction_date', -1).limit(50)
        history = []
        for doc in cursor:
            doc['_id'] = str(doc['_id'])
            history.append(doc)
        return jsonify(history), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
