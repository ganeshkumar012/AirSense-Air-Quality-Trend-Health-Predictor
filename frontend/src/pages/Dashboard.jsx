import React, { useState, useEffect } from 'react';
import { airQualityApi } from '../services/api';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover-lift card-shadow animate-fade-in">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-xl`}>{icon}</div>
            <span className="text-slate-400 text-sm font-medium">Live</span>
        </div>
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await airQualityApi.getAnalysis();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching analysis:', error);
        } finally {
            setLoading(false);
        }
    };

    const lineData = {
        labels: stats ? Object.keys(stats.trend) : [],
        datasets: [
            {
                label: 'PM2.5 Levels',
                data: stats ? Object.values(stats.trend).map(v => v['PM2.5']) : [],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
            }
        ],
    };

    const barData = {
        labels: stats ? Object.keys(stats.mean) : [],
        datasets: [
            {
                label: 'Average Pollutant Levels',
                data: stats ? Object.values(stats.mean) : [],
                backgroundColor: [
                    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'
                ],
                borderRadius: 8,
            }
        ],
    };

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Environmental Dashboard</h1>
                    <p className="text-slate-500 mt-1">Real-time air quality monitoring and analytics.</p>
                </div>
                <button
                    onClick={fetchData}
                    className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                    🔄 Refresh Data
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="PM2.5 Content" value={stats?.mean?.['PM2.5']?.toFixed(2) || '0'} icon="🌫️" color="bg-blue-500" />
                <StatCard title="NO2 Levels" value={stats?.mean?.['NO2']?.toFixed(2) || '0'} icon="🧪" color="bg-emerald-500" />
                <StatCard title="AQI Index" value="Good" icon="✅" color="bg-orange-500" />
                <StatCard title="Active Sensors" value="12" icon="📡" color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-100 card-shadow">
                    <h3 className="text-lg font-bold mb-6">Pollution Trends</h3>
                    <div className="h-64">
                        <Line data={lineData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-100 card-shadow">
                    <h3 className="text-lg font-bold mb-6">Pollutant Comparison</h3>
                    <div className="h-64">
                        <Bar data={barData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
