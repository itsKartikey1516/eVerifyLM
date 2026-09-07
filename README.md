# ⚖️ eVerify LM — National Legal Metrology Verification Portal

> **Unified Online Verification & Digital Certification Platform under the Legal Metrology Act, 2009.**

eVerify LM is a full-stack digital e-governance platform replacing paper-based stamping and verification of commercial weighing and measuring instruments across India. It supports online trader applications, statutory fee auto-computation, field inspector scheduling, digital calibration test logging, and cryptographic QR-secured Form VI verification certificates.

---

## 🌟 Key Features

1. **Multi-Role Workflows (RBAC)**:
   - **Citizen / Trader**: Enrol devices with GPS coordinates, submit verification applications, track live lifecycle, download & print certificates.
   - **Legal Metrology Officer (LMO)**: Schedule field inspections, record standard test denomination errors, input anti-tamper lead seal numbers, issue digital certificates.
   - **Govt. Approved Test Centre (GATC)**: Verify heavy industrial weighbridges, bulk flow meters, and storage tanks.
   - **State Administrator**: Oversight dashboard, user role assignment, system metrics, and append-only immutable audit trail.

2. **12+ Statutory Instrument Categories**:
   - Electronic Weighbridges (above 10 t), Platform Weighing Scales, Counter/Table Scales, Precision Electronic Balances (Class I/II), Fuel Dispensers/MPDs, Bulk Flow Meters, Storage Calibration Tanks, Tank Lorries, Fare Meters, Standard Weight Sets, Hospital Scales, and Length Measures.

3. **QR Cryptographic Security & Live Verification**:
   - Every certificate has a unique 128-bit UUID QR token.
   - Public QR verification page (`/verify` and `/verify/:token`) validates authenticity in real time against the national registry.

4. **Multi-Lingual Localization (i18n)**:
   - Full native localization in **6 languages**: English, हिन्दी (Hindi), বাংলা (Bengali), मराठी (Marathi), தமிழ் (Tamil), and తెలుగు (Telugu).

5. **Print-Ready Statutory Certificate (Form VI)**:
   - Formatted to Schedule XI Form VI standards with security guilloche styling, national emblem, tricolor seal, and officer digital signature block.

6. **Zero-Config Standalone Execution**:
   - Includes built-in in-browser persistence fallback and preloaded seed data for instant testing across all personas without requiring external credentials.

---

## 🗂️ Project File Structure

```
everify-lm/
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI/CD GitHub Actions pipeline
├── public/
│   └── favicon.svg              # Scale emblem SVG icon
├── src/
│   ├── components/              # Reusable UI Chrome & Widgets
│   │   ├── LanguageSwitcher.tsx # Multi-language switcher dropdown
│   │   ├── LocationPicker.tsx   # Interactive OpenStreetMap & GPS picker
│   │   ├── PortalLayout.tsx     # Role-aware dashboard sidebar & topbar
│   │   ├── ProtectedRoute.tsx   # Role guard & session validator
│   │   ├── PublicChrome.tsx     # Government banner, public nav & footer
│   │   ├── Spinner.tsx          # Accessible loading spinner
│   │   └── StatusBadge.tsx      # Color-coded workflow badge
│   ├── contexts/
│   │   └── AuthContext.tsx      # Auth session, demo role switcher
│   ├── lib/
│   │   ├── constants.ts         # Statutory fee schedules, states, roles
│   │   ├── i18n.tsx             # 6-language translation dictionaries
│   │   ├── mockData.ts          # Rich sample datasets for all personas
│   │   └── supabase.ts          # Supabase client + local storage engine
│   ├── pages/                   # Public & Core Views
│   │   ├── dashboard/           # Authenticated Workspace Views
│   │   │   ├── AdminUsers.tsx   # User role assignment & RBAC control
│   │   │   ├── ApplicationDetail.tsx # Workflow stepper & test logs
│   │   │   ├── Applications.tsx # Applications list & fee calculation
│   │   │   ├── AuditLogs.tsx    # Immutable append-only audit trail
│   │   │   ├── Certificates.tsx # Issued certs & revocation engine
│   │   │   ├── DashboardHome.tsx# Role-specific analytics dashboard
│   │   │   ├── Instruments.tsx  # Device registration with GPS picker
│   │   │   └── NotificationsPage.tsx # Re-verification expiry alerts
│   │   ├── CertificateView.tsx  # Printable Form VI Verification Cert
│   │   ├── Docs.tsx             # System architecture & OpenAPI blueprint
│   │   ├── Landing.tsx          # Public gateway with search & stats
│   │   ├── Legal.tsx            # Terms of Use & Privacy Policy
│   │   ├── Login.tsx            # One-click demo personas & email auth
│   │   ├── Registry.tsx         # Public searchable certificate database
│   │   └── VerifyPage.tsx       # Live QR token & cert lookup
│   ├── types/
│   │   └── index.ts             # TypeScript data contracts & interfaces
│   ├── App.tsx                  # React Router routes tree
│   ├── index.css                # Tailwind CSS, guilloche & print styles
│   └── main.tsx                 # React 18 DOM mount point
├── supabase/
│   ├── migrations/
│   │   └── 20260101_init.sql    # Versioned PostgreSQL migration schema
│   └── seed.sql                 # Database bootstrap seed data
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore specifications
├── database_setup.sql           # All-in-one database initialization script
├── GITHUB_SETUP_GUIDE.md        # Comprehensive GitHub push & deploy guide
├── index.html                   # HTML template with Google Fonts
├── package.json                 # Dependencies & build scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript project configuration
├── tsconfig.node.json           # TypeScript build node configuration
└── vite.config.ts               # Vite bundler configuration
```

---

## ⚡ Quick Start (Local Development)

### 1. Clone or Open Workspace
```bash
cd everify-lm
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🗄️ Database Setup (Supabase / PostgreSQL)

### Option 1: Supabase Cloud (Easiest)
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase dashboard.
3. Open `database_setup.sql` from this repository, copy its contents, paste and click **Run**.
4. Copy your **Project URL** and **Anon Key** from **Settings** > **API**.
5. Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Option 2: Local PostgreSQL
Run with `psql`:
```bash
psql -U postgres -d your_database -f database_setup.sql
```

---

## 🚀 Pushing to GitHub

Follow the step-by-step instructions in [GITHUB_SETUP_GUIDE.md](./GITHUB_SETUP_GUIDE.md) or run:

```bash
git init
git branch -M main
git add .
git commit -m "feat: complete eVerify LM full-stack project"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

---

## 📜 Statutory License & Compliance
Built in conformity with the **Legal Metrology Act, 2009** and the **Legal Metrology (General) Rules, 2011**, Ministry of Consumer Affairs, Food & Public Distribution, Government of India.
