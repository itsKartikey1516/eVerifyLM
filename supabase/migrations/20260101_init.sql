-- ==============================================================================
-- eVerify LM — National Legal Metrology Verification Portal
-- Complete PostgreSQL & Supabase Database Setup & Schema
-- Based on Legal Metrology Act, 2009 & Legal Metrology Rules, 2011
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Role-Based Access Control)
CREATE TABLE IF NOT EXISTS profiles (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  full_name     TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'citizen', -- citizen | lmo | gatc | admin
  phone         TEXT,
  organization  TEXT,
  district      TEXT,
  state         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- 2. INSTRUMENTS TABLE
CREATE TABLE IF NOT EXISTS instruments (
  id              SERIAL PRIMARY KEY,
  owner_email     TEXT NOT NULL REFERENCES profiles(email) ON UPDATE CASCADE,
  owner_name      TEXT,
  business_name   TEXT,
  instrument_type TEXT NOT NULL, -- weighbridge | platform_scale | fuel_dispenser | ...
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

-- 3. APPLICATIONS TABLE (Workflow State Machine)
CREATE TABLE IF NOT EXISTS applications (
  id               SERIAL PRIMARY KEY,
  app_number       TEXT UNIQUE NOT NULL, -- e.g. LMV/2026/10234
  instrument_id    INTEGER REFERENCES instruments(id) ON DELETE CASCADE,
  instrument_type  TEXT,
  instrument_label TEXT,
  serial_number    TEXT,
  business_name    TEXT,
  applicant_email  TEXT NOT NULL,
  applicant_name   TEXT,
  application_type TEXT NOT NULL, -- new_verification | re_verification | repair_reverification
  status           TEXT NOT NULL DEFAULT 'submitted', -- submitted -> under_review -> scheduled -> inspected -> certified | rejected
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

-- 4. INSPECTIONS TABLE
CREATE TABLE IF NOT EXISTS inspections (
  id              SERIAL PRIMARY KEY,
  application_id  INTEGER REFERENCES applications(id) ON DELETE CASCADE,
  officer_email   TEXT,
  officer_name    TEXT,
  inspection_date TEXT,
  readings        JSONB, -- array of {denomination, indicated, error}
  result          TEXT NOT NULL, -- pass | fail
  seal_number     TEXT,
  remarks         TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- 5. CERTIFICATES TABLE (Form VI with QR tokens)
CREATE TABLE IF NOT EXISTS certificates (
  id               SERIAL PRIMARY KEY,
  cert_number      TEXT UNIQUE NOT NULL, -- e.g. LM/MH/2026/000734
  token            TEXT UNIQUE NOT NULL, -- UUID in the QR code
  application_id   INTEGER REFERENCES applications(id) ON DELETE SET NULL,
  instrument_id    INTEGER REFERENCES instruments(id) ON DELETE SET NULL,
  holder_email     TEXT,
  holder_name      TEXT,
  business_name    TEXT,
  instrument_label TEXT,
  serial_number    TEXT,
  make             TEXT,
  model            TEXT,
  capacity         TEXT,
  seal_number      TEXT,
  issue_date       TEXT NOT NULL,
  expiry_date      TEXT NOT NULL,
  issued_by_name   TEXT,
  district         TEXT,
  state            TEXT,
  status           TEXT NOT NULL DEFAULT 'valid', -- valid | revoked
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- 6. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id          SERIAL PRIMARY KEY,
  user_email  TEXT,
  target_role TEXT,
  title       TEXT NOT NULL,
  message     TEXT,
  kind        TEXT,
  read        BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 7. AUDIT LOGS TABLE (Append-only immutable record)
CREATE TABLE IF NOT EXISTS audit_logs (
  id          SERIAL PRIMARY KEY,
  actor_email TEXT,
  actor_name  TEXT,
  action      TEXT NOT NULL,
  entity      TEXT,
  entity_id   TEXT,
  details     JSONB,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_apps_status    ON applications(status);
CREATE INDEX IF NOT EXISTS idx_certs_token    ON certificates(token);
CREATE INDEX IF NOT EXISTS idx_certs_expiry   ON certificates(expiry_date);
CREATE INDEX IF NOT EXISTS idx_certs_holder   ON certificates(holder_email);
CREATE INDEX IF NOT EXISTS idx_audit_created  ON audit_logs(created_at DESC);

-- ==============================================================================
-- SEED DATA BOOTSTRAP
-- ==============================================================================

INSERT INTO profiles (id, email, full_name, role, phone, organization, district, state) VALUES
(1, 'citizen@demo.in', 'Rajesh Kumar', 'citizen', '+91 98765 43210', 'Kumar Trading Co. & Agro Mills', 'Pune', 'Maharashtra'),
(2, 'lmo@demo.in', 'Suresh Patil (LMO)', 'lmo', '+91 94230 11223', 'Legal Metrology Department, Pune Zone II', 'Pune', 'Maharashtra'),
(3, 'gatc@demo.in', 'Dr. Ananya Roy (GATC)', 'gatc', '+91 98200 55443', 'Apex Standard Metrology Testing Lab', 'Mumbai', 'Maharashtra'),
(4, 'admin@demo.in', 'Vikramaditya Deshmukh (IAS)', 'admin', '+91 99887 76655', 'Directorate of Legal Metrology', 'Mumbai', 'Maharashtra')
ON CONFLICT (email) DO NOTHING;

INSERT INTO instruments (id, owner_email, owner_name, business_name, instrument_type, type_label, make, model, serial_number, capacity, accuracy_class, address, district, state, latitude, longitude) VALUES
(1, 'citizen@demo.in', 'Rajesh Kumar', 'Kumar Trading Co. & Agro Mills', 'weighbridge', 'Electronic Weighbridge (above 10 t)', 'Avery India', 'E-1205 Pitless 50T', 'AV-50T-2024-8891', '50,000 kg (e=10 kg)', 'Class III (Medium)', 'Plot 42, MIDC Bhosari Industrial Area', 'Pune', 'Maharashtra', 18.6278, 73.8344),
(2, 'citizen@demo.in', 'Rajesh Kumar', 'Kumar Trading Co. Retail Outlet', 'counter_scale', 'Counter / Table Scale', 'Essae-Teraoka', 'DS-215N Retail Scale', 'ES-30KG-9923', '30 kg (e=2 g)', 'Class III', 'Shop 14, Market Yard, Gultekdi', 'Pune', 'Maharashtra', 18.4965, 73.8687)
ON CONFLICT (id) DO NOTHING;

INSERT INTO certificates (id, cert_number, token, holder_email, holder_name, business_name, instrument_label, serial_number, make, model, capacity, seal_number, issue_date, expiry_date, issued_by_name, district, state, status) VALUES
(1, 'LM/MH/2026/000734', '8a7d2c14-5e99-4c22-b06f-998811223344', 'citizen@demo.in', 'Rajesh Kumar', 'Kumar Trading Co. & Agro Mills', 'Electronic Weighbridge (above 10 t)', 'AV-50T-2024-8891', 'Avery India', 'E-1205 Pitless 50T', '50,000 kg (e=10 kg)', 'MH-LM-PUN-2026-9042', '2026-08-18', '2027-08-17', 'Suresh Patil, Legal Metrology Officer', 'Pune', 'Maharashtra', 'valid')
ON CONFLICT (id) DO NOTHING;
