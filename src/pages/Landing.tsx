import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Scale,
  Search,
  ShieldCheck,
  QrCode,
  Smartphone,
  ScrollText,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Award,
  ChevronDown,
  Building2,
  Users,
  BadgeCheck,
  Check
} from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { GovernmentBar, PublicFooter } from '../components/PublicChrome';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { api } from '../lib/supabase';
import { INSTRUMENT_TYPES } from '../lib/constants';

export function Landing() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    certificates_count: 14209,
    instruments_count: 28430,
    applications_count: 16890,
  });
  const [activeRoleTab, setActiveRoleTab] = useState<'citizen' | 'lmo' | 'gatc' | 'admin'>('citizen');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/stats')
      .then((data) => {
        if (data) {
          setStats(prev => ({
            certificates_count: data.certificates_count || prev.certificates_count,
            instruments_count: data.instruments_count || prev.instruments_count,
            applications_count: data.applications_count || prev.applications_count,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/verify?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const roleFeatures = {
    citizen: {
      title: "For Citizens, Traders & Businesses",
      tagline: "Transparent, contactless verification without middlemen.",
      points: [
        "Register all instruments across retail shops, fuel pumps, warehouses & clinics.",
        "Automatic statutory fee calculation based on Legal Metrology Act schedules.",
        "Real-time tracking of verification lifecycle with SMS/email notifications.",
        "Instant tamper-proof digital certificates with verifiable QR codes."
      ],
      ctaText: "Register as Instrument Owner",
      ctaRole: "citizen"
    },
    lmo: {
      title: "For Legal Metrology Officers (LMOs)",
      tagline: "Field inspection scheduling, digital test logs, and on-site cert issuance.",
      points: [
        "Paperless inspection workflow with field GPS and timestamp verification.",
        "Standard test denomination readings with automatic error margin calculation.",
        "Anti-tamper lead seal number recording directly into the national registry.",
        "One-click cryptographic certificate issuance with unique UUID tokens."
      ],
      ctaText: "LMO Portal Sign In",
      ctaRole: "lmo"
    },
    gatc: {
      title: "For Govt. Approved Test Centres (GATCs)",
      tagline: "Accredited laboratory calibration and periodic verification authority.",
      points: [
        "End-to-end management of high-capacity weighbridges, flow meters & storage tanks.",
        "Calibrated test weight tracking and calibration certificate generation.",
        "Seamless sync with State Legal Metrology Directorate databases.",
        "Direct issuance of Form VI verification certificates."
      ],
      ctaText: "GATC Portal Sign In",
      ctaRole: "gatc"
    },
    admin: {
      title: "For State & National Administrators",
      tagline: "Comprehensive oversight, role-based access control, and complete audit trail.",
      points: [
        "Real-time state and district-level verification heatmaps and analytics.",
        "Instant role assignment (Citizen, Inspector, LMO, GATC, Controller).",
        "Append-only immutable audit trail capturing every inspection, scan and cert.",
        "Automated compliance alerts for expired or unverified commercial devices."
      ],
      ctaText: "Admin Console Sign In",
      ctaRole: "admin"
    }
  };

  const faqs = [
    {
      q: "Who is required to verify weighing and measuring instruments?",
      a: "Under the Legal Metrology Act, 2009, any commercial entity, shopkeeper, hospital, fuel outlet, or manufacturer using weighing or measuring devices in trade, commerce, or public health must undergo periodic verification and stamping by the Legal Metrology Department."
    },
    {
      q: "How does the QR verification work?",
      a: "Every issued digital certificate carries a cryptographically unique 128-bit UUID QR token. Anyone — consumers, enforcement squads, or business partners — can scan the QR using any smartphone camera to check the live validity, seal number, and calibration specs directly against the national database."
    },
    {
      q: "What is the fee schedule for verification?",
      a: "Verification fees are governed by the Legal Metrology (General) Rules, 2011. The portal automatically computes the exact statutory fee based on instrument category, capacity, and number of nozzles/units."
    },
    {
      q: "Can I print the official certificate for display?",
      a: "Yes. All digital certificates conform to the statutory Form VI format with security guilloche styling, national emblem header, and QR code, formatted for high-resolution A4 printing."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <GovernmentBar />

      {/* Hero Section */}
      <div className="hero-wrapper text-white">
        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/30 bg-white/15">
              <Scale size={19} />
            </span>
            eVerify LM
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-white/95 md:flex" aria-label="Main">
            <a href="#features" className="transition hover:opacity-75">{t('nav_features')}</a>
            <a href="#how" className="transition hover:opacity-75">{t('nav_how')}</a>
            <Link to="/registry" className="transition hover:opacity-75">{t('nav_registry')}</Link>
            <Link to="/docs" className="transition hover:opacity-75">{t('nav_docs')}</Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher light />
            <Link
              to="/login"
              className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/20"
            >
              {t('nav_signin')}
            </Link>
          </div>
        </header>

        <div className="relative z-10 mx-auto max-w-5xl px-4 pt-12 pb-24 text-center sm:px-8 sm:pt-20 sm:pb-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold backdrop-blur">
            <ShieldCheck size={14} className="text-emerald-300" />
            Legal Metrology Act, 2009 · National Digital Gateway
          </div>

          <h1 className="mt-6 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-[3.4rem]">
            {t('hero_title')}
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-relaxed text-white/90 sm:text-lg">
            {t('hero_sub')}
          </p>

          {/* Quick Search Widget */}
          <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-xl flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-3.5 text-ink-soft" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Verify Certificate No. or QR UUID (e.g. LM/MH/2026/000734)"
                aria-label="Certificate number or token"
                className="h-12 w-full rounded-xl border border-white/20 bg-white pl-11 pr-4 text-sm text-ink outline-none shadow-lg focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-ink px-6 text-sm font-bold text-white transition hover:bg-primary-dark shadow-lg"
            >
              <QrCode size={16} /> Verify Now
            </button>
          </form>

          {/* Key Metrics */}
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur text-left">
              <p className="text-3xl font-extrabold">{stats.certificates_count.toLocaleString()}+</p>
              <p className="mt-1 text-xs font-semibold text-white/80">{t('stat_certs')}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur text-left">
              <p className="text-3xl font-extrabold">{stats.instruments_count.toLocaleString()}+</p>
              <p className="mt-1 text-xs font-semibold text-white/80">{t('stat_inst')}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur text-left">
              <p className="text-3xl font-extrabold">{stats.applications_count.toLocaleString()}+</p>
              <p className="mt-1 text-xs font-semibold text-white/80">{t('stat_apps')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Key Capabilities</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t('features_title')}
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <QrCode size={24} />
            </div>
            <h3 className="mt-4 text-lg font-bold">QR Cryptographic Seals</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Every digital certificate is stamped with a unique 128-bit UUID token verifiable instantly via any smartphone camera.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Scale size={24} />
            </div>
            <h3 className="mt-4 text-lg font-bold">12+ Instrument Categories</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Pre-configured statutory fee schedules for weighbridges, fuel dispensers, retail balances, bulk meters and weights.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Smartphone size={24} />
            </div>
            <h3 className="mt-4 text-lg font-bold">Field Officer App</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              LMOs and GATCs record denomination readings, maximum permissible errors, and anti-tamper seal numbers on location.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <ScrollText size={24} />
            </div>
            <h3 className="mt-4 text-lg font-bold">Immutable Audit Logs</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Append-only audit trail logging every inspection, role modification, certificate issuance, and public QR lookup.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BadgeCheck size={24} />
            </div>
            <h3 className="mt-4 text-lg font-bold">National Registry</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Publicly searchable database of all active, expiring, and revoked certificates across 28 States and 8 Union Territories.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <FileText size={24} />
            </div>
            <h3 className="mt-4 text-lg font-bold">Printable Form VI Certificate</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Statutory verification certificates formatted with guilloche borders, national emblem, and QR codes for high-res printing.
            </p>
          </div>
        </div>
      </section>

      {/* 4-Step Workflow */}
      <section id="how" className="bg-surface py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Process Flow</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t('how_title')}
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-white">
                1
              </div>
              <h3 className="mt-4 font-bold">Register Instrument</h3>
              <p className="mt-1 text-xs text-ink-soft">
                Add make, model, capacity, and GPS coordinates of your weighing device.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-white">
                2
              </div>
              <h3 className="mt-4 font-bold">Apply & Compute Fee</h3>
              <p className="mt-1 text-xs text-ink-soft">
                Choose verification type; fee is auto-computed by statutory schedule.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-white">
                3
              </div>
              <h3 className="mt-4 font-bold">LMO Field Inspection</h3>
              <p className="mt-1 text-xs text-ink-soft">
                Officer inspects standard readings, affixes lead seal, and records pass result.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-white">
                4
              </div>
              <h3 className="mt-4 font-bold">Digital Certificate & QR</h3>
              <p className="mt-1 text-xs text-ink-soft">
                Instant digital certificate generated with verifiable QR token and validity period.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholders Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Multi-Role Support</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t('roles_title')}
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {(['citizen', 'lmo', 'gatc', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setActiveRoleTab(r)}
              className={`rounded-xl px-5 py-2.5 text-sm font-bold uppercase tracking-wide transition ${
                activeRoleTab === r
                  ? 'bg-ink text-white shadow-md'
                  : 'bg-surface text-ink-soft hover:bg-slate-200'
              }`}
            >
              {r === 'citizen' ? 'Citizen / Trader' : r === 'lmo' ? 'LMO Officer' : r === 'gatc' ? 'GATC Lab' : 'State Admin'}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">
                <CheckCircle2 size={13} /> Role Specification
              </span>
              <h3 className="mt-3 text-2xl font-extrabold text-ink">{roleFeatures[activeRoleTab].title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{roleFeatures[activeRoleTab].tagline}</p>

              <ul className="mt-6 space-y-3">
                {roleFeatures[activeRoleTab].points.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-ink font-medium">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5">
                      <Check size={12} />
                    </span>
                    {pt}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  to={`/login?demoRole=${activeRoleTab}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
                >
                  {roleFeatures[activeRoleTab].ctaText} <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-surface p-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-ink-soft">Live Registry Sample Preview</h4>
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-extrabold text-primary">LM/MH/2026/000734</span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                    Valid
                  </span>
                </div>
                <p className="mt-3 text-sm font-bold">Electronic Weighbridge (above 10 t)</p>
                <p className="text-xs text-ink-soft">Kumar Trading Co. & Agro Mills · Pune, Maharashtra</p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-ink-soft font-mono">
                  <span>Seal: MH-LM-PUN-2026-9042</span>
                  <span>Exp: 17 Aug 2027</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Support</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight">{t('faq_title')}</h2>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-ink hover:text-primary"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="border-t border-slate-100 px-5 pb-5 pt-3 text-sm leading-relaxed text-ink-soft">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="brand-panel py-16 text-white text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-8">
          <h2 className="text-3xl font-extrabold sm:text-4xl">{t('cta_ready')}</h2>
          <p className="mt-3 text-sm text-white/80">
            Join thousands of traders, legal metrology officers and testing laboratories on India's unified portal.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/login?mode=signup"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-ink transition hover:bg-slate-100"
            >
              {t('cta_apply')}
            </Link>
            <Link
              to="/verify"
              className="rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
            >
              {t('cta_verify')}
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
