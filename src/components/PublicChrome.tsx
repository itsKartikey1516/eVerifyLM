import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Scale, ShieldCheck, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../lib/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

export function GovernmentBar() {
  return (
    <div>
      <div className="tricolor h-1" />
      <div className="bg-ink px-4 py-1.5 text-[11px] font-medium text-white/85 sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <span>भारत सरकार · Government of India — Ministry of Consumer Affairs, Food & Public Distribution</span>
          <span className="hidden items-center gap-1 sm:flex">
            <ShieldCheck size={12} className="text-igreen" /> Secure e-Governance Portal
          </span>
        </div>
      </div>
    </div>
  );
}

export function PublicHeader() {
  const { user } = useAuth();
  const { t } = useI18n();

  const navLinks = [
    { to: '/registry', label: t('nav_registry') },
    { to: '/verify', label: t('nav_verify') },
    { to: '/docs', label: t('nav_docs') },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <Scale size={19} />
          </span>
          <span>
            eVerify <span className="text-primary">LM</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Public navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-semibold transition ${
                  isActive ? 'text-primary' : 'text-ink-soft hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {user ? (
            <Link
              to="/dashboard"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark"
            >
              {t('my_dashboard')}
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-3 py-2 text-sm font-bold text-ink-soft transition hover:text-ink"
              >
                {t('nav_signin')}
              </Link>
              <Link
                to="/login?mode=signup"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition hover:bg-primary-dark"
              >
                {t('nav_getstarted')}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-lg font-extrabold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Scale size={16} />
              </span>
              eVerify LM
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              National unified digital verification and certification platform under Legal Metrology Act, 2009.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/45">Quick Navigation</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li><Link to="/registry" className="hover:text-white">Public Certificate Registry</Link></li>
              <li><Link to="/verify" className="hover:text-white">Live QR / Certificate Verification</Link></li>
              <li><Link to="/docs" className="hover:text-white">API & System Documentation</Link></li>
              <li><Link to="/login" className="hover:text-white">Citizen & Officer Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/45">Legal & Compliance</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li><Link to="/terms" className="hover:text-white">Terms of Use</Link></li>
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><a href="https://consumeraffairs.nic.in" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-white">Legal Metrology Rules 2011 <ExternalLink size={10} /></a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/45">National Helpdesk</h4>
            <p className="mt-3 text-sm text-white/80">Toll Free: 1800-11-4000 (09:30 - 17:30 IST)</p>
            <p className="mt-1 text-sm text-white/80">Email: helpdesk-everify@nic.in</p>
            <p className="mt-3 text-xs text-white/45">Supported across all 28 States & 8 UTs</p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          © 2026 Legal Metrology Division, Ministry of Consumer Affairs. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
