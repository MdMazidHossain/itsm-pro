'use client';
import { useEffect, useState } from 'react';
export default function TroubleshootingPage() {
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const fetchDiagnostics = async () => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }
    try {
      const res = await fetch('http://localhost:3000/troubleshooting/diagnostics', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setDiagnostics(await res.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };
  useEffect(() => { fetchDiagnostics(); }, []);
  const runScan = async () => {
    setScanning(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/troubleshooting/scan', { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { await fetchDiagnostics(); alert('Scan completed!'); }
    } catch (err: any) { alert('Scan failed: ' + err.message); } finally { setScanning(false); }
  };
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-400';
      case 'WARNING': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Smart Troubleshooting</h2>
        <button onClick={runScan} disabled={scanning} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold disabled:opacity-50">{scanning ? 'Scanning...' : '🔍 Run Diagnostic Scan'}</button>
      </div>
      {loading ? <p>Loading...</p> : diagnostics.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
          <p className="text-slate-400 mb-2">No diagnostics found.</p>
          <p className="text-sm text-slate-500">Click "Run Diagnostic Scan" to analyze your devices.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {diagnostics.map((diag) => (
            <div key={diag.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{diag.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(diag.severity)}`}>{diag.severity}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{diag.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
