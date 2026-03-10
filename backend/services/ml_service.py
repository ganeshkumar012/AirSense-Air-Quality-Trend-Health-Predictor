# import pandas as pd
# import numpy as np
# from sklearn.linear_model import LinearRegression
# from sklearn.ensemble import RandomForestClassifier
# from sklearn.model_selection import train_test_split
# import joblib
# import os
# from datetime import datetime, timedelta

# MODEL_DIR = os.path.join(os.getcwd(), 'backend', 'ml_model')
# if not os.path.exists(MODEL_DIR):
#     os.makedirs(MODEL_DIR)

# def calculate_aqi_category(pm25):
#     if pm25 <= 12:
#         return 'Safe'
#     elif pm25 <= 35.4:
#         return 'Moderate'
#     else:
#         return 'Hazardous'

# class MLService:
#     def __init__(self):
#         self.regression_model = None
#         self.classification_model = None
#         self.reg_path = os.path.join(MODEL_DIR, 'regression_model.joblib')
#         self.clf_path = os.path.join(MODEL_DIR, 'classification_model.joblib')
        
#     def train(self, df):
#         if df.empty:
#             return False
            
#         # Feature Engineering: Convert date to numeric (days since min date)
#         df['date'] = pd.to_datetime(df['date'])
#         min_date = df['date'].min()
#         df['days_since_start'] = (df['date'] - min_date).dt.days
        
#         # Regression: Predict PM2.5 based on days
#         X_reg = df[['days_since_start']]
#         y_reg = df['PM2.5']
        
#         self.regression_model = LinearRegression()
#         self.regression_model.fit(X_reg, y_reg)
#         joblib.dump(self.regression_model, self.reg_path)
        
#         # Classification: Predict Category based on pollutants
#         # We'll create the target category first
#         df['category'] = df['PM2.5'].apply(calculate_aqi_category)
        
#         pollutants = ['PM2.5', 'PM10', 'CO', 'NO2', 'SO2']
#         X_clf = df[pollutants]
#         y_clf = df['category']
        
#         self.classification_model = RandomForestClassifier(n_estimators=100)
#         self.classification_model.fit(X_clf, y_clf)
#         joblib.dump(self.classification_model, self.clf_path)
        
#         return True

#     def predict(self, date_str, historical_df):
#         if not os.path.exists(self.reg_path) or not os.path.exists(self.clf_path):
#             # Load if not already in memory
#             try:
#                 self.regression_model = joblib.load(self.reg_path)
#                 self.classification_model = joblib.load(self.clf_path)
#             except:
#                 return None
        
#         target_date = pd.to_datetime(date_str)
#         historical_df['date'] = pd.to_datetime(historical_df['date'])
#         min_date = historical_df['date'].min()
#         days_since_start = (target_date - min_date).days
        
#         # Predict PM2.5
#         pred_pm25 = self.regression_model.predict([[days_since_start]])[0]
#         pred_pm25 = max(0, pred_pm25) # Cannot be negative
        
#         # For other pollutants, we'll use historical averages for the prediction input
#         # to the classifier, or just use the predicted PM2.5
#         avg_other = historical_df[['PM10', 'CO', 'NO2', 'SO2']].mean().to_dict()
        
#         clf_input = pd.DataFrame([{
#             'PM2.5': pred_pm25,
#             'PM10': avg_other['PM10'],
#             'CO': avg_other['CO'],
#             'NO2': avg_other['NO2'],
#             'SO2': avg_other['SO2']
#         }])
        
#         category = self.classification_model.predict(clf_input)[0]
        
#         return {
#             "predicted_pm25": round(float(pred_pm25), 2),
#             "category": category,
#             "confidence_score": 0.85 # Mock confidence score for now
#         }

# ml_service = MLService()



import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os
from datetime import datetime, timedelta

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, 'ml_model')
if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

def calculate_aqi_category(pm25):
    if pm25 <= 12:
        return 'Safe'
    elif pm25 <= 35.4:
        return 'Moderate'
    else:
        return 'Hazardous'

class MLService:
    def __init__(self):
        self.regression_model = None
        self.classification_model = None
        self.reg_path = os.path.join(MODEL_DIR, 'regression_model.joblib')
        self.clf_path = os.path.join(MODEL_DIR, 'classification_model.joblib')
        
    def train(self, df):
        if df.empty:
            return False
            
        # Feature Engineering: Convert date to numeric (days since min date)
        df['date'] = pd.to_datetime(df['date'])
        min_date = df['date'].min()
        df['days_since_start'] = (df['date'] - min_date).dt.days
        
        # Regression: Predict PM2.5 based on days
        X_reg = df[['days_since_start']]
        y_reg = df['PM2.5']
        
        self.regression_model = LinearRegression()
        self.regression_model.fit(X_reg, y_reg)
        joblib.dump(self.regression_model, self.reg_path)
        
        # Classification: Predict Category based on pollutants
        # We'll create the target category first
        df['category'] = df['PM2.5'].apply(calculate_aqi_category)
        
        pollutants = ['PM2.5', 'PM10', 'CO', 'NO2', 'SO2']
        X_clf = df[pollutants]
        y_clf = df['category']
        
        self.classification_model = RandomForestClassifier(n_estimators=100)
        self.classification_model.fit(X_clf, y_clf)
        joblib.dump(self.classification_model, self.clf_path)
        
        return True

    def predict(self, date_str, historical_df):
        if self.regression_model is None or self.classification_model is None:
            if not os.path.exists(self.reg_path) or not os.path.exists(self.clf_path):
                return None
            # Load if not already in memory
            try:
                self.regression_model = joblib.load(self.reg_path)
                self.classification_model = joblib.load(self.clf_path)
            except:
                return None
        
        target_date = pd.to_datetime(date_str)
        historical_df['date'] = pd.to_datetime(historical_df['date'])
        min_date = historical_df['date'].min()
        days_since_start = (target_date - min_date).days
        
        # Predict PM2.5
        pred_pm25 = self.regression_model.predict([[days_since_start]])[0]
        pred_pm25 = max(0, pred_pm25) # Cannot be negative
        
        # For other pollutants, we'll use historical averages for the prediction input
        # to the classifier, or just use the predicted PM2.5
        avg_other = historical_df[['PM10', 'CO', 'NO2', 'SO2']].mean().to_dict()
        
        clf_input = pd.DataFrame([{
            'PM2.5': pred_pm25,
            'PM10': avg_other['PM10'],
            'CO': avg_other['CO'],
            'NO2': avg_other['NO2'],
            'SO2': avg_other['SO2']
        }])
        
        category = self.classification_model.predict(clf_input)[0]
        
        return {
            "predicted_pm25": round(float(pred_pm25), 2),
            "category": category,
            "confidence_score": 0.85 # Mock confidence score for now
        }

ml_service = MLService()
