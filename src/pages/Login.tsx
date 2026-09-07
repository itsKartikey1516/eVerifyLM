import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Scale,
  ShieldCheck,
  Check,
  UserRound,
  SearchCheck,
  Building2,
  LockKeyhole,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../lib/i18n';
import { GovernmentBar } from '../components/PublicChrome';
import { UserRole } from '../types';

export function Login() {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const navigate = useNavigate();
  const { user, switchDemoRole } = useAuth();
  const { t } = useI18n();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const demoAccounts = [
    {
      role: 'citizen' as UserRole,
      label: 'Citizen / Trader',
      desc: 'Shop owner — Kumar Trading Co.',
      icon: UserRound
    },
    {
      role: 'lmo' as UserRole,
      label: 'Legal Metrology Officer',
      desc: 'Inspector — Pune Zone II',
      icon: SearchCheck
    },
    {
      role: 'gatc' as UserRole,
      label: 'Govt. Approved Test Centre',
      desc: 'Apex Metrology Lab, Mumbai',
      icon: Building2
    },
    {
      role: 'admin' as UserRole,
      label: 'State Administrator',
      desc: 'State Controller Directorate',
      icon: ShieldCheck
    }
  ];

  const handleDemoLogin = async (role: UserRole) => {
    setLoading(true);
    setErrorMsg('');
    try {
      await switchDemoRole(role);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrorMsg('Demo sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (isSignUp && fullName.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setLoading(true);
    try {
      // For standalone demo responsiveness: create mock session
      const role: UserRole = email.includes('admin')
        ? 'admin'
        : email.includes('lmo')
        ? 'lmo'
        : email.includes('gatc')
        ? 'gatc'
        : 'citizen';

      await switchDemoRole(role);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <GovernmentBar />

      <div className="flex flex-1">
        {/* Left Brand Panel */}
        <div className="brand-panel relative hidden w-[44%] flex-col justify-between p-10 text-white lg:flex">
          <Link to="/" className="flex items-center gap-2.5 text-xl font-extrabold">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/15">
              <Scale size={20} />
            </span>
            eVerify LM
          </Link>

          <div>
            <h1 className="max-w-md text-3xl font-extrabold leading-tight">
              The unified portal for legal metrology verification.
            </h1>
            <ul className="mt-6 space-y-3 text-sm text-white/80">
              {[
                'Apply online — fees auto-computed from statutory schedules',
                'Track applications from submission to certification',
                'QR-secured digital certificates, verifiable by anyone',
                'Automatic expiry tracking & re-verification reminders'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300 mt-0.5">
                    <Check size={12} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/50">
            Government of India · Legal Metrology Division
          </p>
        </div>

        {/* Right Form Panel */}
        <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
                {isSignUp ? 'Create your account' : 'Sign in to eVerify LM'}
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                {isSignUp
                  ? 'Register as an instrument owner, trader, or officer'
                  : 'Access verification records, applications & certificates'}
              </p>
            </div>

            {/* Quick Demo Logins */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wide text-primary">
                ⚡ Instant Demo Persona Access
              </span>
              <p className="mt-1 text-xs text-ink-soft">
                Click any role below to explore the portal with preloaded data:
              </p>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {demoAccounts.map((acc) => {
                  const Icon = acc.icon;
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleDemoLogin(acc.role)}
                      disabled={loading}
                      className="flex items-center gap-2.5 rounded-xl border border-slate-200 p-2.5 text-left transition hover:border-primary hover:bg-primary-soft/40 disabled:opacity-50"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-ink">{acc.label}</p>
                        <p className="truncate text-[10px] text-ink-soft">{acc.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="relative text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-surface px-3 text-xs font-bold uppercase text-ink-soft">
                Or continue with email
              </span>
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {errorMsg}
              </div>
            )}
            {infoMsg && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
                {infoMsg}
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Work Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@business.in"
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-50"
              >
                {loading ? 'Please wait…' : isSignUp ? 'Create Account' : 'Sign In'}
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="text-center text-xs text-ink-soft">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="font-bold text-primary hover:underline"
                  >
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="font-bold text-primary hover:underline"
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
