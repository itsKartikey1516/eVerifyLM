import React from 'react';
import { useLocation } from 'react-router-dom';
import { GovernmentBar, PublicHeader, PublicFooter } from '../components/PublicChrome';

export function Legal() {
  const location = useLocation();
  const isPrivacy = location.pathname.includes('privacy');

  const content = isPrivacy
    ? [
        ['1. Information We Collect', 'We collect business entity details, user email, phone number, premises address, instrument technical specifications (make, model, serial number, capacity, GPS coordinates), and test calibration logs necessary for statutory compliance under the Legal Metrology Act, 2009.'],
        ['2. Use of Data', 'Data is used strictly to process verification applications, schedule field inspections, issue verifiable digital certificates, send periodic expiry alerts, and maintain the national public registry.'],
        ['3. Public Registry Scope', 'In accordance with consumer protection provisions, certificate verification status, instrument type, serial number, and validity dates are publicly queryable via QR code lookup. Confidential commercial data is protected.'],
        ['4. Data Security & Storage', 'All records are encrypted in transit via TLS 1.3 and stored in compliance with Indian IT Act and DPDP Act 2023 guidelines on sovereign Indian servers.']
      ]
    : [
        ['1. Statutory Basis', 'This portal operates under the authority of the Legal Metrology Act, 2009 (Act No. 1 of 2010) and the Legal Metrology (General) Rules, 2011. All verification certificates issued have full legal standing.'],
        ['2. Duty of Verification', 'Every user of a weight or measure in any commercial transaction is required by law to present their instrument for periodic re-verification before the expiry of the previous verification certificate.'],
        ['3. Tampering & Penalties', 'Tampering with digital certificates, physical verification seals, or stamping marks constitutes an offence under Section 24 and Section 27 of the Legal Metrology Act, 2009, punishable with fines and imprisonment.'],
        ['4. Digital Certificates (Form VI)', 'Digital certificates issued through this system bearing official QR cryptographic tokens are admissible as electronic records under the Indian Evidence Act, 1872 and the Information Technology Act, 2000.']
      ];

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <GovernmentBar />
      <PublicHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">
          {isPrivacy ? 'Privacy Policy' : 'Terms of Use'}
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Last updated: 01 September 2026 · eVerify LM Unified Portal
        </p>

        <div className="mt-8 space-y-5">
          {content.map(([title, body]) => (
            <section key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-extrabold text-ink">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
            </section>
          ))}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
