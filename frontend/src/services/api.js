import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const airQualityApi = {
    // Data Collection & Upload
    uploadCsv: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/data/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    getRawData: (location = '') => api.get(`/data${location ? `?location=${location}` : ''}`),

    // Preprocessing
    preprocessData: () => api.post('/preprocess'),

    // Analysis
    getAnalysis: () => api.get('/analysis'),

    // Prediction
    trainModel: () => api.post('/train'),
    predict: (data) => api.post('/predict', data),
    getHistory: () => api.get('/history'),

    // Recommendations
    getRecommendation: (category) => api.get(`/recommendation/${category}`),
};

export default api;
