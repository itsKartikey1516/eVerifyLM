import React, { useState, useEffect, useCallback } from 'react';
import { Users, Shield, Search, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/supabase';
import { ROLES, formatDate } from '../../lib/constants';
import { Spinner } from '../../components/Spinner';
import { Profile, UserRole } from '../../types';

export function AdminUsers() {
  const { user, profile } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/profiles');
      if (Array.isArray(data)) setProfiles(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load user profiles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const handleRoleChange = async (targetId: number, newRole: UserRole) => {
    setUpdatingId(targetId);
    try {
      await api.put('/api/profiles', {
        id: targetId,
        role: newRole,
        actor_email: user.email,
        actor_name: profile?.full_name || 'Admin'
      });
      await loadProfiles();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update user role');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = profiles.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.email.toLowerCase().includes(q) ||
      p.full_name.toLowerCase().includes(q) ||
      (p.organization && p.organization.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 rise">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            User Roles & Access Control
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Manage permissions across Citizens, Legal Metrology Officers, Test Centres & Administrators.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3.5 top-3 text-ink-soft" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users…"
            className="h-10 w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-xs outline-none focus:border-primary"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <Spinner label="Loading profiles…" />
        ) : (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-extrabold uppercase tracking-wider text-ink-soft">
                <th className="px-6 py-3.5">User / Contact</th>
                <th className="px-6 py-3.5">Organization</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Assigned Role</th>
                <th className="px-6 py-3.5 text-right">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => {
                const roleCfg = ROLES[p.role] || ROLES.citizen;
                return (
                  <tr key={p.id} className="transition hover:bg-slate-50/70">
                    <td className="px-6 py-3.5">
                      <p className="font-bold text-ink">{p.full_name}</p>
                      <p className="text-xs text-ink-soft">{p.email}</p>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-ink-soft">
                      {p.organization || 'General User'}
                    </td>
                    <td className="px-6 py-3.5 text-xs text-ink-soft">
                      {p.district ? `${p.district}, ${p.state}` : '—'}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${roleCfg.chip}`}>
                        {roleCfg.label}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <select
                        value={p.role}
                        disabled={updatingId === p.id}
                        onChange={(e) => handleRoleChange(p.id, e.target.value as UserRole)}
                        className="h-8 cursor-pointer rounded-lg border border-slate-300 bg-white px-2 text-xs font-bold text-ink outline-none hover:border-primary disabled:opacity-50"
                      >
                        <option value="citizen">Citizen</option>
                        <option value="lmo">LMO (Inspector)</option>
                        <option value="gatc">GATC Lab</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
