'use client';

export default function TicketsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      <aside className="w-64 bg-slate-800 border-r border-slate-700 p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8">ITSM Pro</h1>
        <nav className="space-y-2">
          <a href="/company" className="block px-4 py-2 hover:bg-slate-700 rounded-lg">📊 Dashboard</a>
          <a href="/company/employees" className="block px-4 py-2 hover:bg-slate-700 rounded-lg">👥 Employees</a>
          <a href="/company/tickets" className="block px-4 py-2 bg-blue-600 rounded-lg font-medium">🎫 Tickets</a>
          <a href="/company/assets" className="block px-4 py-2 hover:bg-slate-700 rounded-lg">💻 Assets</a>
          <a href="/company/settings" className="block px-4 py-2 hover:bg-slate-700 rounded-lg">⚙️ Settings</a>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">Tickets</h2>
        <p className="text-slate-400">Ticket management coming in Phase 4.</p>
      </main>
    </div>
  );
}