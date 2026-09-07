import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  ClipboardList,
  BadgeCheck,
  AlertTriangle,
  Users,
  Plus,
  ArrowRight,
  SearchCheck,
  TrendingUp,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/supabase';
import { StatusBadge } from '../../components/StatusBadge';
import { formatDate, daysUntilExpiry, formatCurrency } from '../../lib/constants';
import { Application, Certificate, Instrument } from '../../types';

export function DashboardHome() {
  const { profile, user } = useAuth();
  const role = profile?.role || 'citizen';

  const [apps, setApps] = useState<Application[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchPromises = [
      role === 'citizen'
        ? api.get(`/api/applications?applicant_email=${encodeURIComponent(user?.email || '')}`)
        : api.get('/api/applications'),
      role === 'citizen'
        ? api.get(`/api/certificates?holder_email=${encodeURIComponent(user?.email || '')}`)
        : api.get('/api/certificates'),
      role === 'citizen'
        ? api.get(`/api/instruments?owner_email=${encodeURIComponent(user?.email || '')}`)
        : api.get('/api/instruments'),
    ];

    Promise.all(fetchPromises)
      .then(([appsData, certsData, instData]) => {
        if (Array.isArray(appsData)) setApps(appsData);
        if (Array.isArray(certsData)) setCerts(certsData);
        if (Array.isArray(instData)) setInstruments(instData);
      })
      .catch((err) => console.error('Dashboard load failed:', err))
      .finally(() => setLoading(false));
  }, [role, user]);

  const pendingApps = apps.filter((a) => a.status !== 'certified' && a.status !== 'rejected');
  const expiringCerts = certs.filter((c) => {
    const days = daysUntilExpiry(c.expiry_date);
    return days >= 0 && days <= 30;
  });

  return (
    <div className="space-y-8 rise">
      {/* Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Workspace Overview · {role.toUpperCase()}
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">
            Welcome back, {profile?.full_name || 'Officer'}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {profile?.organization || 'National Legal Metrology Digital Verification System'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {role === 'citizen' ? (
            <>
              <Link
                to="/dashboard/instruments"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-ink transition hover:border-primary"
              >
                <Plus size={14} /> Register Instrument
              </Link>
              <Link
                to="/dashboard/applications"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-primary-dark shadow-sm"
              >
                <ClipboardList size={14} /> New Application
              </Link>
            </>
          ) : (
            <Link
              to="/dashboard/applications"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-primary-dark shadow-sm"
            >
              <ClipboardList size={14} /> Open Verification Queue ({pendingApps.length})
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <ClipboardList size={18} />
          </div>
          <p className="mt-3 text-2xl font-extrabold text-ink">{apps.length}</p>
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">Total Applications</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <Clock size={18} />
          </div>
          <p className="mt-3 text-2xl font-extrabold text-ink">{pendingApps.length}</p>
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">In Progress / Queue</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <BadgeCheck size={18} />
          </div>
          <p className="mt-3 text-2xl font-extrabold text-ink">{certs.length}</p>
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">Issued Certificates</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
            <AlertTriangle size={18} />
          </div>
          <p className="mt-3 text-2xl font-extrabold text-ink">{expiringCerts.length}</p>
          <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">Expiring in 30 Days</p>
        </div>
      </div>

      {/* Expiring Reminder Alert if any */}
      {expiringCerts.length > 0 && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <div className="flex items-center gap-2 text-amber-900 font-bold">
            <AlertTriangle size={18} />
            <span>Verification Expiry Notice ({expiringCerts.length} instruments)</span>
          </div>
          <p className="mt-1 text-xs text-amber-700">
            The following certificates are due for periodic re-verification within 30 days. Please ensure timely inspection.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {expiringCerts.map((c) => (
              <Link
                key={c.id}
                to={`/certificate/${c.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1 text-xs font-mono font-bold text-amber-900 hover:border-amber-500"
              >
                {c.cert_number} ({c.instrument_label}) →
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Applications Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-sm font-extrabold text-ink">Recent Verification Applications</h2>
          <Link to="/dashboard/applications" className="text-xs font-bold text-primary hover:underline">
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-extrabold uppercase tracking-wider text-ink-soft">
                <th className="px-6 py-3">App Number</th>
                <th className="px-6 py-3">Instrument</th>
                <th className="px-6 py-3">Applicant</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Fee</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {apps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-xs text-ink-soft">
                    No applications filed yet.
                  </td>
                </tr>
              ) : (
                apps.slice(0, 5).map((a) => (
                  <tr key={a.id} className="transition hover:bg-slate-50/70">
                    <td className="px-6 py-3.5 font-mono font-bold text-primary">{a.app_number}</td>
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-ink">{a.instrument_label}</p>
                      <p className="font-mono text-xs text-ink-soft">SN: {a.serial_number}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-ink">{a.applicant_name}</p>
                      <p className="text-xs text-ink-soft">{a.business_name}</p>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-ink-soft">{formatDate(a.created_at)}</td>
                    <td className="px-6 py-3.5 font-bold text-ink">{formatCurrency(a.fee)}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        to={`/dashboard/applications/${a.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        Details <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
