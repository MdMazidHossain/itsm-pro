'use client';

import { useEffect, useState } from 'react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    fetch('http://localhost:3000/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      <aside className="w-64 bg-slate-800 border-r border-slate-700 p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8">
          ITSM Pro
        </h1>
        <nav className="space-y-2">
          <a href="/company" className="block px-4 py-2 hover:bg-slate-700 rounded-lg">
            📊 Dashboard
          </a>
          <a href="/company/employees" className="block px-4 py-2 bg-blue-600 rounded-lg font-medium">
            👥 Employees
          </a>
          <a href="/company/tickets" className="block px-4 py-2 hover:bg-slate-700 rounded-lg">
            🎫 Tickets
          </a>
          <a href="/company/assets" className="block px-4 py-2 hover:bg-slate-700 rounded-lg">
            💻 Assets
          </a>
          <a href="/company/settings" className="block px-4 py-2 hover:bg-slate-700 rounded-lg">
            ⚙️ Settings
          </a>
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="mt-8 w-full px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">Employees</h2>
        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : employees.length === 0 ? (
          <p className="text-slate-400">No employees found.</p>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-sm font-semibold">Email</th>
                  <th className="px-6 py-3 text-sm font-semibold">Role</th>
                  <th className="px-6 py-3 text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="border-t border-slate-700">
                    <td className="px-6 py-4">{emp.firstName} {emp.lastName}</td>
                    <td className="px-6 py-4 text-slate-300">{emp.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold">
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                        {emp.status}
                      </span>
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