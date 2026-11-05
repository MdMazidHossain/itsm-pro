'use client';
import { useEffect, useState } from 'react';
export default function MaintenancePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', description: '', scheduledAt: '' });
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }
    const res = await fetch('http://localhost:3000/phase8/maintenance', { headers: { Authorization: `Bearer ${token}` } });
    setItems(await res.json()); setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await fetch('http://localhost:3000/phase8/maintenance', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(formData) });
    setFormData({ title: '', description: '', scheduledAt: '' }); fetchData();
  };
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Preventive Maintenance</h2>
      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" />
          <input type="text" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" />
          <input type="datetime-local" value={formData.scheduledAt} onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})} required className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" />
        </div>
        <button type="submit" className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold">Schedule</button>
      </form>
      {loading ? <p>Loading...</p> : items.length === 0 ? <p className="text-slate-400">No maintenance scheduled.</p> : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-700"><tr><th className="px-6 py-3">Title</th><th className="px-6 py-3">Scheduled</th><th className="px-6 py-3">Status</th></tr></thead>
            <tbody>{items.map((m) => (<tr key={m.id} className="border-t border-slate-700"><td className="px-6 py-4">{m.title}</td><td className="px-6 py-4">{new Date(m.scheduledAt).toLocaleString()}</td><td className="px-6 py-4">{m.status}</td></tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
