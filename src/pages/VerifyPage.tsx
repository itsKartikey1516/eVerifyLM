import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  QrCode,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Building2,
  Scale
} from 'lucide-react';
import { GovernmentBar, PublicHeader, PublicFooter } from '../components/PublicChrome';
import { Spinner } from '../components/Spinner';
import { api } from '../lib/supabase';
import { useI18n } from '../lib/i18n';
import { formatDate, daysUntilExpiry, getCertificateStatus, CERTIFICATE_STATUSES } from '../lib/constants';
import { Certificate } from '../types';

export function VerifyPage() {
  const { token: urlToken } = useParams<{ token?: string }>();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const { t } = useI18n();

  const [inputVal, setInputVal] = useState(urlToken || queryParam);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Certificate | null>(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const executeLookup = async (identifier: string) => {
    if (!identifier.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setSearched(true);
    setResult(null);

    try {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier.trim());
      const query = isUUID
        ? `token=${encodeURIComponent(identifier.trim())}`
        : `cert_number=${encodeURIComponent(identifier.trim())}`;

      const res = await api.get(`/api/verify?${query}`);
      if (res && res.found && res.certificate) {
        setResult(res.certificate);
      } else {
        setErrorMsg('No matching certificate was found in the National Legal Metrology Registry.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lookup failed. Please verify your input.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlToken) {
      executeLookup(urlToken);
    } else if (queryParam) {
      executeLookup(queryParam);
    }
  }, [urlToken, queryParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLookup(inputVal);
  };

  const status = result ? getCertificateStatus(result) : null;
  const statusCfg = status ? CERTIFICATE_STATUSES[status] : null;
  const daysLeft = result ? daysUntilExpiry(result.expiry_date) : 0;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <GovernmentBar />
      <PublicHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-8">
        <div className="text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
            <QrCode size={28} />
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink">
            {t('verify_title')}
          </h1>
          <p className="mt-2 text-sm text-ink-soft max-w-lg mx-auto">
            {t('verify_sub')}
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-xl gap-2">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="e.g. LM/MH/2026/000734 or UUID QR token"
            aria-label="Certificate number or QR Token"
            className="h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 font-mono text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-50"
          >
            <Search size={16} /> {t('btn_verify')}
          </button>
        </form>

        {/* Examples */}
        <div className="mt-3 text-center text-xs text-ink-soft">
          Try sample:{' '}
          <button
            type="button"
            onClick={() => {
              setInputVal('LM/MH/2026/000734');
              executeLookup('LM/MH/2026/000734');
            }}
            className="font-mono font-bold text-primary hover:underline"
          >
            LM/MH/2026/000734
          </button>
          {' · '}
          <button
            type="button"
            onClick={() => {
              setInputVal('8a7d2c14-5e99-4c22-b06f-998811223344');
              executeLookup('8a7d2c14-5e99-4c22-b06f-998811223344');
            }}
            className="font-mono font-bold text-primary hover:underline"
          >
            UUID Token
          </button>
        </div>

        {/* Results Area */}
        <div className="mt-10">
          {loading && <Spinner label="Querying National Registry…" />}

          {errorMsg && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <XCircle size={24} />
              </div>
              <h3 className="mt-3 text-base font-bold text-red-800">Verification Failed</h3>
              <p className="mt-1 text-sm text-red-600">{errorMsg}</p>
            </div>
          )}

          {result && statusCfg && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={20} />
                  </span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                      Verified Legal Metrology Certificate
                    </span>
                    <h2 className="font-mono text-xl font-extrabold text-primary sm:text-2xl">
                      {result.cert_number}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-3 py-1 text-xs font-extrabold ${statusCfg.badge}`}>
                    ● {statusCfg.label}
                  </span>
                </div>
              </div>

              {/* Expiry alert */}
              {status === 'expiring' && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 font-semibold">
                  <AlertTriangle size={15} />
                  <span>This certificate is expiring in {daysLeft} days. Re-verification required soon.</span>
                </div>
              )}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="space-y-3 rounded-2xl bg-surface p-4 text-xs">
                  <div>
                    <span className="text-ink-soft">Instrument Type:</span>
                    <p className="font-bold text-ink text-sm">{result.instrument_label}</p>
                  </div>
                  <div>
                    <span className="text-ink-soft">Serial / Model:</span>
                    <p className="font-mono font-bold text-ink">{result.serial_number} ({result.make} {result.model})</p>
                  </div>
                  <div>
                    <span className="text-ink-soft">Capacity & Accuracy:</span>
                    <p className="font-bold text-ink">{result.capacity}</p>
                  </div>
                  <div>
                    <span className="text-ink-soft">Anti-Tamper Seal No.:</span>
                    <p className="font-mono font-bold text-ink">{result.seal_number}</p>
                  </div>
                </div>

                <div className="space-y-3 rounded-2xl bg-surface p-4 text-xs">
                  <div>
                    <span className="text-ink-soft">Certificate Holder:</span>
                    <p className="font-bold text-ink text-sm">{result.holder_name}</p>
                    <p className="text-ink-soft">{result.business_name}</p>
                  </div>
                  <div>
                    <span className="text-ink-soft">Jurisdiction:</span>
                    <p className="font-bold text-ink">{result.district}, {result.state}</p>
                  </div>
                  <div>
                    <span className="text-ink-soft">Verification Date:</span>
                    <p className="font-bold text-ink">{formatDate(result.issue_date)}</p>
                  </div>
                  <div>
                    <span className="text-ink-soft">Valid Until:</span>
                    <p className="font-bold text-ink">{formatDate(result.expiry_date)} ({daysLeft > 0 ? `${daysLeft} days remaining` : 'Expired'})</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <p className="text-xs text-ink-soft font-mono truncate max-w-sm">
                  Token: {result.token}
                </p>
                <Link
                  to={`/certificate/${result.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-xs font-bold text-white transition hover:bg-primary"
                >
                  <FileCheck2 size={14} /> View Form VI Certificate <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
