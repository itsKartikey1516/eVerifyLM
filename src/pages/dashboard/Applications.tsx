import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Plus,
  X,
  Calendar,
  IndianRupee,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/supabase';
import { StatusBadge } from '../../components/StatusBadge';
import { Spinner } from '../../components/Spinner';
import { INSTRUMENT_TYPES, VERIFICATION_TYPES, formatCurrency, formatDate } from '../../lib/constants';
import { Application, Instrument, ApplicationStatus } from '../../types';

export function Applications() {
  const { user, profile } = useAuth();
  const [searchParams] = useSearchParams();
  const isCitizen = profile?.role === 'citizen';
  const preselectedInstId = searchParams.get('inst');

  const [apps, setApps] = useState<Application[]>([]);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(searchParams.get('new') === '1');
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | ApplicationStatus>('all');
  const [errorMsg, setErrorMsg] = useState('');

  // Form
  const [selectedInstId, setSelectedInstId] = useState(preselectedInstId || '');
  const [verifType, setVerifType] = useState('re_verification');
  const [preferredDate, setPreferredDate] = useState('');

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (isCitizen) {
        const [appsData, instData] = await Promise.all([
          api.get(`/api/applications?applicant_email=${encodeURIComponent(user.email)}`),
          api.get(`/api/instruments?owner_email=${encodeURIComponent(user.email)}`)
        ]);
        if (Array.isArray(appsData)) setApps(appsData);
        if (Array.isArray(instData)) {
          setInstruments(instData);
          if (!selectedInstId && instData.length > 0) {
            setSelectedInstId(String(instData[0].id));
          }
        }
      } else {
        const appsData = await api.get('/api/applications');
        if (Array.isArray(appsData)) setApps(appsData);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  }, [user, isCitizen, selectedInstId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectedInst = instruments.find((i) => String(i.id) === selectedInstId);
  const typeConfig = selectedInst ? INSTRUMENT_TYPES.find((t) => t.value === selectedInst.instrument_type) : null;
  const computedFee = typeConfig?.fee || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedInstId) {
      setErrorMsg('Please select an instrument.');
      return;
    }
    if (!preferredDate) {
      setErrorMsg('Please select a preferred inspection date.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/api/applications', {
        instrument_id: Number(selectedInstId),
        applicant_email: user.email,
        applicant_name: profile?.full_name || user.email.split('@')[0],
        application_type: verifType,
        fee: computedFee,
        preferred_date: preferredDate
      });

      setShowForm(false);
      setPreferredDate('');
      await loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredApps = apps.filter((a) => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  return (
    <div className="space-y-6 rise">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            {isCitizen ? 'My Verification Applications' : 'Verification Queue'}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            {isCitizen
              ? 'Track online applications from submission through field inspection to certification.'
              : 'District-wide verification applications pending review, inspection, and certification.'}
          </p>
        </div>

        {isCitizen && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark shadow-sm"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancel' : 'New Verification Application'}
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* New Application Form */}
      {isCitizen && showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-base font-extrabold text-ink">Apply for Verification / Re-verification</h2>
          <p className="mt-1 text-xs text-ink-soft">
            Statutory fee is auto-calculated based on instrument specifications.
          </p>

          {instruments.length === 0 ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
              You have no registered instruments. Please{' '}
              <Link to="/dashboard/instruments?new=1" className="font-bold underline">
                enrol an instrument first
              </Link>{' '}
              to apply for verification.
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft">
                  Select Registered Instrument *
                </label>
                <select
                  value={selectedInstId}
                  onChange={(e) => setSelectedInstId(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {instruments.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.type_label} (SN: {inst.serial_number})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft">
                  Verification Category *
                </label>
                <select
                  value={verifType}
                  onChange={(e) => setVerifType(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {VERIFICATION_TYPES.map((vt) => (
                    <option key={vt.value} value={vt.value}>
                      {vt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft">
                  Preferred Inspection Date *
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Fee Breakdown Card */}
              <div className="sm:col-span-3 rounded-2xl bg-surface p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft">
                    Statutory Verification Fee (Legal Metrology Rules Schedule)
                  </span>
                  <p className="font-mono text-xl font-extrabold text-ink">
                    {formatCurrency(computedFee)}
                  </p>
                  <p className="text-[11px] text-ink-soft">
                    Includes stamping, physical sealing & certificate generation.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white transition hover:bg-primary-dark shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Submitting Application…' : 'Submit & Forward to Officer'}
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'submitted', 'under_review', 'scheduled', 'inspected', 'certified', 'rejected'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold capitalize transition ${
              statusFilter === st
                ? 'bg-ink text-white'
                : 'border border-slate-300 bg-white text-ink-soft hover:border-ink'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Applications Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <Spinner label="Loading applications…" />
        ) : (
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-extrabold uppercase tracking-wider text-ink-soft">
                <th className="px-6 py-3.5">App Number</th>
                <th className="px-6 py-3.5">Instrument & Serial</th>
                <th className="px-6 py-3.5">Applicant / Business</th>
                <th className="px-6 py-3.5">Type & Date</th>
                <th className="px-6 py-3.5">Fee</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-xs text-ink-soft">
                    No verification applications in this view.
                  </td>
                </tr>
              ) : (
                filteredApps.map((a) => (
                  <tr key={a.id} className="transition hover:bg-slate-50/70">
                    <td className="px-6 py-3.5">
                      <span className="font-mono font-bold text-primary">{a.app_number}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-ink">{a.instrument_label}</p>
                      <p className="font-mono text-xs text-ink-soft">SN: {a.serial_number}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-ink">{a.applicant_name}</p>
                      <p className="text-xs text-ink-soft">{a.business_name}</p>
                    </td>
                    <td className="px-6 py-3.5 text-xs">
                      <p className="capitalize font-medium text-ink">{a.application_type.replace('_', ' ')}</p>
                      <p className="text-ink-soft">Filed: {formatDate(a.created_at)}</p>
                    </td>
                    <td className="px-6 py-3.5 font-bold text-ink">{formatCurrency(a.fee)}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        to={`/dashboard/applications/${a.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        Lifecycle <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
