import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Scale,
  LayoutDashboard,
  FileText,
  ClipboardList,
  BadgeCheck,
  Bell,
  Users,
  ScrollText,
  LogOut,
  Menu,
  X,
  SearchCheck,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ROLES } from '../lib/constants';
import { api } from '../lib/supabase';
import { UserRole } from '../types';

export function PortalLayout() {
  const { user, profile, signOut, switchDemoRole } = useAuth();
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  const role: UserRole = profile?.role || 'citizen';
  const roleInfo = ROLES[role] || ROLES.citizen;

  useEffect(() => {
    if (user?.email) {
      api.get(`/api/notifications?email=${encodeURIComponent(user.email)}&role=${role}`)
        .then((notifs: any[]) => {
          if (Array.isArray(notifs)) {
            setUnreadCount(notifs.filter(n => !n.read).length);
          }
        })
        .catch(() => {});
    }
  }, [user, role]);

  const navItems = [
    { to: '/dashboard', label: t('side_dashboard'), icon: LayoutDashboard, end: true },
    ...(role === 'citizen' || role === 'admin'
      ? [{ to: '/dashboard/instruments', label: t('side_instruments'), icon: Scale }]
      : []),
    {
      to: '/dashboard/applications',
      label: role === 'citizen' ? t('side_applications') : t('side_queue'),
      icon: ClipboardList
    },
    { to: '/dashboard/certificates', label: t('side_certificates'), icon: BadgeCheck },
    { to: '/dashboard/notifications', label: t('side_notifications'), icon: Bell, badge: unreadCount },
    ...(role === 'admin'
      ? [
          { to: '/dashboard/users', label: t('side_users'), icon: Users },
          { to: '/dashboard/audit', label: t('side_audit'), icon: ScrollText }
        ]
      : [])
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-ink text-white">
      <div>
        <Link to="/" className="flex items-center gap-2.5 px-5 py-5 text-lg font-extrabold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Scale size={18} />
          </span>
          <span>
            eVerify <span className="text-sky-300">LM</span>
          </span>
        </Link>

        <nav className="space-y-1 px-3" aria-label="Portal navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                    isActive ? 'bg-primary text-white' : 'text-white/65 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon size={17} />
                <span className="flex-1">{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="rounded-full bg-saffron px-2 py-0.5 text-[10px] font-extrabold text-ink">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="space-y-1 border-t border-white/10 px-3 py-3">
        <Link
          to="/verify"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-white/55 hover:bg-white/10 hover:text-white"
        >
          <SearchCheck size={16} /> {t('side_public_verify')}
        </Link>
        <Link
          to="/docs"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-white/55 hover:bg-white/10 hover:text-white"
        >
          <BookOpen size={16} /> {t('side_docs')}
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-white/55 hover:bg-white/10 hover:text-white"
        >
          <LogOut size={16} /> {t('side_signout')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-ink lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[80vw] bg-ink shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
              className="rounded-lg p-2 text-ink-soft hover:bg-slate-100 lg:hidden"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden sm:block">
              <span className="text-xs font-bold text-ink-soft">National Verification Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            {/* Role indicator & demo switch */}
            <div className="flex items-center gap-2">
              <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${roleInfo.chip}`}>
                {roleInfo.short}
              </span>
              <select
                value={role}
                onChange={(e) => switchDemoRole(e.target.value as UserRole)}
                title="Switch persona for testing"
                aria-label="Switch demo role"
                className="hidden sm:block h-8 cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-semibold text-ink-soft outline-none hover:border-primary"
              >
                <option value="citizen">Switch to Citizen</option>
                <option value="lmo">Switch to LMO</option>
                <option value="gatc">Switch to GATC</option>
                <option value="admin">Switch to Admin</option>
              </select>
            </div>

            <div className="hidden md:flex items-center gap-2 border-l border-slate-200 pl-3 text-xs">
              <div className="text-right">
                <p className="font-bold text-ink">{profile?.full_name || user?.email}</p>
                <p className="text-[10px] text-ink-soft truncate max-w-[140px]">{profile?.organization || user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
