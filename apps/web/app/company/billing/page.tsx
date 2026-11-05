'use client';
import { useEffect, useState } from 'react';
export default function BillingPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login'; return; }
    try {
      const [plansRes, invoicesRes, subRes] = await Promise.all([
        fetch('http://localhost:3000/billing/plans'),
        fetch('http://localhost:3000/billing/invoices', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:3000/billing/subscription', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setPlans(await plansRes.json()); setInvoices(await invoicesRes.json()); setSubscription(await subRes.json()); setLoading(false);
    } catch { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);
  const upgradePlan = async (planId: string) => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:3000/billing/upgrade', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ planId }) });
    if (res.ok) { alert('Subscription upgraded successfully!'); fetchData(); }
  };
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Billing & Subscription</h2>
      {loading ? <p>Loading...</p> : (
        <>
          {subscription && subscription.subscriptionPlan && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold mb-2">Current Subscription</h3>
              <p className="text-slate-400">Plan: <span className="text-blue-400 font-semibold">{subscription.subscriptionPlan.name}</span></p>
            </div>
          )}
          <h3 className="text-xl font-semibold mb-4">Available Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h4 className="text-lg font-bold mb-2">{plan.name}</h4>
                <p className="text-3xl font-bold text-blue-400 mb-2">৳{plan.price}</p>
                <button onClick={() => upgradePlan(plan.id)} className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold">{subscription?.subscriptionPlanId === plan.id ? 'Current Plan' : 'Upgrade'}</button>
              </div>
            ))}
          </div>
          <h3 className="text-xl font-semibold mb-4">Invoices</h3>
          {invoices.length === 0 ? <p className="text-slate-400">No invoices yet.</p> : (
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-700"><tr><th className="px-6 py-3">Invoice #</th><th className="px-6 py-3">Amount</th><th className="px-6 py-3">Status</th></tr></thead>
                <tbody>{invoices.map((inv) => (<tr key={inv.id} className="border-t border-slate-700"><td className="px-6 py-4">{inv.invoiceNumber}</td><td className="px-6 py-4">৳{inv.amount}</td><td className="px-6 py-4">{inv.status}</td></tr>))}</tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
