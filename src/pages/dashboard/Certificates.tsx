import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BadgeCheck, FileText, ExternalLink, QrCode, Search, Ban } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/supabase';
import { formatDate, getCertificateStatus, CERTIFICATE_STATUSES } from '../../lib/constants';
import { Spinner } from '../../components/Spinner';
import { Certificate, CertificateStatusDerived } from '../../types';

export function Certificates() {
  const { user, profile } = useAuth();
  const isCitizen = profile?.role === 'citizen';
  const isAdminOrLMO = profile?.role === 'admin' || profile?.role === 'lmo';

  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | CertificateStatusDerived>('all');
  const [search, setSearch] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadCerts = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const url = isCitizen
        ? `/api/certificates?holder_email=${encodeURIComponent(user.email)}`
        : '/api/certificates';
      const data = await api.get(url);
      if (Array.isArray(data)) setCerts(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  }, [user, isCitizen]);

  useEffect(() => {
    loadCerts();
  }, [loadCerts]);

  const handleRevoke = async (id: number) => {
    if (!window.confirm('Are you sure you want to revoke this certificate? This action is irreversible.')) return;
    try {
      await api.put('/api/certificates', {
        id,
        status: 'revoked',
        actor_email: user.email,
        actor_name: profile?.full_name || 'Officer',
        remarks: 'Revoked by authority during compliance inspection'
      });
      await loadCerts();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to revoke certificate');
    }
  };

  const filteredCerts = certs.filter((c) => {
    const st = getCertificateStatus(c);
    if (statusFilter !== 'all' && st !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.cert_number.toLowerCase().includes(q) ||
      (c.serial_number && c.serial_number.toLowerCase().includes(q)) ||
      (c.business_name && c.business_name.toLowerCase().includes(q)) ||
      (c.holder_name && c.holder_name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 rise">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            {isCitizen ? 'My Certificates of Verification' : 'Issued Digital Certificates'}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Statutory Form VI digital certificates with active QR security tokens.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3.5 top-3 text-ink-soft" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search certificate…"
            className="h-10 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-xs outline-none focus:border-primary"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'valid', 'expiring', 'expired', 'revoked'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold capitalize transition ${
              statusFilter === st
                ? 'bg-ink text-white'
                : 'border border-slate-300 bg-white text-ink-soft hover:border-ink'
            }`}
          >
            {st === 'all' ? 'All' : st === 'expiring' ? 'Expiring Soon' : st}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner label="Loading certificates…" />
      ) : filteredCerts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-xs text-ink-soft">
          No verification certificates found in this view.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCerts.map((c) => {
            const st = getCertificateStatus(c);
            const cfg = CERTIFICATE_STATUSES[st];
            return (
              <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-mono text-xs font-extrabold text-primary">{c.cert_number}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                </div>

                <div className="mt-3">
                  <h3 className="font-bold text-ink">{c.instrument_label}</h3>
                  <p className="font-mono text-xs text-ink-soft">SN: {c.serial_number}</p>
                </div>

                <div className="mt-3 space-y-1 text-xs text-ink-soft border-t border-slate-100 pt-2">
                  <div className="flex justify-between">
                    <span>Holder:</span>
                    <span className="font-medium text-ink truncate max-w-[150px]">{c.holder_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seal No:</span>
                    <span className="font-mono font-medium text-ink">{c.seal_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valid Until:</span>
                    <span className="font-bold text-ink">{formatDate(c.expiry_date)}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <Link
                    to={`/certificate/${c.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                  >
                    <FileText size={13} /> View Form VI <ExternalLink size={11} />
                  </Link>

                  {isAdminOrLMO && c.status === 'valid' && (
                    <button
                      onClick={() => handleRevoke(c.id)}
                      className="text-[11px] font-bold text-red-600 hover:underline"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
