'use client';
import { useEffect, useState } from 'react';
export default function SLAPage() {
  const [slas, setSlas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', priority: 'HIGH', responseTime: 60, resolutionTime: 240 });
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }
    const res = await fetch('http://localhost:3000/phase8/slas', { headers: { Authorization: `Bearer ${token}` } });
    setSlas(await res.json()); setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await fetch('http://localhost:3000/phase8/slas', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(formData) });
    setFormData({ name: '', priority: 'HIGH', responseTime: 60, resolutionTime: 240 }); fetchData();
  };
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">SLA Management</h2>
      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="SLA Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" />
          <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})} className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg">
            <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option><option value="URGENT">Urgent</option>
          </select>
          <input type="number" value={formData.responseTime} onChange={(e) => setFormData({...formData, responseTime: parseInt(e.target.value)})} className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" />
          <input type="number" value={formData.resolutionTime} onChange={(e) => setFormData({...formData, resolutionTime: parseInt(e.target.value)})} className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" />
        </div>
        <button type="submit" className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold">Create SLA</button>
      </form>
      {loading ? <p>Loading...</p> : slas.length === 0 ? <p className="text-slate-400">No SLAs configured.</p> : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-700"><tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Priority</th><th className="px-6 py-3">Response</th></tr></thead>
            <tbody>{slas.map((sla) => (<tr key={sla.id} className="border-t border-slate-700"><td className="px-6 py-4">{sla.name}</td><td className="px-6 py-4">{sla.priority}</td><td className="px-6 py-4">{sla.responseTime} min</td></tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
