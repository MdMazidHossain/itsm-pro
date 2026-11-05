'use client';
import { useEffect, useState } from 'react';
export default function KBPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ title: '', content: '', category: 'General' });
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }
    const res = await fetch('http://localhost:3000/phase8/kb', { headers: { Authorization: `Bearer ${token}` } });
    setItems(await res.json()); setLoading(false);
  };
  useEffect(() => { fetchData(); }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await fetch('http://localhost:3000/phase8/kb', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(formData) });
    setFormData({ title: '', content: '', category: 'General' }); fetchData();
  };
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Knowledge Base</h2>
      <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 gap-4 mb-4">
          <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" />
          <textarea placeholder="Content" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} required rows={4} className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" />
          <input type="text" placeholder="Category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg" />
        </div>
        <button type="submit" className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold">Publish</button>
      </form>
      {loading ? <p>Loading...</p> : items.length === 0 ? <p className="text-slate-400">No articles found.</p> : (
        <div className="space-y-4">
          {items.map((article) => (
            <div key={article.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
              <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">{article.category}</span>
              <p className="text-slate-400 mt-3 text-sm">{article.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
