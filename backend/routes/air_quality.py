import os
import pandas as pd
from flask import Blueprint, jsonify, request, current_app
from werkzeug.utils import secure_filename
from models.data_model import air_quality_collection, processed_collection
from config import Config

air_quality_bp = Blueprint('air_quality', __name__)

ALLOWED_EXTENSIONS = {'csv'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@air_quality_bp.route('/data/upload', methods=['POST'])
def upload_data():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        try:
            df = pd.read_csv(filepath)
            # Basic validation of required columns
            required_cols = ['location', 'date', 'PM2.5', 'PM10', 'CO', 'NO2', 'SO2']
            if not all(col in df.columns for col in required_cols):
                return jsonify({"error": f"CSV must contain columns: {', '.join(required_cols)}"}), 400
            
            # Convert to dictionary for MongoDB
            records = df.to_dict('records')
            
            # Insert into MongoDB
            if records:
                air_quality_collection.insert_many(records)
            
            return jsonify({
                "message": "File uploaded and data stored successfully",
                "records_count": len(records)
            }), 201
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    return jsonify({"error": "Invalid file type. Only CSV allowed"}), 400

@air_quality_bp.route('/data', methods=['GET'])
def get_data():
    try:
        # Get query parameters for pagination/filtering
        location = request.args.get('location')
        query = {}
        if location:
            query['location'] = location
            
        # Limit to 100 records for performance
        cursor = air_quality_collection.find(query).sort('date', -1).limit(100)
        data = []
        for doc in cursor:
            doc['_id'] = str(doc['_id'])
            data.append(doc)
            
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@air_quality_bp.route('/preprocess', methods=['POST'])
def preprocess_data():
    try:
        # Fetch raw data
        raw_data = list(air_quality_collection.find())
        if not raw_data:
            return jsonify({"error": "No raw data found to preprocess"}), 404
        
        df = pd.DataFrame(raw_data)
        
        # 1. Remove '_id' if exists
        if '_id' in df.columns:
            df = df.drop(columns=['_id'])
            
        # 2. Handle missing values (fill with median for pollutants)
        pollutants = ['PM2.5', 'PM10', 'CO', 'NO2', 'SO2']
        for p in pollutants:
            if p in df.columns:
                df[p] = pd.to_numeric(df[p], errors='coerce')
                df[p] = df[p].fillna(df[p].median())
        
        # 3. Remove duplicate records
        df = df.drop_duplicates()
        
        # 4. Convert date formats
        df['date'] = pd.to_datetime(df['date']).dt.strftime('%Y-%m-%d')
        
        # 5. Normalize pollutant values (Optional but good for ML)
        # For simplicity, we'll store the numeric values as is, 
        # but ensure they are float types.
        for p in pollutants:
            if p in df.columns:
                df[p] = df[p].astype(float)
        
        # 6. Store in processed_air_quality
        processed_records = df.to_dict('records')
        
        # Clear existing processed data and insert new
        processed_collection.delete_many({})
        processed_collection.insert_many(processed_records)
        
        return jsonify({
            "message": "Data preprocessing completed successfully",
            "processed_count": len(processed_records)
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@air_quality_bp.route('/analysis', methods=['GET'])
def get_analysis():
    try:
        data = list(processed_collection.find())
        if not data:
            return jsonify({"error": "No processed data found"}), 404
            
        df = pd.DataFrame(data)
        pollutants = ['PM2.5', 'PM10', 'CO', 'NO2', 'SO2']
        
        stats = {
            "mean": df[pollutants].mean().to_dict(),
            "median": df[pollutants].median().to_dict(),
            "trend": df.groupby('date')[pollutants].mean().to_dict()
        }
        
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
