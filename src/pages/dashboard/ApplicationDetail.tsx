import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  FileCheck2,
  Scale,
  Plus,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/supabase';
import { StatusBadge } from '../../components/StatusBadge';
import { Spinner } from '../../components/Spinner';
import { APPLICATION_STEPS, formatDate, formatCurrency, INSTRUMENT_TYPES } from '../../lib/constants';
import { Application, Inspection, Certificate, InspectionReading } from '../../types';

export function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const isOfficer = profile?.role === 'lmo' || profile?.role === 'gatc' || profile?.role === 'admin';

  const [app, setApp] = useState<Application | null>(null);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Action forms
  const [scheduleDate, setScheduleDate] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().split('T')[0]);
  const [sealNumber, setSealNumber] = useState('');
  const [testResult, setTestResult] = useState<'pass' | 'fail'>('pass');
  const [remarks, setRemarks] = useState('');
  const [readings, setReadings] = useState<InspectionReading[]>([
    { denomination: '10 kg', indicated: '10.000 kg', error: '0.00%' },
    { denomination: '25 kg', indicated: '25.002 kg', error: '+0.008%' }
  ]);

  const loadAll = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [appData, inspData, certData] = await Promise.all([
        api.get(`/api/applications?id=${id}`),
        api.get(`/api/inspections?application_id=${id}`),
        api.get(`/api/certificates?application_id=${id}`)
      ]);
      if (appData) setApp(appData);
      if (Array.isArray(inspData)) setInspections(inspData);
      if (certData) setCert(certData);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load application details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleAddReading = () => {
    setReadings([...readings, { denomination: '', indicated: '', error: '0.00%' }]);
  };

  const handleRemoveReading = (index: number) => {
    setReadings(readings.filter((_, i) => i !== index));
  };

  const handleReadingChange = (index: number, field: keyof InspectionReading, val: string) => {
    const next = [...readings];
    next[index][field] = val;
    setReadings(next);
  };

  // State transitions
  const handleSchedule = async () => {
    if (!scheduleDate) {
      setErrorMsg('Please select a scheduled inspection date.');
      return;
    }
    setActionLoading(true);
    try {
      await api.put('/api/applications', {
        id: Number(id),
        action: 'schedule',
        scheduled_date: scheduleDate,
        actor_email: user.email,
        actor_name: profile?.full_name || 'Officer'
      });
      await loadAll();
    } catch (err: any) {
      setErrorMsg(err.message || 'Scheduling failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecordInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (testResult === 'pass' && !sealNumber.trim()) {
      setErrorMsg('Anti-tamper seal number is required for a passed verification.');
      return;
    }
    setActionLoading(true);
    try {
      await api.post('/api/inspections', {
        application_id: Number(id),
        officer_email: user.email,
        officer_name: profile?.full_name || 'Officer',
        inspection_date: inspectionDate,
        readings: readings.filter(r => r.denomination.trim() || r.indicated.trim()),
        result: testResult,
        seal_number: sealNumber.trim(),
        remarks: remarks.trim()
      });
      await loadAll();
    } catch (err: any) {
      setErrorMsg(err.message || 'Inspection recording failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleIssueCertificate = async () => {
    setActionLoading(true);
    try {
      const typeCfg = INSTRUMENT_TYPES.find(t => t.value === app?.instrument_type);
      const validity = typeCfg?.validity || 12;

      await api.post('/api/certificates', {
        application_id: Number(id),
        issued_by_email: user.email,
        issued_by_name: profile?.full_name || 'Legal Metrology Officer',
        validity_months: validity
      });
      await loadAll();
    } catch (err: any) {
      setErrorMsg(err.message || 'Certificate issuance failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setErrorMsg('Please provide a reason for rejection.');
      return;
    }
    setActionLoading(true);
    try {
      await api.put('/api/applications', {
        id: Number(id),
        action: 'reject',
        remarks: rejectionReason.trim(),
        actor_email: user.email,
        actor_name: profile?.full_name || 'Officer'
      });
      await loadAll();
    } catch (err: any) {
      setErrorMsg(err.message || 'Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Spinner label="Loading application lifecycle…" />;
  if (errorMsg && !app) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        {errorMsg} <Link to="/dashboard/applications" className="underline ml-2">Back to list</Link>
      </div>
    );
  }
  if (!app) return null;

  const currentStepIdx = APPLICATION_STEPS.findIndex(s => s.key === app.status);
  const isRejected = app.status === 'rejected';

  return (
    <div className="space-y-6 rise">
      <Link
        to="/dashboard/applications"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-primary"
      >
        <ArrowLeft size={15} /> All Applications
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <span className="font-mono text-xs font-bold text-primary">{app.app_number}</span>
          <h1 className="text-xl font-extrabold text-ink sm:text-2xl">{app.instrument_label}</h1>
          <p className="mt-1 text-xs text-ink-soft">
            Applicant: {app.applicant_name} ({app.business_name}) · Location: {app.district}, {app.state}
          </p>
        </div>
        <StatusBadge status={app.status} />
      </div>

      {/* Lifecycle Stepper */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-ink-soft">Verification Lifecycle</h2>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          {APPLICATION_STEPS.map((step, idx) => {
            const isCompleted = !isRejected && currentStepIdx >= idx;
            const isCurrent = !isRejected && currentStepIdx === idx;
            return (
              <div key={step.key} className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    isCompleted
                      ? 'bg-primary text-white'
                      : isCurrent
                      ? 'border-2 border-primary text-primary bg-primary-soft'
                      : 'border border-slate-300 text-ink-soft bg-slate-50'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={16} /> : idx + 1}
                </div>
                <span className={`text-xs font-bold ${isCompleted || isCurrent ? 'text-ink' : 'text-ink-soft'}`}>
                  {step.label}
                </span>
                {idx < APPLICATION_STEPS.length - 1 && (
                  <div className={`hidden sm:block h-0.5 w-8 md:w-16 ${currentStepIdx > idx ? 'bg-primary' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
          {isRejected && (
            <div className="flex items-center gap-2 text-xs font-bold text-red-600">
              <XCircle size={16} /> Rejected
            </div>
          )}
        </div>
      </div>

      {/* Metadata & Officer Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-ink">Application Details</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-ink-soft">Serial Number:</span>
                <p className="font-mono font-bold text-ink">{app.serial_number}</p>
              </div>
              <div>
                <span className="text-ink-soft">Statutory Fee:</span>
                <p className="font-bold text-ink">{formatCurrency(app.fee)}</p>
              </div>
              <div>
                <span className="text-ink-soft">Submission Date:</span>
                <p className="font-bold text-ink">{formatDate(app.created_at)}</p>
              </div>
              <div>
                <span className="text-ink-soft">Preferred Inspection:</span>
                <p className="font-bold text-ink">{formatDate(app.preferred_date)}</p>
              </div>
              <div>
                <span className="text-ink-soft">Scheduled Date:</span>
                <p className="font-bold text-primary">{formatDate(app.scheduled_date)}</p>
              </div>
              <div>
                <span className="text-ink-soft">Assigned Officer:</span>
                <p className="font-bold text-ink">{app.assigned_officer_name || 'Pending assignment'}</p>
              </div>
            </div>

            {app.remarks && (
              <div className="mt-4 border-t border-slate-100 pt-3 text-xs">
                <span className="text-ink-soft">Remarks / Reason:</span>
                <p className="mt-1 font-medium text-ink">{app.remarks}</p>
              </div>
            )}
          </div>

          {/* Test Readings & Inspection History */}
          {inspections.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-ink">Recorded Field Inspection Logs</h3>
              {inspections.map((insp) => (
                <div key={insp.id} className="mt-4 rounded-2xl border border-slate-200 bg-surface/50 p-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-ink">
                      Inspected by {insp.officer_name} on {formatDate(insp.inspection_date)}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                      insp.result === 'pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {insp.result}
                    </span>
                  </div>

                  <div>
                    <span className="text-ink-soft">Anti-Tamper Seal Number:</span>
                    <p className="font-mono font-bold text-primary">{insp.seal_number || 'N/A'}</p>
                  </div>

                  {insp.readings && insp.readings.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 text-ink-soft font-bold">
                            <th className="py-1.5">Denomination</th>
                            <th className="py-1.5">Indicated Reading</th>
                            <th className="py-1.5">Error Margin</th>
                          </tr>
                        </thead>
                        <tbody>
                          {insp.readings.map((r, i) => (
                            <tr key={i} className="border-b border-slate-100 font-mono">
                              <td className="py-1.5">{r.denomination}</td>
                              <td className="py-1.5">{r.indicated}</td>
                              <td className="py-1.5 text-emerald-600">{r.error}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {insp.remarks && <p className="text-ink-soft italic">"{insp.remarks}"</p>}
                </div>
              ))}
            </div>
          )}

          {/* Issued Certificate Link */}
          {cert && (
            <div className="rounded-3xl border-2 border-emerald-300 bg-emerald-50/50 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
                    <FileCheck2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-950">Certificate of Verification Issued</h3>
                    <p className="font-mono text-xs font-extrabold text-emerald-800">{cert.cert_number}</p>
                  </div>
                </div>
                <Link
                  to={`/certificate/${cert.id}`}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-sm"
                >
                  View / Print Form VI
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Workflow Actions (for LMO / GATC / Admin) */}
        <div className="space-y-6">
          {isOfficer && !isRejected && !cert && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
              <h3 className="text-sm font-extrabold text-ink">Officer Workflow Control</h3>

              {/* Step: Schedule Inspection */}
              {app.status === 'submitted' || app.status === 'under_review' ? (
                <div className="space-y-3">
                  <label className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft">
                    Schedule Field Inspection
                  </label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs outline-none focus:border-primary"
                  />
                  <button
                    onClick={handleSchedule}
                    disabled={actionLoading}
                    className="w-full rounded-xl bg-primary py-2 text-xs font-bold text-white transition hover:bg-primary-dark disabled:opacity-50"
                  >
                    Set Schedule Date
                  </button>
                </div>
              ) : null}

              {/* Step: Record Test Readings */}
              {app.status === 'scheduled' ? (
                <form onSubmit={handleRecordInspection} className="space-y-3">
                  <label className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft">
                    Field Inspection Readings & Seal
                  </label>

                  <div>
                    <span className="text-[10px] text-ink-soft font-bold">Anti-Tamper Lead Seal No. *</span>
                    <input
                      type="text"
                      value={sealNumber}
                      onChange={(e) => setSealNumber(e.target.value)}
                      placeholder="e.g. MH-LM-PUN-2026-9042"
                      className="mt-1 h-9 w-full rounded-xl border border-slate-300 bg-white px-3 font-mono text-xs outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[10px] text-ink-soft font-bold">Test Denominations:</span>
                    {readings.map((r, i) => (
                      <div key={i} className="flex gap-1">
                        <input
                          type="text"
                          value={r.denomination}
                          onChange={(e) => handleReadingChange(i, 'denomination', e.target.value)}
                          placeholder="Standard (10 kg)"
                          className="h-8 flex-1 rounded-lg border border-slate-300 px-2 text-[11px]"
                        />
                        <input
                          type="text"
                          value={r.indicated}
                          onChange={(e) => handleReadingChange(i, 'indicated', e.target.value)}
                          placeholder="Indicated"
                          className="h-8 flex-1 rounded-lg border border-slate-300 px-2 text-[11px]"
                        />
                        {readings.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveReading(i)}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddReading}
                      className="text-[11px] font-bold text-primary hover:underline"
                    >
                      + Add Reading Row
                    </button>
                  </div>

                  <div>
                    <span className="text-[10px] text-ink-soft font-bold">Outcome</span>
                    <select
                      value={testResult}
                      onChange={(e) => setTestResult(e.target.value as any)}
                      className="mt-1 h-9 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs outline-none"
                    >
                      <option value="pass">PASS (Within Maximum Permissible Error)</option>
                      <option value="fail">FAIL (Error Exceeds Statutory Limit)</option>
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] text-ink-soft font-bold">Officer Remarks</span>
                    <input
                      type="text"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      placeholder="Calibration observations"
                      className="mt-1 h-9 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="w-full rounded-xl bg-primary py-2 text-xs font-bold text-white transition hover:bg-primary-dark disabled:opacity-50"
                  >
                    Save Inspection Log
                  </button>
                </form>
              ) : null}

              {/* Step: Issue Certificate */}
              {app.status === 'inspected' ? (
                <div className="space-y-3">
                  <div className="rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
                    Inspection completed successfully. Ready to generate digital certificate with QR seal.
                  </div>
                  <button
                    onClick={handleIssueCertificate}
                    disabled={actionLoading}
                    className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 shadow-sm disabled:opacity-50"
                  >
                    Issue Digital Verification Certificate
                  </button>
                </div>
              ) : null}

              {/* Reject Application */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-red-600">
                  Reject Application
                </span>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Reason for rejection / non-compliance"
                  className="h-9 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs outline-none focus:border-red-400"
                />
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="w-full rounded-xl border border-red-200 bg-red-50 py-2 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
                >
                  Reject Application
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
