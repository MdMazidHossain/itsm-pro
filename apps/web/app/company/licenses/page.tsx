'use client';
import { useEffect, useState } from 'react';
export default function LicensesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', vendor: '', totalSeats: 10, expiryDate: '' });
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }
    const res = await fetch('http://localhost:3000/phase8/licenses', { headers: { Authorization: `Bearer ${token}` } });
    setItems(await res.json()); setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await fetch('http://localhost:3000/phase8/licenses', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(formData) });
    setFormData({ name: '', vendor: '', totalSeats: 10, expiryDate: '' }); fetchData();
  };
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Software Licenses</h2>
      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Software Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" />
          <input type="text" placeholder="Vendor" value={formData.vendor} onChange={(e) => setFormData({...formData, vendor: e.target.value})} className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" />
          <input type="number" value={formData.totalSeats} onChange={(e) => setFormData({...formData, totalSeats: parseInt(e.target.value)})} className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" />
          <input type="date" value={formData.expiryDate} onChange={(e) => setFormData({...formData, expiryDate: e.target.value})} className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" />
        </div>
        <button type="submit" className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold">Add License</button>
      </form>
      {loading ? <p>Loading...</p> : items.length === 0 ? <p className="text-slate-400">No licenses registered.</p> : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-700"><tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Vendor</th><th className="px-6 py-3">Seats</th></tr></thead>
            <tbody>{items.map((lic) => (<tr key={lic.id} className="border-t border-slate-700"><td className="px-6 py-4">{lic.name}</td><td className="px-6 py-4">{lic.vendor || 'N/A'}</td><td className="px-6 py-4">{lic.usedSeats}/{lic.totalSeats}</td></tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
