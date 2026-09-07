import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Scale
} from 'lucide-react';
import { api } from '../lib/supabase';
import { formatDate, getCertificateStatus, CERTIFICATE_STATUSES } from '../lib/constants';
import { Spinner } from '../components/Spinner';
import { Certificate } from '../types';

export function CertificateView() {
  const { id } = useParams<{ id: string }>();
  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (id) {
      setLoading(true);
      api.get(`/api/certificates?id=${id}`)
        .then((res) => {
          if (res) setCert(res);
          else setErrorMsg('Certificate not found.');
        })
        .catch((err) => setErrorMsg(err.message || 'Error loading certificate.'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Spinner label="Loading Official Verification Certificate…" />
      </div>
    );
  }

  if (errorMsg || !cert) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-4">
        <p className="text-lg font-bold text-red-600">{errorMsg || 'Certificate not found.'}</p>
        <Link to="/registry" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white">
          Back to Registry
        </Link>
      </div>
    );
  }

  const verifyUrl = `${window.location.origin}/verify/${cert.token}`;
  const status = getCertificateStatus(cert);
  const statusCfg = CERTIFICATE_STATUSES[status];

  return (
    <div className="min-h-screen bg-surface py-8">
      {/* Top Action Bar */}
      <div className="no-print mx-auto mb-5 flex max-w-3xl items-center justify-between px-4">
        <Link
          to="/dashboard/certificates"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-primary"
        >
          <ArrowLeft size={15} /> Back
        </Link>
        <div className="flex items-center gap-3">
          <span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusCfg.badge}`}>
            ● {statusCfg.label}
          </span>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white transition hover:bg-primary-dark shadow-sm"
          >
            <Printer size={14} /> Print / PDF
          </button>
        </div>
      </div>

      {/* Printable Certificate Sheet (Form VI) */}
      <div className="cert-sheet cert-guilloche mx-auto max-w-3xl rounded-3xl border-4 border-double border-primary/40 bg-white p-8 shadow-2xl sm:p-12">
        {/* Tricolor Bar */}
        <div className="tricolor h-2 rounded-full mb-6" />

        {/* Certificate Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
            <Scale size={24} />
          </div>
          <p className="mt-2 text-xs font-extrabold uppercase tracking-widest text-ink-soft">
            Government of India · Ministry of Consumer Affairs
          </p>
          <h1 className="mt-1 text-xl font-extrabold text-ink sm:text-2xl">
            DEPARTMENT OF LEGAL METROLOGY
          </h1>
          <p className="text-xs font-bold text-ink-soft">
            State of {cert.state} · District of {cert.district}
          </p>
          <div className="mt-3 inline-block rounded-lg bg-primary-soft px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-primary">
            SCHEDULE XI · FORM VI · CERTIFICATE OF VERIFICATION
          </div>
          <p className="mt-1 text-[11px] text-ink-soft">
            Issued under Section 24 of the Legal Metrology Act, 2009 (Act 1 of 2010)
          </p>
        </div>

        {/* Certificate Identifier & Dates */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-slate-200 py-3 text-xs">
          <div>
            <span className="text-ink-soft">Certificate Number:</span>
            <p className="font-mono text-base font-extrabold text-primary">{cert.cert_number}</p>
          </div>
          <div>
            <span className="text-ink-soft">Date of Verification:</span>
            <p className="font-bold text-ink">{formatDate(cert.issue_date)}</p>
          </div>
          <div>
            <span className="text-ink-soft">Next Verification Due Before:</span>
            <p className="font-bold text-red-600">{formatDate(cert.expiry_date)}</p>
          </div>
        </div>

        {/* Certificate Body Paragraph */}
        <div className="mt-6 text-xs leading-relaxed text-ink space-y-3">
          <p>
            I hereby certify that I have examined and tested the weighing/measuring instrument described hereunder,
            belonging to <strong className="text-ink">{cert.holder_name}</strong> of{' '}
            <strong className="text-ink">{cert.business_name}</strong>, situated at {cert.district}, {cert.state},
            and found the same to conform to the standards and maximum permissible error limits prescribed under
            the Legal Metrology Act, 2009 and the Legal Metrology (General) Rules, 2011.
          </p>
        </div>

        {/* Specifications Grid */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-surface/50 p-5">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-primary">
            Instrument Technical Specifications
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-ink-soft">Category / Type:</span>
              <p className="font-bold text-ink">{cert.instrument_label}</p>
            </div>
            <div>
              <span className="text-ink-soft">Serial Number:</span>
              <p className="font-mono font-bold text-ink">{cert.serial_number}</p>
            </div>
            <div>
              <span className="text-ink-soft">Make & Model:</span>
              <p className="font-bold text-ink">{cert.make} {cert.model}</p>
            </div>
            <div>
              <span className="text-ink-soft">Max Capacity / Range:</span>
              <p className="font-bold text-ink">{cert.capacity}</p>
            </div>
            <div>
              <span className="text-ink-soft">Anti-Tamper Seal Number:</span>
              <p className="font-mono font-bold text-primary">{cert.seal_number}</p>
            </div>
            <div>
              <span className="text-ink-soft">Stamping Zone:</span>
              <p className="font-bold text-ink">{cert.district} Zone II</p>
            </div>
          </div>
        </div>

        {/* Footer: QR Code & Signature Stamp */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-slate-200 pt-6">
          {/* QR Verification Badge */}
          <div className="flex items-center gap-3">
            <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-primary bg-white p-2 shadow-sm">
              <QrCode size={56} className="text-primary" />
            </div>
            <div className="text-[11px] text-ink-soft">
              <p className="font-extrabold text-ink">Digital QR Security Seal</p>
              <p>Scan with any smartphone</p>
              <p>to verify live registry record.</p>
              <p className="mt-1 font-mono text-[9px] text-ink-soft/80 truncate max-w-[160px]">
                {cert.token}
              </p>
            </div>
          </div>

          {/* Officer Stamp */}
          <div className="text-right text-xs">
            <div className="inline-block border-b border-ink/40 pb-1 text-center min-w-48">
              <p className="font-bold text-primary">DIGITALLY VERIFIED</p>
              <p className="text-[10px] font-mono text-ink-soft">e-Signed via DSC / Token</p>
            </div>
            <p className="mt-1 font-bold text-ink">{cert.issued_by_name}</p>
            <p className="text-[11px] text-ink-soft">Legal Metrology Inspectorate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
