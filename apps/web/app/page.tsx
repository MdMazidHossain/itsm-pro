'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [apiStatus, setApiStatus] = useState<string>('Checking...');
  const [apiData, setApiData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:3000/health')
      .then((res) => res.json())
      .then((data) => {
        setApiStatus('Connected ✅');
        setApiData(data);
      })
      .catch(() => {
        setApiStatus('Disconnected ❌');
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            ITSM Pro
          </h1>
          <p className="text-xl text-slate-300">
            Smart IT Operations & Managed Support Platform
          </p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-sm font-medium text-slate-400">API Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
              apiStatus.includes('Connected ✅') 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              {apiStatus}
            </span>
          </div>
          
          {apiData && (
            <div className="text-left bg-slate-900 rounded-lg p-4 mt-4 text-sm font-mono text-slate-300 overflow-auto">
              <pre>{JSON.stringify(apiData, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/login" className="cursor-pointer bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-colors block">
            <h3 className="text-lg font-semibold mb-2">🏢 Company Admin Portal</h3>
            <p className="text-sm text-slate-400">Manage employees, assets, and tickets.</p>
          </a>
          <a href="/login" className="cursor-pointer bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-colors block">
            <h3 className="text-lg font-semibold mb-2">👨‍💼 Employee Portal</h3>
            <p className="text-sm text-slate-400">Submit tickets and track progress.</p>
          </a>
          <a href="/login" className="cursor-pointer bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-colors block">
            <h3 className="text-lg font-semibold mb-2">🔧 Technician Portal</h3>
            <p className="text-sm text-slate-400">Manage assigned jobs and maintenance.</p>
          </a>
          <a href="/login" className="cursor-pointer bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500 transition-colors block">
            <h3 className="text-lg font-semibold mb-2">👑 Super Admin Portal</h3>
            <p className="text-sm text-slate-400">Manage tenants and subscriptions.</p>
          </a>
        </div>

        <div className="text-center">
          <a href="/login" className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition-colors">
            Sign In Now →
          </a>
        </div>

        <p className="text-sm text-slate-500">
          Phase 2: Authentication Complete ✅
        </p>
      </div>
    </div>
  );
}