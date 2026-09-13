import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Cloud, LayoutDashboard, Server, Shuffle, TrendingUp,
  Database, Activity, ScrollText, Settings, LogOut, Menu, X
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'infrastructure', label: 'Infrastructure', icon: Server },
  { id: 'servers', label: 'Servers', icon: Server },
  { id: 'load-balancer', label: 'Load Balancer', icon: Shuffle },
  { id: 'auto-scaling', label: 'Auto Scaling', icon: TrendingUp },
  { id: 'database', label: 'Database', icon: Database },
  { id: 'monitoring', label: 'Monitoring', icon: Activity },
  { id: 'logs', label: 'Logs', icon: ScrollText },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface DashboardSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function DashboardSidebar({ activeView, onViewChange }: DashboardSidebarProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id: string) => {
    onViewChange(id);
    setMobileOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-ink-950/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden w-10 h-10 rounded-lg glass border border-white/10 flex items-center justify-center text-cream"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 glass border-r border-white/5 z-40 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-bronze-400 to-bronze-700 flex items-center justify-center transition-transform group-hover:scale-105">
              <Cloud className="w-5 h-5 text-ink-950" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-semibold tracking-tight text-cream">CloudGate</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-0.5 overflow-y-auto scrollbar-hide">
          <p className="px-3 text-[10px] font-mono text-white/20 tracking-wider uppercase mb-3">Monitoring</p>
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-bronze-500/10 text-bronze-300'
                    : 'text-white/40 hover:text-cream hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bronze-400 to-bronze-700 flex items-center justify-center text-ink-950 text-xs font-semibold flex-shrink-0">
              {(profile?.full_name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-cream truncate">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-white/30 capitalize">{profile?.role || 'viewer'}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1.5 text-white/30 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-between mb-8 pt-12 lg:pt-0">
      <div>
        <h1 className="text-2xl lg:text-3xl font-light text-cream tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-white/40 mt-1">{subtitle}</p>}
      </div>
      <div className="hidden sm:flex items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-white/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </div>
        <span className="text-xs font-mono text-white/30 tabular-nums">
          {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
