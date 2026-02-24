# AirSense – Air Quality Trend & Health Predictor

AirSense is a full-stack platform that monitors, analyzes, and predicts air quality trends using Machine Learning (Linear Regression & Random Forest Classification). It provides actionable health recommendations based on pollution levels.

## 🚀 Features

- **Real-time Dashboard**: Interactive charts showing PM2.5 trends and pollutant comparisons.
- **Data Management**: Upload CSV datasets and preprocess them for analysis.
- **ML Predictions**: Predict future air quality levels and AQI categories.
- **Health Advisory**: Get specific health recommendations based on air quality indices.
- **SaaS-level UI**: Modern design with gradients, animations, and responsive layout.

## 🛠 Tech Stack

- **Frontend**: ReactJS, TailwindCSS, Chart.js, Axios, React Router, Lucide React.
- **Backend**: Python Flask, PyMongo, Pandas, Scikit-learn, Joblib.
- **Database**: MongoDB.

## 📦 Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB (Running on `localhost:27017`)

### Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the Flask server:
   ```bash
   python app.py
   ```
   The API will be available at `http://localhost:5000`.

### Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install react-router-dom axios lucide-react chart.js react-chartjs-2
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 📊 Sample Data
A sample dataset `sample_air_quality.csv` is provided in the root directory. You can upload this via the **Upload Data** page to populate the dashboard and train the ML models.

## 📂 Project Structure
```text
backend/           # Flask API & ML Models
frontend/          # React App (Vite)
ml_model/          # Persisted .joblib models
uploads/           # Uploaded CSV files
```
