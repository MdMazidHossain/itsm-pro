'use client';

import { useEffect, useState } from 'react';

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetch('http://localhost:3000/devices', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setDevices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      <aside className="w-64 bg-slate-800 border-r border-slate-700 p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8">ITSM Pro</h1>
        <nav className="space-y-2">
          <a href="/company" className="block px-4 py-2 hover:bg-slate-700 rounded-lg">📊 Dashboard</a>
          <a href="/company/employees" className="block px-4 py-2 hover:bg-slate-700 rounded-lg">👥 Employees</a>
          <a href="/company/tickets" className="block px-4 py-2 hover:bg-slate-700 rounded-lg">🎫 Tickets</a>
          <a href="/company/assets" className="block px-4 py-2 hover:bg-slate-700 rounded-lg">💻 Assets</a>
          <a href="/company/devices" className="block px-4 py-2 bg-blue-600 rounded-lg font-medium">🖥️ Devices</a>
          <a href="/company/settings" className="block px-4 py-2 hover:bg-slate-700 rounded-lg">⚙️ Settings</a>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">Devices</h2>
        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : devices.length === 0 ? (
          <p className="text-slate-400">No devices registered yet. Install the Windows Agent on a computer to see it here.</p>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3">Hostname</th>
                  <th className="px-6 py-3">Agent ID</th>
                  <th className="px-6 py-3">OS</th>
                  <th className="px-6 py-3">IP Address</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Last Heartbeat</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.id} className="border-t border-slate-700">
                    <td className="px-6 py-4">{device.hostname}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{device.agentId}</td>
                    <td className="px-6 py-4">{device.osInfo || 'N/A'}</td>
                    <td className="px-6 py-4">{device.ipAddress || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        device.status === 'ONLINE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {device.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(device.lastHeartbeat).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
