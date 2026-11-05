'use client';
import { useEffect, useState } from 'react';
export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: 'LAPTOP', serialNumber: '' });
  const fetchAssets = () => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }
    fetch('http://localhost:3000/assets', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json()).then((data) => { setAssets(data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { fetchAssets(); }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:3000/assets', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(formData),
    });
    if (res.ok) { setShowForm(false); setFormData({ name: '', type: 'LAPTOP', serialNumber: '' }); fetchAssets(); }
  };
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Assets</h2>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold">{showForm ? 'Cancel' : '+ Add Asset'}</button>
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Asset Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" />
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg">
              <option value="LAPTOP">Laptop</option><option value="DESKTOP">Desktop</option><option value="PRINTER">Printer</option>
            </select>
            <input type="text" placeholder="Serial Number" value={formData.serialNumber} onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })} className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" />
          </div>
          <button type="submit" className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold">Save Asset</button>
        </form>
      )}
      {loading ? <p>Loading...</p> : assets.length === 0 ? <p className="text-slate-400">No assets found.</p> : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-700"><tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Type</th><th className="px-6 py-3">Status</th></tr></thead>
            <tbody>{assets.map((asset) => (<tr key={asset.id} className="border-t border-slate-700"><td className="px-6 py-4">{asset.name}</td><td className="px-6 py-4">{asset.type}</td><td className="px-6 py-4">{asset.status}</td></tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
