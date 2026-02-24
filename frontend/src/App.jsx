import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import DataUpload from './pages/DataUpload';
import Analysis from './pages/Analysis';
import Prediction from './pages/Prediction';
import HealthAdvisory from './pages/HealthAdvisory';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Upload Data', path: '/upload', icon: '📤' },
    { name: 'Analysis', path: '/analysis', icon: '📈' },
    { name: 'Prediction', path: '/prediction', icon: '🔮' },
    { name: 'Health Advisory', path: '/advisory', icon: '🏥' },
  ];

  return (
    <div className="w-64 bg-slate-900 min-h-screen text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        AirSense
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${location.pathname === item.path
                ? 'bg-blue-600 shadow-lg shadow-blue-500/30'
                : 'hover:bg-slate-800'
              }`}
          >
            <span>{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-6 border-t border-slate-800 text-xs text-slate-500">
        © 2026 AirSense Dashboard
      </div>
    </div>
  );
};

const Navbar = () => (
  <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-8">
    <div className="flex items-center space-x-4">
      <span className="text-slate-400">Welcome back, Admin</span>
    </div>
    <div className="flex items-center space-x-6">
      <button className="bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition-colors">🔔</button>
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600"></div>
    </div>
  </header>
);

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Navbar />
          <main className="pt-24 p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<DataUpload />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/prediction" element={<Prediction />} />
              <Route path="/advisory" element={<HealthAdvisory />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
