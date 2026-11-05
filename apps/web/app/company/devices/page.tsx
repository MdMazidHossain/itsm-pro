'use client';
import { useEffect, useState } from 'react';
export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }
    fetch('http://localhost:3000/devices', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json()).then((data) => { setDevices(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Devices</h2>
      {loading ? <p>Loading...</p> : devices.length === 0 ? <p className="text-slate-400">No devices registered yet.</p> : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-700"><tr><th className="px-6 py-3">Hostname</th><th className="px-6 py-3">OS</th><th className="px-6 py-3">CPU</th><th className="px-6 py-3">RAM</th><th className="px-6 py-3">Status</th></tr></thead>
            <tbody>{devices.map((dev) => (<tr key={dev.id} className="border-t border-slate-700"><td className="px-6 py-4">{dev.hostname}</td><td className="px-6 py-4">{dev.osInfo}</td><td className="px-6 py-4">{dev.cpuUsage}%</td><td className="px-6 py-4">{dev.ramUsage}%</td><td className="px-6 py-4"><span className="px-2 py-1 rounded text-xs font-semibold bg-green-500/20 text-green-400">{dev.status}</span></td></tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
