import { Profile, Instrument, Application, Inspection, Certificate, Notification, AuditLog } from '../types';

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 1,
    email: 'citizen@demo.in',
    full_name: 'Rajesh Kumar',
    role: 'citizen',
    phone: '+91 98765 43210',
    organization: 'Kumar Trading Co. & Agro Mills',
    district: 'Pune',
    state: 'Maharashtra',
    created_at: '2026-01-10T10:00:00Z'
  },
  {
    id: 2,
    email: 'lmo@demo.in',
    full_name: 'Suresh Patil',
    role: 'lmo',
    phone: '+91 94230 11223',
    organization: 'Legal Metrology Department, Pune Zone II',
    district: 'Pune',
    state: 'Maharashtra',
    created_at: '2026-01-05T09:30:00Z'
  },
  {
    id: 3,
    email: 'gatc@demo.in',
    full_name: 'Dr. Ananya Roy',
    role: 'gatc',
    phone: '+91 98200 55443',
    organization: 'Apex Standard Metrology Testing Lab (GATC-MH-04)',
    district: 'Mumbai',
    state: 'Maharashtra',
    created_at: '2026-01-08T11:15:00Z'
  },
  {
    id: 4,
    email: 'admin@demo.in',
    full_name: 'Vikramaditya Deshmukh (IAS)',
    role: 'admin',
    phone: '+91 99887 76655',
    organization: 'Directorate of Legal Metrology, Maharashtra State',
    district: 'Mumbai',
    state: 'Maharashtra',
    created_at: '2026-01-01T08:00:00Z'
  }
];

