'use client';

import { useEffect, useState } from 'react';

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [newComment, setNewComment] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'MEDIUM',
    category: 'General',
  });

  const getToken = () => localStorage.getItem('token');

  const fetchTickets = async () => {
    const token = getToken();
    if (!token) { window.location.href = '/login'; return; }
    try {
      const [ticketsRes, techsRes] = await Promise.all([
        fetch('http://localhost:3000/tickets', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:3000/tickets/technicians', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setTickets(await ticketsRes.json());
      setTechnicians(await techsRes.json());
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    const res = await fetch('http://localhost:3000/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setShowForm(false);
      setFormData({ subject: '', description: '', priority: 'MEDIUM', category: 'General' });
      fetchTickets();
    }
  };

  const assignTicket = async (ticketId: string, assignedToId: string) => {
    const token = getToken();
    await fetch(`http://localhost:3000/tickets/${ticketId}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ assignedToId }),
    });
    fetchTickets();
  };

  const updateStatus = async (ticketId: string, status: string) => {
    const token = getToken();
    await fetch(`http://localhost:3000/tickets/${ticketId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    fetchTickets();
  };

  const openDetails = async (ticketId: string) => {
    const token = getToken();
    const res = await fetch(`http://localhost:3000/tickets/${ticketId}`, { headers: { Authorization: `Bearer ${token}` } });
    setSelectedTicket(await res.json());
  };

  const addComment = async () => {
    if (!newComment.trim() || !selectedTicket) return;
    const token = getToken();
    await fetch(`http://localhost:3000/tickets/${selectedTicket.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ message: newComment }),
    });
    setNewComment('');
    openDetails(selectedTicket.id);
    fetchTickets();
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'URGENT': return 'bg-red-500/20 text-red-400';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'OPEN': return 'bg-blue-500/20 text-blue-400';
      case 'IN_PROGRESS': return 'bg-yellow-500/20 text-yellow-400';
      case 'RESOLVED': return 'bg-green-500/20 text-green-400';
      case 'CLOSED': return 'bg-slate-500/20 text-slate-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Tickets</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold"
        >
          {showForm ? 'Cancel' : '+ New Ticket'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
              className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg"
            />
            <textarea
              placeholder="Describe your issue..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg"
              />
            </div>
          </div>
          <button type="submit" className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold">
            Create Ticket
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : tickets.length === 0 ? (
        <p className="text-slate-400">No tickets yet. Click "New Ticket" to create one.</p>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3">Ticket #</th>
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created By</th>
                <th className="px-6 py-3">Assigned To</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-t border-slate-700 hover:bg-slate-750">
                  <td className="px-6 py-4 font-mono text-sm">{t.ticketNumber}</td>
                  <td className="px-6 py-4">{t.subject}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(t.priority)}`}>{t.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(t.status)}`}>{t.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm">{t.createdBy?.firstName} {t.createdBy?.lastName}</td>
                  <td className="px-6 py-4 text-sm">
                    {t.assignedTo ? (
                      `${t.assignedTo.firstName} ${t.assignedTo.lastName}`
                    ) : (
                      <select
                        onChange={(e) => assignTicket(t.id, e.target.value)}
                        className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs"
                        defaultValue=""
                      >
                        <option value="" disabled>Assign...</option>
                        {technicians.map((tech) => (
                          <option key={tech.id} value={tech.id}>{tech.firstName} {tech.lastName}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openDetails(t.id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs font-semibold"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedTicket && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{selectedTicket.subject}</h3>
                <p className="text-sm text-slate-400 font-mono">{selectedTicket.ticketNumber}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-white text-2xl">✕</button>
            </div>

            <p className="text-slate-300 mb-4">{selectedTicket.description}</p>

            <div className="flex gap-2 mb-4">
              {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((s) => (
                <button
                  key={s}
                  onClick={() => { updateStatus(selectedTicket.id, s); setSelectedTicket({ ...selectedTicket, status: s }); }}
                  className={`px-3 py-1 rounded text-xs font-semibold ${selectedTicket.status === s ? getStatusColor(s) : 'bg-slate-700 hover:bg-slate-600'}`}
                >
                  {s}
                </button>
              ))}
            </div>

            <h4 className="font-semibold mb-2">Comments ({selectedTicket.comments?.length || 0})</h4>
            <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
              {selectedTicket.comments?.map((c: any) => (
                <div key={c.id} className="bg-slate-900 p-3 rounded-lg">
                  <p className="text-xs text-slate-400 mb-1">{c.user?.firstName} {c.user?.lastName}</p>
                  <p className="text-sm">{c.message}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg"
              />
              <button onClick={addComment} className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
