# import os
# from dotenv import load_dotenv

# load_dotenv()

# class Config:
#     MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/airsense")
#     PORT = int(os.getenv("PORT", 5000))
#     DEBUG = os.getenv("DEBUG", "True") == "True"
#     SECRET_KEY = os.getenv("SECRET_KEY", "yoursecretkeyhere")
#     UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')

# if not os.path.exists(Config.UPLOAD_FOLDER):
#     os.makedirs(Config.UPLOAD_FOLDER)


import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, '.env'))

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/airsense")
    PORT = int(os.getenv("PORT", 5000))
    DEBUG = os.getenv("DEBUG", "True") == "True"
    SECRET_KEY = os.getenv("SECRET_KEY", "yoursecretkeyhere")
    UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')

if not os.path.exists(Config.UPLOAD_FOLDER):
    os.makedirs(Config.UPLOAD_FOLDER)