export const INITIAL_INSTRUMENTS: Instrument[] = [
  {
    id: 1,
    owner_email: 'citizen@demo.in',
    owner_name: 'Rajesh Kumar',
    business_name: 'Kumar Trading Co. & Agro Mills',
    instrument_type: 'weighbridge',
    type_label: 'Electronic Weighbridge (above 10 t)',
    make: 'Avery India',
    model: 'E-1205 Pitless 50T',
    serial_number: 'AV-50T-2024-8891',
    capacity: '50,000 kg (e=10 kg)',
    accuracy_class: 'Class III (Medium)',
    address: 'Plot 42, MIDC Bhosari Industrial Area',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.6278,
    longitude: 73.8344,
    created_at: '2026-01-15T10:00:00Z'
  },
  {
    id: 2,
    owner_email: 'citizen@demo.in',
    owner_name: 'Rajesh Kumar',
    business_name: 'Kumar Trading Co. Retail Outlet',
    instrument_type: 'counter_scale',
    type_label: 'Counter / Table Scale',
    make: 'Essae-Teraoka',
    model: 'DS-215N Retail Scale',
    serial_number: 'ES-30KG-9923',
    capacity: '30 kg (e=2 g)',
    accuracy_class: 'Class III',
    address: 'Shop 14, Market Yard, Gultekdi',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.4965,
    longitude: 73.8687,
    created_at: '2026-02-01T12:00:00Z'
  },
  {
    id: 3,
    owner_email: 'citizen@demo.in',
    owner_name: 'Rajesh Kumar',
    business_name: 'Bharat Petroleum Highway Hub (Franchisee)',
    instrument_type: 'fuel_dispenser',
    type_label: 'Fuel / Petrol-Diesel Dispenser (per nozzle)',
    make: 'Tokheim / Gilbarco Veeder-Root',
    model: 'Horizon 4-Nozzle MPD',
    serial_number: 'GVR-MPD-2025-0412',
    capacity: '5 to 45 L/min',
    accuracy_class: 'Class 0.5 (Petroleum)',
    address: 'NH-48 Pune-Bengaluru Highway, Khed Shivapur',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.3512,
    longitude: 73.8529,
    created_at: '2026-02-10T14:30:00Z'
  },
  {
    id: 4,
    owner_email: 'citizen@demo.in',
    owner_name: 'Rajesh Kumar',
    business_name: 'Kumar Gold & Precision Lab',
    instrument_type: 'electronic_balance',
    type_label: 'Electronic Balance (Class I / II)',
    make: 'Sartorius',
    model: 'Entris II High-Precision',
    serial_number: 'SAR-220G-4412',
    capacity: '220 g (d=0.1 mg, e=1 mg)',
    accuracy_class: 'Class I (Special)',
    address: 'Laxmi Road, Gold Souk Market',
    district: 'Pune',
    state: 'Maharashtra',
    latitude: 18.5158,
    longitude: 73.8560,
    created_at: '2026-03-01T09:00:00Z'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 1,
    app_number: 'LMV/2026/10234',
    instrument_id: 1,
    instrument_type: 'weighbridge',
    instrument_label: 'Electronic Weighbridge (above 10 t)',
    serial_number: 'AV-50T-2024-8891',
    business_name: 'Kumar Trading Co. & Agro Mills',
    applicant_email: 'citizen@demo.in',
    applicant_name: 'Rajesh Kumar',
    application_type: 're_verification',
    status: 'certified',
    fee: 1500,
    preferred_date: '2026-08-15',
    scheduled_date: '2026-08-18',
    assigned_officer_email: 'lmo@demo.in',
    assigned_officer_name: 'Suresh Patil (LMO)',
    remarks: 'Field verification completed at MIDC premises. All 4 load cells verified with standard weights up to 50 T.',
    district: 'Pune',
    state: 'Maharashtra',
    created_at: '2026-08-10T09:00:00Z',
    updated_at: '2026-08-18T16:30:00Z'
  },
  {
    id: 2,
    app_number: 'LMV/2026/10488',
    instrument_id: 3,
    instrument_type: 'fuel_dispenser',
    instrument_label: 'Fuel / Petrol-Diesel Dispenser (per nozzle)',
    serial_number: 'GVR-MPD-2025-0412',
    business_name: 'Bharat Petroleum Highway Hub',
    applicant_email: 'citizen@demo.in',
    applicant_name: 'Rajesh Kumar',
    application_type: 're_verification',
    status: 'inspected',
    fee: 400,
    preferred_date: '2026-09-02',
    scheduled_date: '2026-09-05',
    assigned_officer_email: 'lmo@demo.in',
    assigned_officer_name: 'Suresh Patil (LMO)',
    remarks: 'Volumetric test done with 5L and 20L proving measures. Delivery errors within +/- 0.1%. Ready for certificate issuance.',
    district: 'Pune',
    state: 'Maharashtra',
    created_at: '2026-08-28T11:20:00Z',
    updated_at: '2026-09-05T15:00:00Z'
  },
  {
    id: 3,
    app_number: 'LMV/2026/10521',
    instrument_id: 2,
    instrument_type: 'counter_scale',
    instrument_label: 'Counter / Table Scale',
    serial_number: 'ES-30KG-9923',
    business_name: 'Kumar Trading Co. Retail Outlet',
    applicant_email: 'citizen@demo.in',
    applicant_name: 'Rajesh Kumar',
    application_type: 're_verification',
    status: 'scheduled',
    fee: 50,
    preferred_date: '2026-09-12',
    scheduled_date: '2026-09-15',
    assigned_officer_email: 'lmo@demo.in',
    assigned_officer_name: 'Suresh Patil (LMO)',
    remarks: 'Inspection scheduled for morning shift.',
    district: 'Pune',
    state: 'Maharashtra',
    created_at: '2026-09-01T14:10:00Z',
    updated_at: '2026-09-03T10:00:00Z'
  },
  {
    id: 4,
    app_number: 'LMV/2026/10577',
    instrument_id: 4,
    instrument_type: 'electronic_balance',
    instrument_label: 'Electronic Balance (Class I / II)',
    serial_number: 'SAR-220G-4412',
    business_name: 'Kumar Gold & Precision Lab',
    applicant_email: 'citizen@demo.in',
    applicant_name: 'Rajesh Kumar',
    application_type: 'new_verification',
    status: 'submitted',
    fee: 150,
    preferred_date: '2026-09-20',
    district: 'Pune',
    state: 'Maharashtra',
    created_at: '2026-09-06T16:45:00Z',
    updated_at: '2026-09-06T16:45:00Z'
  }
];

