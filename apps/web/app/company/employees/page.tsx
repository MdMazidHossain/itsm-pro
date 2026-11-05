'use client';
import { useEffect, useState } from 'react';
export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }
    fetch('http://localhost:3000/users', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json()).then((data) => { setEmployees(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Employees</h2>
      {loading ? <p>Loading...</p> : employees.length === 0 ? <p className="text-slate-400">No employees found.</p> : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-700"><tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Role</th></tr></thead>
            <tbody>{employees.map((emp) => (<tr key={emp.id} className="border-t border-slate-700"><td className="px-6 py-4">{emp.firstName} {emp.lastName}</td><td className="px-6 py-4">{emp.email}</td><td className="px-6 py-4">{emp.role}</td></tr>))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
