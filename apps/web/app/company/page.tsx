'use client';

import { useEffect, useState } from 'react';

export default function CompanyDashboard() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }
    fetch('http://localhost:3000/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => { localStorage.removeItem('token'); window.location.href = '/login'; });
  }, []);

  return (
    <div className="p-8">
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
    </div>
  );
}