export const INITIAL_INSPECTIONS: Inspection[] = [
  {
    id: 1,
    application_id: 1,
    officer_email: 'lmo@demo.in',
    officer_name: 'Suresh Patil (LMO)',
    inspection_date: '2026-08-18',
    readings: [
      { denomination: '10,000 kg', indicated: '10,000 kg', error: '0.0 kg (0.00%)' },
      { denomination: '25,000 kg', indicated: '25,005 kg', error: '+5.0 kg (+0.02%)' },
      { denomination: '50,000 kg', indicated: '49,990 kg', error: '-10.0 kg (-0.02%)' }
    ],
    result: 'pass',
    seal_number: 'MH-LM-PUN-2026-9042',
    remarks: 'Weighbridge calibrated and stamped. Corner loads and shift tests within permissible maximum error limits.',
    created_at: '2026-08-18T16:00:00Z'
  },
  {
    id: 2,
    application_id: 2,
    officer_email: 'lmo@demo.in',
    officer_name: 'Suresh Patil (LMO)',
    inspection_date: '2026-09-05',
    readings: [
      { denomination: '5 Litres (MS)', indicated: '5.002 L', error: '+2 mL (+0.04%)' },
      { denomination: '20 Litres (HSD)', indicated: '19.995 L', error: '-5 mL (-0.025%)' }
    ],
    result: 'pass',
    seal_number: 'MH-LM-PUN-2026-9118',
    remarks: 'Totaliser and metering unit inspected. Anti-tamper lead seal affixed to calibrating knob.',
    created_at: '2026-09-05T14:45:00Z'
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 1,
    cert_number: 'LM/MH/2026/000734',
    token: '8a7d2c14-5e99-4c22-b06f-998811223344',
    application_id: 1,
    instrument_id: 1,
    holder_email: 'citizen@demo.in',
    holder_name: 'Rajesh Kumar',
    business_name: 'Kumar Trading Co. & Agro Mills',
    instrument_label: 'Electronic Weighbridge (above 10 t)',
    serial_number: 'AV-50T-2024-8891',
    make: 'Avery India',
    model: 'E-1205 Pitless 50T',
    capacity: '50,000 kg (e=10 kg)',
    seal_number: 'MH-LM-PUN-2026-9042',
    issue_date: '2026-08-18',
    expiry_date: '2027-08-17',
    issued_by_name: 'Suresh Patil, Legal Metrology Officer (Pune Zone II)',
    district: 'Pune',
    state: 'Maharashtra',
    status: 'valid',
    created_at: '2026-08-18T16:30:00Z'
  },
  {
    id: 2,
    cert_number: 'LM/MH/2025/009182',
    token: '3f2b1a09-7d88-4e11-9a4c-112233445566',
    application_id: 99,
    instrument_id: 2,
    holder_email: 'citizen@demo.in',
    holder_name: 'Rajesh Kumar',
    business_name: 'Kumar Trading Co. Retail Outlet',
    instrument_label: 'Counter / Table Scale',
    serial_number: 'ES-30KG-9923',
    make: 'Essae-Teraoka',
    model: 'DS-215N Retail Scale',
    capacity: '30 kg (e=2 g)',
    seal_number: 'MH-LM-PUN-2025-4190',
    issue_date: '2025-09-18',
    expiry_date: '2026-09-17',
    issued_by_name: 'Suresh Patil, Legal Metrology Officer',
    district: 'Pune',
    state: 'Maharashtra',
    status: 'valid',
    created_at: '2025-09-18T11:00:00Z'
  },
  {
    id: 3,
    cert_number: 'LM/KA/2026/001209',
    token: '7c4e5f6a-1b2c-3d4e-5f6a-7b8c9d0e1f2a',
    application_id: 98,
    instrument_id: 98,
    holder_email: 'metro.supermarket@karnataka.org',
    holder_name: 'Metro Hypermarket Pvt Ltd',
    business_name: 'Metro Hypermarket Indiranagar',
    instrument_label: 'Platform Weighing Scale',
    serial_number: 'CAS-PF-300-8812',
    make: 'CAS Korea',
    model: 'DB-II 300kg',
    capacity: '300 kg (e=50 g)',
    seal_number: 'KA-LM-BLR-2026-1049',
    issue_date: '2026-05-10',
    expiry_date: '2027-05-09',
    issued_by_name: 'R. K. Gowda, Senior Inspector (Bengaluru Urban)',
    district: 'Bengaluru',
    state: 'Karnataka',
    status: 'valid',
    created_at: '2026-05-10T14:20:00Z'
  },
  {
    id: 4,
    cert_number: 'LM/DL/2024/008821',
    token: '2e1d0c9b-8a7f-6e5d-4c3b-2a1f0e9d8c7b',
    application_id: 97,
    instrument_id: 97,
    holder_email: 'delhi.logistics@north.in',
    holder_name: 'North-Star Logistics Hub',
    business_name: 'North-Star Cargo Terminal Delhi',
    instrument_label: 'Bulk Flow Meter',
    serial_number: 'EMR-BFM-2023-7741',
    make: 'Emerson Micro Motion',
    model: 'CMFS Coriolis Flow Meter',
    capacity: '2000 L/min',
    seal_number: 'DL-LM-NZ-2024-5510',
    issue_date: '2024-06-01',
    expiry_date: '2025-05-31',
    issued_by_name: 'Sunil Sharma, Legal Metrology Officer',
    district: 'Delhi',
    state: 'Delhi',
    status: 'valid',
    created_at: '2024-06-01T10:00:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    user_email: 'citizen@demo.in',
    title: 'Certificate Issued · LMV/2026/10234',
    message: 'Your Electronic Weighbridge verification is complete. Digital Certificate LM/MH/2026/000734 has been generated and QR code is active.',
    kind: 'certificate',
    read: false,
    created_at: '2026-08-18T16:30:00Z'
  },
  {
    id: 2,
    user_email: 'citizen@demo.in',
    title: 'Upcoming Expiry · Certificate LM/MH/2025/009182',
    message: 'Your Counter Scale certificate expires in 10 days (17 Sep 2026). Please apply for periodic re-verification to remain compliant.',
    kind: 'expiry_alert',
    read: false,
    created_at: '2026-09-01T06:00:00Z'
  },
  {
    id: 3,
    user_email: 'citizen@demo.in',
    title: 'Inspection Scheduled · LMV/2026/10521',
    message: 'Officer Suresh Patil has scheduled physical inspection for your Counter Scale on 15 Sep 2026.',
    kind: 'schedule',
    read: true,
    created_at: '2026-09-03T10:00:00Z'
  },
  {
    id: 4,
    target_role: 'lmo',
    title: 'New Verification Application Received',
    message: 'Application LMV/2026/10577 submitted by Kumar Gold & Precision Lab for Electronic Balance.',
    kind: 'new_application',
    read: false,
    created_at: '2026-09-06T16:45:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 1,
    actor_email: 'lmo@demo.in',
    actor_name: 'Suresh Patil (LMO)',
    action: 'certificate_issued',
    entity: 'certificate',
    entity_id: 'LM/MH/2026/000734',
    details: { app_number: 'LMV/2026/10234', instrument_serial: 'AV-50T-2024-8891', seal_number: 'MH-LM-PUN-2026-9042' },
    created_at: '2026-08-18T16:30:00Z'
  },
  {
    id: 2,
    actor_email: 'lmo@demo.in',
    actor_name: 'Suresh Patil (LMO)',
    action: 'inspection_recorded',
    entity: 'application',
    entity_id: 'LMV/2026/10234',
    details: { outcome: 'pass', readings_count: 3, seal: 'MH-LM-PUN-2026-9042' },
    created_at: '2026-08-18T16:00:00Z'
  },
  {
    id: 3,
    actor_email: 'lmo@demo.in',
    actor_name: 'Suresh Patil (LMO)',
    action: 'inspection_recorded',
    entity: 'application',
    entity_id: 'LMV/2026/10488',
    details: { outcome: 'pass', readings_count: 2, seal: 'MH-LM-PUN-2026-9118' },
    created_at: '2026-09-05T14:45:00Z'
  },
  {
    id: 4,
    actor_email: 'system',
    actor_name: 'Public QR Scanner',
    action: 'public_qr_verified',
    entity: 'certificate',
    entity_id: '8a7d2c14-5e99-4c22-b06f-998811223344',
    details: { cert_number: 'LM/MH/2026/000734', status: 'valid', verified_via: 'web_portal' },
    created_at: '2026-09-07T08:14:22Z'
  },
  {
    id: 5,
    actor_email: 'admin@demo.in',
    actor_name: 'Vikramaditya Deshmukh',
    action: 'user_role_assigned',
    entity: 'profile',
    entity_id: 'lmo@demo.in',
    details: { role_assigned: 'lmo', district: 'Pune' },
    created_at: '2026-01-05T10:00:00Z'
  }
];
