'use client';

import { useEffect, useState } from 'react';

export default function CompanyDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetch('http://localhost:3000/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      <aside className="w-64 bg-slate-800 border-r border-slate-700 p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8">
          ITSM Pro
        </h1>
        <nav className="space-y-2">
          <a href="/company" className="block px-4 py-2 bg-blue-600 rounded-lg font-medium">📊 Dashboard</a>
          <a href="/company/employees" className="block px-4 py-2 hover:bg-slate-700 rounded-lg">👥 Employees</a>
          <a href="/company/tickets" className="block px-4 py-2 hover:bg-slate-700 rounded-lg">🎫 Tickets</a>
          <a href="/company/assets" className="block px-4 py-2 hover:bg-slate-700 rounded-lg">💻 Assets</a>
          <a href="/company/devices" className="block px-4 py-2 hover:bg-slate-700 rounded-lg">🖥️ Devices</a>
          <a href="/company/settings" className="block px-4 py-2 hover:bg-slate-700 rounded-lg">⚙️ Settings</a>
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="mt-8 w-full px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-slate-400 mt-1">Welcome back, {user?.email || 'Loading...'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Total Employees</p>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Open Tickets</p>
            <p className="text-3xl font-bold mt-2 text-yellow-400">0</p>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Total Assets</p>
            <p className="text-3xl font-bold mt-2 text-green-400">0</p>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Your Account Info</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-slate-400">User ID:</span> {user?.userId}</p>
            <p><span className="text-slate-400">Email:</span> {user?.email}</p>
            <p><span className="text-slate-400">Role:</span> {user?.role}</p>
            <p><span className="text-slate-400">Tenant ID:</span> {user?.tenantId}</p>
          </div>
        </div>
      </main>
    </div>
  );
}