from pymongo import MongoClient
from config import Config

class Database:
    _instance = None
    
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            client = MongoClient(Config.MONGO_URI)
            cls._instance = client.get_database()
        return cls._instance

# Get database instance
db = Database.get_instance()

# Collections
air_quality_collection = db['air_quality_data']
processed_collection = db['processed_air_quality']
predictions_collection = db['prediction_history']
