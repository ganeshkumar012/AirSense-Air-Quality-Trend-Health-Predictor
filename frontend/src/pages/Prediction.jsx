import React, { useState, useEffect } from 'react';
import { airQualityApi } from '../services/api';

const Prediction = () => {
    const [formData, setFormData] = useState({ location: '', date: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [training, setTraining] = useState(false);
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await airQualityApi.getHistory();
            setHistory(response.data);
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const handleTrain = async () => {
        setTraining(true);
        setMessage('');
        try {
            await airQualityApi.trainModel();
            setMessage('Models trained successfully! You can now make predictions.');
        } catch (error) {
            setMessage(`Training Error: ${error.response?.data?.error || error.message}`);
        } finally {
            setTraining(false);
        }
    };

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const response = await airQualityApi.predict(formData);
            setResult(response.data);
            fetchHistory();
        } catch (error) {
            setMessage(`Prediction Error: ${error.response?.data?.error || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">ML Prediction</h1>
                    <p className="text-slate-500 mt-1">Predict future air quality trends using Linear Regression.</p>
                </div>
                <button
                    onClick={handleTrain}
                    disabled={training}
                    className={`px-6 py-2 rounded-xl font-medium transition-all ${training ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20'
                        }`}
                >
                    {training ? 'Training...' : '🧠 Train Model'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 card-shadow">
                        <h3 className="text-lg font-bold mb-6">New Prediction</h3>
                        <form onSubmit={handlePredict} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. New York"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Future Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                            >
                                {loading ? 'Analyzing...' : 'Predict AQI'}
                            </button>
                        </form>
                        {message && <p className="mt-4 text-xs text-center text-slate-500">{message}</p>}
                    </div>

                    {result && (
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl text-white shadow-xl animate-fade-in">
                            <h3 className="text-lg font-semibold opacity-80">Prediction Result</h3>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">{result.predicted_pm25}</span>
                                <span className="ml-2 text-blue-200">PM2.5</span>
                            </div>
                            <div className={`mt-4 inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${result.category === 'Safe' ? 'bg-emerald-500' : result.category === 'Moderate' ? 'bg-orange-500' : 'bg-red-500'
                                }`}>
                                {result.category}
                            </div>
                            <p className="mt-6 text-sm text-blue-100 italic">Confidence Score: {(result.confidence_score * 100).toFixed(0)}%</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h3 className="text-lg font-bold">Prediction History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Location</th>
                                        <th className="px-6 py-4">Target Date</th>
                                        <th className="px-6 py-4">Predicted PM2.5</th>
                                        <th className="px-6 py-4">Category</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {history.map((h, i) => (
                                        <tr key={i} className="hover:bg-slate-50">
                                            <td className="px-6 py-4 font-medium">{h.location}</td>
                                            <td className="px-6 py-4">{h.target_date}</td>
                                            <td className="px-6 py-4 text-blue-600 font-bold">{h.predicted_pm25}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${h.category === 'Safe' ? 'text-emerald-600 bg-emerald-50' : h.category === 'Moderate' ? 'text-orange-600 bg-orange-50' : 'text-red-600 bg-red-50'
                                                    }`}>
                                                    {h.category}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Prediction;
