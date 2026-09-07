import React, { useState, useEffect } from 'react';
import { ScrollText, Search, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/supabase';
import { formatDate } from '../../lib/constants';
import { Spinner } from '../../components/Spinner';
import { AuditLog } from '../../types';

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get('/api/audit')
      .then((data) => {
        if (Array.isArray(data)) setLogs(data);
      })
      .catch((err) => console.error('Failed to load audit trail:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredLogs = logs.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.action.toLowerCase().includes(q) ||
      (l.actor_email && l.actor_email.toLowerCase().includes(q)) ||
      (l.actor_name && l.actor_name.toLowerCase().includes(q)) ||
      (l.entity_id && l.entity_id.toLowerCase().includes(q)) ||
      (l.entity && l.entity.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 rise">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-ink">
            <ScrollText className="text-primary" size={24} /> Append-Only Audit Trail
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Cryptographic, immutable log of all verifications, role modifications, inspections, and public scans.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3.5 top-3 text-ink-soft" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter logs…"
            className="h-10 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-xs outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <Spinner label="Loading audit logs…" />
        ) : filteredLogs.length === 0 ? (
          <div className="p-10 text-center text-xs text-ink-soft">No audit records found.</div>
        ) : (
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-extrabold uppercase tracking-wider text-ink-soft">
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">Action</th>
                <th className="px-5 py-3.5">Actor</th>
                <th className="px-5 py-3.5">Target Entity</th>
                <th className="px-5 py-3.5">Entity ID</th>
                <th className="px-5 py-3.5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-3 text-ink-soft">{new Date(log.created_at).toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3 font-bold text-primary">{log.action}</td>
                  <td className="px-5 py-3 text-ink font-sans">
                    <p className="font-bold">{log.actor_name}</p>
                    <p className="text-[10px] text-ink-soft">{log.actor_email}</p>
                  </td>
                  <td className="px-5 py-3 uppercase text-ink-soft">{log.entity}</td>
                  <td className="px-5 py-3 font-bold text-ink">{log.entity_id}</td>
                  <td className="px-5 py-3 text-ink-soft max-w-xs truncate">
                    {log.details ? JSON.stringify(log.details) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
