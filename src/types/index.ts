export type UserRole = 'citizen' | 'lmo' | 'gatc' | 'admin';

export interface Profile {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  organization?: string;
  district?: string;
  state?: string;
  created_at?: string;
}

export interface Instrument {
  id: number;
  owner_email: string;
  owner_name?: string;
  business_name?: string;
  instrument_type: string;
  type_label: string;
  make?: string;
  model?: string;
  serial_number: string;
  capacity?: string;
  accuracy_class?: string;
  address?: string;
  district?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
  created_at?: string;
}

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'scheduled'
  | 'inspected'
  | 'certified'
  | 'rejected';

export type ApplicationType =
  | 'new_verification'
  | 're_verification'
  | 'repair_reverification';

export interface Application {
  id: number;
  app_number: string;
  instrument_id: number;
  instrument_type: string;
  instrument_label: string;
  serial_number: string;
  business_name?: string;
  applicant_email: string;
  applicant_name: string;
  application_type: ApplicationType;
  status: ApplicationStatus;
  fee: number;
  preferred_date?: string;
  scheduled_date?: string;
  assigned_officer_email?: string;
  assigned_officer_name?: string;
  remarks?: string;
  district?: string;
  state?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InspectionReading {
  denomination: string;
  indicated: string;
  error?: string;
}

export interface Inspection {
  id: number;
  application_id: number;
  officer_email?: string;
  officer_name?: string;
  inspection_date?: string;
  readings: InspectionReading[];
  result: 'pass' | 'fail';
  seal_number?: string;
  remarks?: string;
  created_at?: string;
}

export type CertificateStatusDerived = 'valid' | 'expiring' | 'expired' | 'revoked';

export interface Certificate {
  id: number;
  cert_number: string;
  token: string;
  application_id: number;
  instrument_id: number;
  holder_email?: string;
  holder_name?: string;
  business_name?: string;
  instrument_label?: string;
  serial_number?: string;
  make?: string;
  model?: string;
  capacity?: string;
  seal_number?: string;
  issue_date: string;
  expiry_date: string;
  issued_by_name?: string;
  district?: string;
  state?: string;
  status: 'valid' | 'revoked';
  created_at?: string;
}

export interface Notification {
  id: number;
  user_email?: string;
  target_role?: string;
  title: string;
  message?: string;
  kind?: string;
  read: boolean;
  created_at?: string;
}

export interface AuditLog {
  id: number;
  actor_email?: string;
  actor_name?: string;
  action: string;
  entity?: string;
  entity_id?: string;
  details?: Record<string, any>;
  created_at: string;
}
