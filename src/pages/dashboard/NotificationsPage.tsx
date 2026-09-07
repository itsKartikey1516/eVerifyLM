import React, { useState, useEffect, useCallback } from 'react';
import { Bell, CheckCheck, AlertTriangle, ShieldCheck, ClipboardList, BadgeCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/supabase';
import { formatDate } from '../../lib/constants';
import { Spinner } from '../../components/Spinner';
import { Notification } from '../../types';

export function NotificationsPage() {
  const { user, profile } = useAuth();
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.get(`/api/notifications?email=${encodeURIComponent(user.email)}&role=${profile?.role}`);
      if (Array.isArray(data)) setNotifs(data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleMarkAllRead = async () => {
    if (!user) return;
    try {
      await api.put('/api/notifications', { mark_all: true, email: user.email });
      await loadNotifications();
    } catch (err) {
      console.error('Failed to mark notifications read:', err);
    }
  };

  const getIcon = (kind?: string) => {
    switch (kind) {
      case 'certificate':
        return <BadgeCheck size={18} className="text-emerald-600" />;
      case 'expiry_alert':
        return <AlertTriangle size={18} className="text-amber-600" />;
      case 'schedule':
        return <ClipboardList size={18} className="text-violet-600" />;
      default:
        return <Bell size={18} className="text-primary" />;
    }
  };

  return (
    <div className="space-y-6 rise">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            Notification Centre
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Verification status alerts, scheduled inspection notices, and expiry reminders.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          disabled={notifs.every((n) => n.read)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-ink transition hover:border-primary disabled:opacity-50"
        >
          <CheckCheck size={14} /> Mark All as Read
        </button>
      </div>

      {loading ? (
        <Spinner label="Loading notifications…" />
      ) : notifs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-xs text-ink-soft">
          No notifications yet.
        </div>
      ) : (
        <div className="space-y-3">
          {notifs.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-4 rounded-2xl border p-5 transition ${
                n.read
                  ? 'border-slate-200 bg-white'
                  : 'border-primary/30 bg-primary-soft/30 shadow-sm'
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs">
                {getIcon(n.kind)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className={`text-sm ${n.read ? 'font-bold text-ink' : 'font-extrabold text-primary'}`}>
                    {n.title}
                  </h3>
                  <span className="text-[11px] text-ink-soft">{formatDate(n.created_at)}</span>
                </div>
                <p className="mt-1 text-xs text-ink-soft leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
