import { Certificate, CertificateStatusDerived, UserRole } from '../types';

export interface InstrumentTypeInfo {
  value: string;
  label: string;
  fee: number;
  validity: number; // in months
}

export const INSTRUMENT_TYPES: InstrumentTypeInfo[] = [
  { value: "weighbridge", label: "Electronic Weighbridge (above 10 t)", fee: 1500, validity: 12 },
  { value: "platform_scale", label: "Platform Weighing Scale", fee: 200, validity: 12 },
  { value: "counter_scale", label: "Counter / Table Scale", fee: 50, validity: 12 },
  { value: "electronic_balance", label: "Electronic Balance (Class I / II)", fee: 150, validity: 12 },
  { value: "fuel_dispenser", label: "Fuel / Petrol-Diesel Dispenser (per nozzle)", fee: 100, validity: 12 },
  { value: "flow_meter", label: "Bulk Flow Meter", fee: 500, validity: 12 },
  { value: "storage_tank", label: "Storage Tank (calibration)", fee: 2000, validity: 24 },
  { value: "tank_lorry", label: "Tank Lorry / Vehicle Tank", fee: 400, validity: 24 },
  { value: "fare_meter", label: "Taxi / Auto-rickshaw Fare Meter", fee: 100, validity: 12 },
  { value: "weights_set", label: "Standard Weights (per set)", fee: 20, validity: 24 },
  { value: "person_scale", label: "Person Weighing Scale (hospital / clinic)", fee: 50, validity: 12 },
  { value: "length_measure", label: "Length Measure / Measuring Tape", fee: 20, validity: 24 }
];

export const VERIFICATION_TYPES = [
  { value: "new_verification", label: "Initial Verification (new instrument)" },
  { value: "re_verification", label: "Periodic Re-verification" },
  { value: "repair_reverification", label: "Re-verification after Repair" }
];

export const APPLICATION_STATUSES: Record<string, { label: string; badge: string; dot: string }> = {
  submitted: { label: "Submitted", badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  under_review: { label: "Under Review", badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  scheduled: { label: "Scheduled", badge: "bg-violet-50 text-violet-700 border-violet-200", dot: "bg-violet-500" },
  inspected: { label: "Inspected", badge: "bg-cyan-50 text-cyan-700 border-cyan-200", dot: "bg-cyan-500" },
  certified: { label: "Certified", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  rejected: { label: "Rejected", badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" }
};

export const APPLICATION_STEPS = [
  { key: "submitted", label: "Submitted" },
  { key: "under_review", label: "Review" },
  { key: "scheduled", label: "Scheduled" },
  { key: "inspected", label: "Inspected" },
  { key: "certified", label: "Certified" }
];

export const ROLES: Record<UserRole, { label: string; short: string; chip: string }> = {
  citizen: { label: "Citizen / Instrument User", short: "Citizen", chip: "bg-blue-50 text-blue-700 border-blue-200" },
  lmo: { label: "Legal Metrology Officer", short: "LMO", chip: "bg-violet-50 text-violet-700 border-violet-200" },
  gatc: { label: "Govt. Approved Test Centre", short: "GATC", chip: "bg-teal-50 text-teal-700 border-teal-200" },
  admin: { label: "State Administrator", short: "Admin", chip: "bg-rose-50 text-rose-700 border-rose-200" }
};

export const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab",
  "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand",
  "West Bengal"
];

export const CERTIFICATE_STATUSES: Record<CertificateStatusDerived, { label: string; badge: string }> = {
  valid: { label: "Valid", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  expiring: { label: "Expiring Soon", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  expired: { label: "Expired", badge: "bg-red-50 text-red-700 border-red-200" },
  revoked: { label: "Revoked", badge: "bg-slate-100 text-slate-600 border-slate-300" }
};

export function formatCurrency(amount: number | string): string {
  return "₹" + Number(amount || 0).toLocaleString("en-IN");
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "—";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export function daysUntilExpiry(expiryDateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr + "T00:00:00");
  return Math.round((expiry.getTime() - now.getTime()) / 86400000);
}

export function getCertificateStatus(cert: Certificate): CertificateStatusDerived {
  if (cert.status === "revoked") return "revoked";
  const days = daysUntilExpiry(cert.expiry_date);
  if (days < 0) return "expired";
  if (days <= 30) return "expiring";
  return "valid";
}
