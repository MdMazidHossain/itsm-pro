'use client';

import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/company', label: '📊 Dashboard' },
    { href: '/company/employees', label: '👥 Employees' },
    { href: '/company/tickets', label: '🎫 Tickets' },
    { href: '/company/assets', label: '💻 Assets' },
    { href: '/company/devices', label: '🖥️ Devices' },
    { href: '/company/billing', label: '💳 Billing' },
    { href: '/company/troubleshooting', label: '🔧 Troubleshooting' },
    { href: '/company/sla', label: '⏱️ SLA' },
    { href: '/company/maintenance', label: '🔧 Maintenance' },
    { href: '/company/licenses', label: '📝 Licenses' },
    { href: '/company/kb', label: '📚 Knowledge Base' },
    { href: '/company/settings', label: '⚙️ Settings' },
  ];

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 p-6 min-h-screen">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8">
        ITSM Pro
      </h1>
      <nav className="space-y-2">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={`block px-4 py-2 rounded-lg transition-colors ${
              pathname === link.href
                ? 'bg-blue-600 font-medium'
                : 'hover:bg-slate-700'
            }`}
          >
            {link.label}
          </a>
        ))}
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
  );
}
