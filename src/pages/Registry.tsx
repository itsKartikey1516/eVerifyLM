import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BadgeCheck, FileText, ExternalLink, Filter } from 'lucide-react';
import { GovernmentBar, PublicHeader, PublicFooter } from '../components/PublicChrome';
import { Spinner } from '../components/Spinner';
import { api } from '../lib/supabase';
import { formatDate, getCertificateStatus, CERTIFICATE_STATUSES } from '../lib/constants';
import { Certificate, CertificateStatusDerived } from '../types';

export function Registry() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CertificateStatusDerived>('all');

  useEffect(() => {
    setLoading(true);
    api.get('/api/certificates')
      .then((data) => {
        if (Array.isArray(data)) setCerts(data);
      })
      .catch((err) => console.error('Registry fetch failed:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredCerts = certs.filter((c) => {
    const status = getCertificateStatus(c);
    if (statusFilter !== 'all' && status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.cert_number.toLowerCase().includes(q) ||
      (c.serial_number && c.serial_number.toLowerCase().includes(q)) ||
      (c.business_name && c.business_name.toLowerCase().includes(q)) ||
      (c.holder_name && c.holder_name.toLowerCase().includes(q)) ||
      (c.district && c.district.toLowerCase().includes(q)) ||
      (c.state && c.state.toLowerCase().includes(q)) ||
      (c.instrument_label && c.instrument_label.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <GovernmentBar />
      <PublicHeader />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-extrabold text-primary">
              <BadgeCheck size={14} /> Public Record · No Login Required
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">
              Certificate Registry
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              Search verified weighing & measuring instruments across all States and Union Territories.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-3 text-ink-soft" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cert no, business, state…"
              className="h-10 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="mt-6 flex flex-wrap gap-2">
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
              {st === 'all' ? 'All Records' : st === 'expiring' ? 'Expiring Soon' : st}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <Spinner label="Loading National Certificate Registry…" />
          ) : (
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-extrabold uppercase tracking-wider text-ink-soft">
                  <th className="px-5 py-3.5">Cert Number</th>
                  <th className="px-5 py-3.5">Instrument</th>
                  <th className="px-5 py-3.5">Holder / Business</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Validity</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCerts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-sm text-ink-soft">
                      No matching verification certificates found.
                    </td>
                  </tr>
                ) : (
                  filteredCerts.map((c) => {
                    const st = getCertificateStatus(c);
                    const cfg = CERTIFICATE_STATUSES[st];
                    return (
                      <tr key={c.id} className="transition hover:bg-slate-50/70">
                        <td className="px-5 py-3.5">
                          <span className="font-mono font-bold text-primary">{c.cert_number}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-ink">{c.instrument_label}</p>
                          <p className="font-mono text-xs text-ink-soft">SN: {c.serial_number}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-ink">{c.business_name || c.holder_name}</p>
                          <p className="text-xs text-ink-soft">{c.holder_name}</p>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-ink-soft">
                          {c.district}, {c.state}
                        </td>
                        <td className="px-5 py-3.5 text-xs">
                          <p className="font-medium text-ink">{formatDate(c.expiry_date)}</p>
                          <p className="text-[11px] text-ink-soft">Issued: {formatDate(c.issue_date)}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${cfg.badge}`}>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            to={`/certificate/${c.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                          >
                            View Form VI <ExternalLink size={12} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
