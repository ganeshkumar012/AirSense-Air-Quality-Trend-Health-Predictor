import React, { useState, useEffect } from 'react';
import { airQualityApi } from '../services/api';

const AdvisoryCard = ({ category, data }) => (
    <div className={`p-8 rounded-3xl border-2 transition-all duration-500 animate-fade-in ${data.color === 'Green' ? 'bg-emerald-50 border-emerald-100' :
            data.color === 'Yellow' ? 'bg-amber-50 border-amber-100' :
                'bg-red-50 border-red-100'
        }`}>
        <div className="flex items-start justify-between">
            <div>
                <div className={`inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${data.color === 'Green' ? 'bg-emerald-500 text-white' :
                        data.color === 'Yellow' ? 'bg-amber-500 text-white' :
                            'bg-red-500 text-white'
                    }`}>
                    {category}
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{data.title}</h2>
            </div>
            <div className="text-4xl">{data.color === 'Green' ? '🌿' : data.color === 'Yellow' ? '⚠️' : '😷'}</div>
        </div>
        <p className="mt-4 text-slate-600 leading-relaxed">{data.text}</p>

        <div className="mt-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h4 className="font-bold text-slate-900 flex items-center mb-2">
                <span className="mr-2">🏃</span> Recommended Activities
            </h4>
            <p className="text-slate-600 text-sm">{data.activities}</p>
        </div>
    </div>
);

const HealthAdvisory = () => {
    const [advisories, setAdvisories] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdvisories = async () => {
            const categories = ['Safe', 'Moderate', 'Hazardous'];
            const results = {};
            for (const cat of categories) {
                try {
                    const res = await airQualityApi.getRecommendation(cat);
                    results[cat] = res.data;
                } catch (e) {
                    console.error(e);
                }
            }
            setAdvisories(results);
            setLoading(false);
        };
        fetchAdvisories();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 text-center">Health Recommendations</h1>
                <p className="text-slate-500 mt-2 text-center">Actionable advice based on current air quality levels.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {Object.entries(advisories).map(([cat, data]) => (
                    <AdvisoryCard key={cat} category={cat} data={data} />
                ))}
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl text-white mt-12 card-shadow">
                <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-blue-500 rounded-2xl text-2xl">💡</div>
                    <h3 className="text-xl font-bold">General Tips for Clean Air</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300">
                    <div className="flex items-start">
                        <span className="text-blue-400 mr-2">➜</span>
                        <span>Keep windows closed when pollution levels are high.</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-blue-400 mr-2">➜</span>
                        <span>Use air purifiers with HEPA filters indoors.</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-blue-400 mr-2">➜</span>
                        <span>Minimize use of wood-burning stoves and candles.</span>
                    </div>
                    <div className="flex items-start">
                        <span className="text-blue-400 mr-2">➜</span>
                        <span>Avoid exercising near high-traffic areas.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HealthAdvisory;
