import Sidebar from '../../components/Sidebar';

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
