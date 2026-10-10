'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const { state } = useApp();

  if (pathname === '/') return null;

  const role = state.user.role;

  return (
    <header className="site-header sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-3">
          <Link href="/" className="flex items-center gap-3 no-underline flex-shrink-0">
            <div className="h-10 w-10 rounded-md flex items-center justify-center border border-slate-300 bg-white text-sm font-bold text-[#0b3c5d]">IN</div>
            <div>
              <div className="font-bold text-base leading-tight text-[#0b3c5d]">SahayakNet</div>
              <div className="text-xs text-slate-500 leading-tight">Disaster Coordination Platform</div>
            </div>
          </Link>

          <div className="flex items-center gap-2 flex-wrap">
            {role === 'citizen' && (
              <>
                <Link href="/citizen" className="text-xs font-semibold text-slate-600 hover:text-[#0b3c5d] px-2 py-1 rounded-lg hover:bg-slate-100">Dashboard</Link>
                <Link href="/request-help" className="text-xs font-semibold text-slate-600 hover:text-[#0b3c5d] px-2 py-1 rounded-lg hover:bg-slate-100">Request Help</Link>
                <Link href="/citizen/profile" className="text-xs font-semibold text-[#0b3c5d] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">👤 Profile</Link>
              </>
            )}
            {role === 'volunteer' && (
              <>
                <Link href="/volunteer/dashboard" className="text-xs font-semibold text-slate-600 hover:text-[#0b3c5d] px-2 py-1 rounded-lg hover:bg-slate-100">Dashboard</Link>
                <Link href="/volunteer/profile" className="text-xs font-semibold text-[#0b3c5d] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">👤 Profile</Link>
              </>
            )}
            {role === 'government' && (
              <>
                <Link href="/government" className="text-xs font-semibold text-slate-600 hover:text-[#0b3c5d] px-2 py-1 rounded-lg hover:bg-slate-100">Command</Link>
                <Link href="/government/analytics" className="text-xs font-semibold text-slate-600 hover:text-[#0b3c5d] px-2 py-1 rounded-lg hover:bg-slate-100">Analytics</Link>
              </>
            )}

            <div className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-[#2e7d32] border border-green-200 ml-1">
              ● Live
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
