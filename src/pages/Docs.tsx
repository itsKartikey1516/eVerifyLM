import React, { useState } from 'react';
import { BookOpen, Layers, Database, Globe, Code, Shield, Server, CheckSquare, Sparkles } from 'lucide-react';
import { GovernmentBar, PublicHeader, PublicFooter } from '../components/PublicChrome';

export function Docs() {
  const [activeSection, setActiveSection] = useState('architecture');

  const sections = [
    {
      id: 'architecture',
      num: '01',
      title: 'High-Level Architecture',
      icon: Layers,
      intro: 'Three client surfaces (Web SPA, Field Inspector Mobile App, Public QR Scanners) communicate with a versioned REST API over TLS 1.3 backed by PostgreSQL, Redis, and Object Storage.',
      code: `+------------------------------------------------------------------------------------+
|                                   CLIENT SURFACES                                  |
|  +--------------------+   +--------------------------+   +-----------------------+ |
|  |  Web Portal (SPA)  |   |  Field Mobile App        |   |  Public QR Scanner    | |
|  |  React + TS + Vite |   |  React Native / Expo     |   |  Any Web Browser / Cam| |
|  +---------+----------+   +------------+-------------+   +-----------+-----------+ |
+------------|---------------------------|-----------------------------|-------------+
             |                           |                             |
             +---------------------------+-----------------------------+
                                         | HTTPS (TLS 1.3) + JWT Bearer
                                         v
+------------------------------------------------------------------------------------+
|                              API & APPLICATION SERVICES                            |
|                                                                                    |
|  +------------------+  +-------------------+  +------------------+  +------------+ |
|  | Auth & Profiles  |  | Instrument Engine |  | Workflow State   |  | Inspection | |
|  | (RBAC Guards)    |  | (Geo + Accuracy)  |  | (Apply/Schedule) |  | (Readings) | |
|  +------------------+  +-------------------+  +------------------+  +------------+ |
|                                                                                    |
|  +------------------+  +-------------------+  +------------------+  +------------+ |
|  | Certificate Gen  |  | Notification Hub  |  | Expiry Scheduler |  | Immutable  | |
|  | (QR + Form VI)   |  | (SMS/Email/In-App)|  | (BullMQ Cron)    |  | Audit Log  | |
|  +------------------+  +-------------------+  +------------------+  +------------+ |
+----------------------------------------+-------------------------------------------+
                                         |
     +-----------------------------------+-----------------------------------+
     v                                   v                                   v
+-----------------------+     +-----------------------+     +------------------------+
|  PostgreSQL 16 (DB)   |     |  Redis 7 (Cache/Jobs) |     |  S3 Bucket (PDF Certs) |
|  Profiles, Apps,      |     |  Rate limiting, BullMQ|     |  Form VI PDFs, QR      |
|  Inspections, Logs    |     |  queues, fast verify  |     |  stamps, signatures    |
+-----------------------+     +-----------------------+     +------------------------+`
    },
    {
      id: 'schema',
      num: '02',
      title: 'Database Schema (PostgreSQL)',
      icon: Database,
      intro: 'Seven core relational tables model the full verification lifecycle under Legal Metrology Act, 2009.',
      code: `-- Core Legal Metrology Verification Schema

CREATE TABLE profiles (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  full_name     TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'citizen',   -- citizen | lmo | gatc | admin
  phone         TEXT,
  organization  TEXT,
  district      TEXT,
  state         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE instruments (
  id              SERIAL PRIMARY KEY,
  owner_email     TEXT NOT NULL,
  owner_name      TEXT,
  business_name   TEXT,
  instrument_type TEXT NOT NULL,                   -- weighbridge | fuel_dispenser | ...
  type_label      TEXT NOT NULL,
  make            TEXT,
  model           TEXT,
  serial_number   TEXT NOT NULL,
  capacity        TEXT,
  accuracy_class  TEXT,
  address         TEXT,
  district        TEXT,
  state           TEXT,
  latitude        NUMERIC,
  longitude       NUMERIC,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE applications (
  id               SERIAL PRIMARY KEY,
  app_number       TEXT UNIQUE NOT NULL,           -- e.g. LMV/2026/10234
  instrument_id    INTEGER REFERENCES instruments(id),
  instrument_type  TEXT,
  instrument_label TEXT,
  serial_number    TEXT,
  business_name    TEXT,
  applicant_email  TEXT NOT NULL,
  applicant_name   TEXT,
  application_type TEXT NOT NULL,                  -- new_verification | re_verification
  status           TEXT NOT NULL DEFAULT 'submitted',
  fee              NUMERIC NOT NULL DEFAULT 0,
  preferred_date   TEXT,
  scheduled_date   TEXT,
  assigned_officer_email TEXT,
  assigned_officer_name  TEXT,
  remarks          TEXT,
  district         TEXT,
  state            TEXT,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE inspections (
  id              SERIAL PRIMARY KEY,
  application_id  INTEGER REFERENCES applications(id),
  officer_email   TEXT,
  officer_name    TEXT,
  inspection_date TEXT,
  readings        JSONB,                           -- [{denomination, indicated, error}]
  result          TEXT NOT NULL,                   -- pass | fail
  seal_number     TEXT,
  remarks         TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE certificates (
  id               SERIAL PRIMARY KEY,
  cert_number      TEXT UNIQUE NOT NULL,           -- e.g. LM/MH/2026/000734
  token            TEXT UNIQUE NOT NULL,           -- UUID for QR code verification
  application_id   INTEGER REFERENCES applications(id),
  instrument_id    INTEGER REFERENCES instruments(id),
  holder_email     TEXT,
  holder_name      TEXT,
  business_name    TEXT,
  instrument_label TEXT,
  serial_number    TEXT,
  make TEXT, model TEXT, capacity TEXT,
  seal_number      TEXT,
  issue_date       TEXT NOT NULL,
  expiry_date      TEXT NOT NULL,
  issued_by_name   TEXT,
  district TEXT, state TEXT,
  status           TEXT NOT NULL DEFAULT 'valid',  -- valid | revoked
  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE notifications (
  id          SERIAL PRIMARY KEY,
  user_email  TEXT,
  target_role TEXT,
  title       TEXT NOT NULL,
  message     TEXT,
  kind        TEXT,
  read        BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE audit_logs (                          -- append-only immutable log
  id          SERIAL PRIMARY KEY,
  actor_email TEXT,
  actor_name  TEXT,
  action      TEXT NOT NULL,
  entity      TEXT,
  entity_id   TEXT,
  details     JSONB,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_apps_status    ON applications(status);
CREATE INDEX idx_certs_token    ON certificates(token);
CREATE INDEX idx_certs_expiry   ON certificates(expiry_date);
CREATE INDEX idx_audit_created  ON audit_logs(created_at DESC);`
    },
    {
      id: 'api',
      num: '03',
      title: 'REST API Specification',
      icon: Globe,
      intro: 'RESTful endpoints supporting JWT bearer authentication and public QR verification.',
      code: `BASE PATH: /api  (Production reference: /api/v1)

AUTH & PROFILES
  POST /api/profiles                 Upsert profile on login              (Public)
  GET  /api/profiles?email=          Fetch profile by email               (Auth)
  GET  /api/profiles                 List all system users                (Admin)
  PUT  /api/profiles                 Update user role / org (Audit logged)(Admin)

INSTRUMENTS
  GET  /api/instruments?owner_email= Fetch my registered instruments      (Citizen)
  GET  /api/instruments              List all state instruments           (Admin)
  POST /api/instruments              Register new weighing/measuring unit (Citizen)

APPLICATIONS (Workflow State Machine)
  POST /api/applications             Submit verification request          (Citizen)
  GET  /api/applications?applicant=  Fetch citizen applications           (Citizen)
  GET  /api/applications             Fetch officer verification queue     (LMO/GATC/Admin)
  GET  /api/applications?id=         Fetch application lifecycle details  (Auth)
  PUT  /api/applications             Schedule / review / reject           (LMO/Admin)

INSPECTIONS
  POST /api/inspections              Record test readings & seal number   (LMO/GATC)
  GET  /api/inspections?application= Fetch inspection history for app     (Auth)

CERTIFICATES & VERIFICATION
  POST /api/certificates             Generate Form VI Cert + QR Token     (LMO/GATC)
  GET  /api/certificates?holder=     Fetch citizen certificates           (Citizen)
  GET  /api/certificates?search=     Public registry search query         (Public)
  GET  /api/certificates?id=         Fetch full certificate metadata      (Public)
  GET  /api/verify?token= | ?cert_no= Public real-time QR lookup          (Public)
  PUT  /api/certificates             Revoke certificate (with reason)     (Admin/LMO)

AUDIT & STATS
  GET  /api/audit                    Fetch immutable audit trail          (Admin)
  GET  /api/stats                    Fetch aggregate national metrics     (Public)
  GET  /api/notifications?email=     Fetch in-app reminders & updates     (Auth)
  PUT  /api/notifications            Mark notification as read            (Auth)`
    },
    {
      id: 'security',
      num: '04',
      title: 'Security & Compliance',
      icon: Shield,
      intro: 'Compliance architecture adhering to CERT-In guidelines, Digital Personal Data Protection (DPDP) Act 2023, and Legal Metrology Act 2009.',
      code: `1. CRYPTOGRAPHIC SEALS
   - Each certificate is sealed with a 128-bit UUID QR token.
   - Seals are linked to physical anti-tamper lead seal numbers stamped on the instrument.

2. ROLE-BASED ACCESS CONTROL (RBAC)
   - Strict separation between Citizen, Inspector (LMO), Test Centre (GATC), and State Admin.
   - All state modifications require validated actor identities.

3. IMMUTABLE AUDIT TRAIL
   - Append-only audit logging: certificates issued, inspections recorded, roles changed, QR looked up.
   - Cannot be modified or deleted by any user or administrator.

4. DATA RESIDENCY & SOVEREIGNTY
   - Hosted on MeitY-empanelled cloud infrastructure located in India.
   - TLS 1.3 encryption in transit, AES-256 encryption at rest.`
    }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <GovernmentBar />
      <PublicHeader />

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-8">
        {/* Sidebar */}
        <aside className="sticky top-24 hidden h-fit w-64 shrink-0 lg:block">
          <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-ink-soft">
            <BookOpen size={14} /> Solution Blueprint
          </p>
          <nav className="mt-3 space-y-1" aria-label="Documentation sections">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  activeSection === s.id
                    ? 'bg-primary text-white'
                    : 'text-ink-soft hover:bg-white hover:text-ink'
                }`}
              >
                <span>{s.title}</span>
                <span className="font-mono text-[10px] opacity-60">{s.num}</span>
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">
            System Documentation
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Complete technical blueprint for the online verification & digital certification portal under Legal Metrology Act, 2009.
          </p>

          <div className="mt-8 space-y-10">
            {sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="scroll-mt-24">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-extrabold text-primary">{sec.num}</span>
                  <h2 className="text-xl font-extrabold text-ink">{sec.title}</h2>
                </div>
                <p className="mt-2 text-sm text-ink-soft">{sec.intro}</p>

                <div className="mt-4">
                  <pre className="codeblock">{sec.code}</pre>
                </div>
              </section>
            ))}
          </div>
        </main>
      </div>

      <PublicFooter />
    </div>
  );
}
