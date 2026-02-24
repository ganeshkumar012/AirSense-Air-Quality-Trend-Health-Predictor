import React, { useState, useEffect } from 'react';
import { airQualityApi } from '../services/api';
import { Bar, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);
const Analysis = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await airQualityApi.getAnalysis();
                setStats(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    if (!stats || !stats.mean) return <div className="flex justify-center items-center h-64"><p className="text-slate-500">No data available. Please upload and preprocess a dataset.</p></div>;

    const pollutants = Object.keys(stats.mean);

    const radarData = {
        labels: pollutants,
        datasets: [
            {
                label: 'Average Concentration',
                data: Object.values(stats.mean),
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: '#3b82f6',
                borderWidth: 2,
            },
        ],
    };

    const trendLabels = Object.keys(stats.trend);
    const trendData = {
        labels: trendLabels,
        datasets: pollutants.map((p, i) => ({
            label: p,
            data: trendLabels.map(date => stats.trend[date][p]),
            backgroundColor: `hsla(${i * 60}, 70%, 50%, 0.6)`,
            borderRadius: 4,
        })),
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Statistical Analysis</h1>
                <p className="text-slate-500 mt-1">Deep dive into pollutant distributions and correlations.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-100 card-shadow">
                    <h3 className="text-lg font-bold mb-6">Pollutant Distribution (Radar)</h3>
                    <div className="h-80 flex justify-center">
                        <Radar data={radarData} />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-slate-100 card-shadow">
                    <h3 className="text-lg font-bold mb-6">Daily Averages Breakdown</h3>
                    <div className="h-80">
                        <Bar data={trendData} options={{ maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 card-shadow">
                <h3 className="text-lg font-bold mb-6">Statistical Summary Table</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Pollutant</th>
                                <th className="px-6 py-4 font-semibold">Mean</th>
                                <th className="px-6 py-4 font-semibold">Median</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pollutants.map(p => (
                                <tr key={p} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{p}</td>
                                    <td className="px-6 py-4 text-slate-600">{stats.mean[p].toFixed(2)}</td>
                                    <td className="px-6 py-4 text-slate-600">{stats.median[p].toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${stats.mean[p] < 20 ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'
                                            }`}>
                                            {stats.mean[p] < 20 ? 'Stable' : 'High'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analysis;
