import React, { useState, useEffect } from 'react';
import { airQualityApi } from '../services/api';

const DataUpload = () => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await airQualityApi.getRawData();
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        try {
            const response = await airQualityApi.uploadCsv(file);
            setMessage(`Success! ${response.data.records_count} records uploaded.`);
            fetchData();
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.error || error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handlePreprocess = async () => {
        setUploading(true);
        try {
            await airQualityApi.preprocessData();
            setMessage('Preprocessing completed successfully!');
        } catch (error) {
            setMessage(`Error: ${error.response?.data?.error || error.message}`);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Data Management</h1>
                    <p className="text-slate-500 mt-1">Upload and manage your air quality datasets.</p>
                </div>
                <div className="space-x-4">
                    <button
                        onClick={handlePreprocess}
                        className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        ⚙️ Preprocess Data
                    </button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 card-shadow">
                <h3 className="text-lg font-bold mb-6">Upload New Dataset</h3>
                <form onSubmit={handleUpload} className="flex items-center space-x-4">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="flex-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <button
                        type="submit"
                        disabled={!file || uploading}
                        className={`px-6 py-2 rounded-xl font-medium transition-all ${!file || uploading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                            }`}
                    >
                        {uploading ? 'Uploading...' : 'Upload CSV'}
                    </button>
                </form>
                {message && <p className={`mt-4 text-sm font-medium ${message.includes('Error') ? 'text-red-600' : 'text-emerald-600'}`}>{message}</p>}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold">Recent Records</h3>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Top 100 entries</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Location</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">PM2.5</th>
                                <th className="px-6 py-4 font-semibold">PM10</th>
                                <th className="px-6 py-4 font-semibold">CO</th>
                                <th className="px-6 py-4 font-semibold">NO2</th>
                                <th className="px-6 py-4 font-semibold">SO2</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{row.location}</td>
                                    <td className="px-6 py-4 text-slate-600">{row.date}</td>
                                    <td className="px-6 py-4 text-blue-600 font-semibold">{row['PM2.5']}</td>
                                    <td className="px-6 py-4 text-slate-600">{row['PM10']}</td>
                                    <td className="px-6 py-4 text-slate-600">{row['CO']}</td>
                                    <td className="px-6 py-4 text-slate-600">{row['NO2']}</td>
                                    <td className="px-6 py-4 text-slate-600">{row['SO2']}</td>
                                </tr>
                            ))}
                            {data.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400">No records found. Please upload a CSV dataset.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataUpload;
