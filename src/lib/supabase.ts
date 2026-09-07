import { createClient } from '@supabase/supabase-js';
import {
  INITIAL_PROFILES,
  INITIAL_INSTRUMENTS,
  INITIAL_APPLICATIONS,
  INITIAL_INSPECTIONS,
  INITIAL_CERTIFICATES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS
} from './mockData';
import { Profile, Instrument, Application, Inspection, Certificate, Notification, AuditLog } from '../types';
import { INSTRUMENT_TYPES } from './constants';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://cdxmgjgzpldrobhqlbpa.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_yeMWZzxveIxJMji7pEzP4w_w_KKrYzO';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

// Local Database Storage Engine for full offline & zero-dependency execution
const STORAGE_KEYS = {
  profiles: 'everify_profiles',
  instruments: 'everify_instruments',
  applications: 'everify_applications',
  inspections: 'everify_inspections',
  certificates: 'everify_certificates',
  notifications: 'everify_notifications',
  audit_logs: 'everify_audit_logs',
};

function getLocal<T>(key: string, initial: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return initial;
  }
}

function setLocal<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (e) {
    console.warn('LocalStorage save failed:', e);
  }
}

// Ensure mock storage initialized
function initStorage() {
  getLocal(STORAGE_KEYS.profiles, INITIAL_PROFILES);
  getLocal(STORAGE_KEYS.instruments, INITIAL_INSTRUMENTS);
  getLocal(STORAGE_KEYS.applications, INITIAL_APPLICATIONS);
  getLocal(STORAGE_KEYS.inspections, INITIAL_INSPECTIONS);
  getLocal(STORAGE_KEYS.certificates, INITIAL_CERTIFICATES);
  getLocal(STORAGE_KEYS.notifications, INITIAL_NOTIFICATIONS);
  getLocal(STORAGE_KEYS.audit_logs, INITIAL_AUDIT_LOGS);
}

initStorage();

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function appendAudit(actor_email: string | undefined, actor_name: string | undefined, action: string, entity: string, entity_id: string, details?: any) {
  const logs = getLocal<AuditLog>(STORAGE_KEYS.audit_logs, INITIAL_AUDIT_LOGS);
  const newLog: AuditLog = {
    id: logs.length ? Math.max(...logs.map(l => l.id)) + 1 : 1,
    actor_email: actor_email || 'system',
    actor_name: actor_name || 'System Worker',
    action,
    entity,
    entity_id,
    details,
    created_at: new Date().toISOString()
  };
  logs.unshift(newLog);
  setLocal(STORAGE_KEYS.audit_logs, logs);
}

// In-browser mock API dispatcher
async function handleMockApi(path: string, method: string, body?: any): Promise<any> {
  const url = new URL(path, 'http://localhost');
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  // PROFILES
  if (pathname === '/api/profiles') {
    const profiles = getLocal<Profile>(STORAGE_KEYS.profiles, INITIAL_PROFILES);
    if (method === 'GET') {
      const email = searchParams.get('email');
      if (email) {
        return profiles.find(p => p.email.toLowerCase() === email.toLowerCase()) || null;
      }
      return profiles;
    }
    if (method === 'POST') {
      const { email, full_name, role } = body || {};
      let prof = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (!prof) {
        prof = {
          id: profiles.length ? Math.max(...profiles.map(p => p.id)) + 1 : 1,
          email,
          full_name: full_name || email.split('@')[0],
          role: role || (email.includes('admin') ? 'admin' : email.includes('lmo') ? 'lmo' : email.includes('gatc') ? 'gatc' : 'citizen'),
          created_at: new Date().toISOString()
        };
        profiles.push(prof);
        setLocal(STORAGE_KEYS.profiles, profiles);
        appendAudit(email, full_name, 'profile_created', 'profile', String(prof.id), { role: prof.role });
      }
      return prof;
    }
    if (method === 'PUT') {
      const { id, role, actor_email, actor_name, organization, district, state, phone } = body || {};
      const index = profiles.findIndex(p => p.id === id);
      if (index !== -1) {
        const oldRole = profiles[index].role;
        profiles[index] = {
          ...profiles[index],
          role: role || profiles[index].role,
          organization: organization ?? profiles[index].organization,
          district: district ?? profiles[index].district,
          state: state ?? profiles[index].state,
          phone: phone ?? profiles[index].phone
        };
        setLocal(STORAGE_KEYS.profiles, profiles);
        appendAudit(actor_email, actor_name, 'user_role_changed', 'profile', String(id), { old_role: oldRole, new_role: role });
        return profiles[index];
      }
      throw new Error('Profile not found');
    }
  }

  // INSTRUMENTS
  if (pathname === '/api/instruments') {
    const instruments = getLocal<Instrument>(STORAGE_KEYS.instruments, INITIAL_INSTRUMENTS);
    if (method === 'GET') {
      const owner_email = searchParams.get('owner_email');
      if (owner_email) {
        return instruments.filter(i => i.owner_email.toLowerCase() === owner_email.toLowerCase());
      }
      return instruments;
    }
    if (method === 'POST') {
      const newInst: Instrument = {
        id: instruments.length ? Math.max(...instruments.map(i => i.id)) + 1 : 1,
        owner_email: body.owner_email,
        owner_name: body.owner_name,
        business_name: body.business_name,
        instrument_type: body.instrument_type,
        type_label: body.type_label || INSTRUMENT_TYPES.find(t => t.value === body.instrument_type)?.label || body.instrument_type,
        make: body.make,
        model: body.model,
        serial_number: body.serial_number,
        capacity: body.capacity,
        accuracy_class: body.accuracy_class,
        address: body.address,
        district: body.district,
        state: body.state,
        latitude: body.latitude,
        longitude: body.longitude,
        created_at: new Date().toISOString()
      };
      instruments.unshift(newInst);
      setLocal(STORAGE_KEYS.instruments, instruments);
      appendAudit(body.owner_email, body.owner_name, 'instrument_registered', 'instrument', String(newInst.id), {
        serial: newInst.serial_number,
        type: newInst.instrument_type
      });
      return newInst;
    }
  }

  // APPLICATIONS
  if (pathname === '/api/applications') {
    const applications = getLocal<Application>(STORAGE_KEYS.applications, INITIAL_APPLICATIONS);
    const instruments = getLocal<Instrument>(STORAGE_KEYS.instruments, INITIAL_INSTRUMENTS);

    if (method === 'GET') {
      const id = searchParams.get('id');
      if (id) {
        return applications.find(a => a.id === Number(id)) || null;
      }
      const applicant_email = searchParams.get('applicant_email');
      if (applicant_email) {
        return applications.filter(a => a.applicant_email.toLowerCase() === applicant_email.toLowerCase());
      }
      return applications;
    }

    if (method === 'POST') {
      const inst = instruments.find(i => i.id === Number(body.instrument_id));
      const nextId = applications.length ? Math.max(...applications.map(a => a.id)) + 1 : 1;
      const appNum = `LMV/${new Date().getFullYear()}/${10230 + nextId}`;

      const newApp: Application = {
        id: nextId,
        app_number: appNum,
        instrument_id: Number(body.instrument_id),
        instrument_type: inst?.instrument_type || body.instrument_type,
        instrument_label: inst?.type_label || body.instrument_label || 'Weighing Instrument',
        serial_number: inst?.serial_number || body.serial_number || 'UNKNOWN',
        business_name: inst?.business_name || body.business_name || 'Enterprise',
        applicant_email: body.applicant_email,
        applicant_name: body.applicant_name,
        application_type: body.application_type || 're_verification',
        status: 'submitted',
        fee: Number(body.fee || 0),
        preferred_date: body.preferred_date,
        district: inst?.district || 'Pune',
        state: inst?.state || 'Maharashtra',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      applications.unshift(newApp);
      setLocal(STORAGE_KEYS.applications, applications);

      // Notification
      const notifs = getLocal<Notification>(STORAGE_KEYS.notifications, INITIAL_NOTIFICATIONS);
      notifs.unshift({
        id: notifs.length ? Math.max(...notifs.map(n => n.id)) + 1 : 1,
        target_role: 'lmo',
        title: `New Verification Application · ${appNum}`,
        message: `${newApp.applicant_name} submitted verification request for ${newApp.instrument_label}.`,
        kind: 'new_application',
        read: false,
        created_at: new Date().toISOString()
      });
      setLocal(STORAGE_KEYS.notifications, notifs);

      appendAudit(body.applicant_email, body.applicant_name, 'application_submitted', 'application', appNum, {
        fee: newApp.fee,
        type: newApp.application_type
      });
      return newApp;
    }

    if (method === 'PUT') {
      const { id, action, scheduled_date, remarks, actor_email, actor_name } = body || {};
      const index = applications.findIndex(a => a.id === Number(id));
      if (index === -1) throw new Error('Application not found');

      const app = applications[index];
      if (action === 'schedule') {
        app.status = 'scheduled';
        app.scheduled_date = scheduled_date;
        app.assigned_officer_email = actor_email;
        app.assigned_officer_name = actor_name;
        app.updated_at = new Date().toISOString();
        appendAudit(actor_email, actor_name, 'inspection_scheduled', 'application', app.app_number, { scheduled_date });
      } else if (action === 'review') {
        app.status = 'under_review';
        app.updated_at = new Date().toISOString();
        appendAudit(actor_email, actor_name, 'application_reviewed', 'application', app.app_number);
      } else if (action === 'reject') {
        app.status = 'rejected';
        app.remarks = remarks;
        app.updated_at = new Date().toISOString();
        appendAudit(actor_email, actor_name, 'application_rejected', 'application', app.app_number, { remarks });
      }
      setLocal(STORAGE_KEYS.applications, applications);
      return app;
    }
  }

  // INSPECTIONS
  if (pathname === '/api/inspections') {
    const inspections = getLocal<Inspection>(STORAGE_KEYS.inspections, INITIAL_INSPECTIONS);
    const applications = getLocal<Application>(STORAGE_KEYS.applications, INITIAL_APPLICATIONS);

    if (method === 'GET') {
      const app_id = searchParams.get('application_id');
      if (app_id) {
        return inspections.filter(i => i.application_id === Number(app_id));
      }
      return inspections;
    }

    if (method === 'POST') {
      const nextId = inspections.length ? Math.max(...inspections.map(i => i.id)) + 1 : 1;
      const newInsp: Inspection = {
        id: nextId,
        application_id: Number(body.application_id),
        officer_email: body.officer_email,
        officer_name: body.officer_name,
        inspection_date: body.inspection_date || new Date().toISOString().split('T')[0],
        readings: body.readings || [],
        result: body.result || 'pass',
        seal_number: body.seal_number,
        remarks: body.remarks,
        created_at: new Date().toISOString()
      };
      inspections.unshift(newInsp);
      setLocal(STORAGE_KEYS.inspections, inspections);

      // Update application status to inspected
      const appIndex = applications.findIndex(a => a.id === Number(body.application_id));
      if (appIndex !== -1) {
        applications[appIndex].status = 'inspected';
        applications[appIndex].remarks = body.remarks;
        applications[appIndex].updated_at = new Date().toISOString();
        setLocal(STORAGE_KEYS.applications, applications);
      }

      appendAudit(body.officer_email, body.officer_name, 'inspection_recorded', 'application', String(body.application_id), {
        outcome: newInsp.result,
        seal: newInsp.seal_number
      });
      return newInsp;
    }
  }

  // CERTIFICATES
  if (pathname === '/api/certificates') {
    const certificates = getLocal<Certificate>(STORAGE_KEYS.certificates, INITIAL_CERTIFICATES);
    const applications = getLocal<Application>(STORAGE_KEYS.applications, INITIAL_APPLICATIONS);
    const instruments = getLocal<Instrument>(STORAGE_KEYS.instruments, INITIAL_INSTRUMENTS);
    const inspections = getLocal<Inspection>(STORAGE_KEYS.inspections, INITIAL_INSPECTIONS);

    if (method === 'GET') {
      const id = searchParams.get('id');
      if (id) {
        return certificates.find(c => c.id === Number(id)) || null;
      }
      const app_id = searchParams.get('application_id');
      if (app_id) {
        return certificates.find(c => c.application_id === Number(app_id)) || null;
      }
      const holder_email = searchParams.get('holder_email');
      if (holder_email) {
        return certificates.filter(c => c.holder_email?.toLowerCase() === holder_email.toLowerCase());
      }
      const search = searchParams.get('search');
      if (search) {
        const q = search.toLowerCase();
        return certificates.filter(c =>
          c.cert_number.toLowerCase().includes(q) ||
          (c.serial_number && c.serial_number.toLowerCase().includes(q)) ||
          (c.business_name && c.business_name.toLowerCase().includes(q)) ||
          (c.holder_name && c.holder_name.toLowerCase().includes(q)) ||
          (c.token && c.token.toLowerCase().includes(q))
        );
      }
      return certificates;
    }

    if (method === 'POST') {
      const { application_id, issued_by_email, issued_by_name, validity_months = 12 } = body || {};
      const app = applications.find(a => a.id === Number(application_id));
      if (!app) throw new Error('Application not found');

      const inst = instruments.find(i => i.id === app.instrument_id);
      const insp = inspections.find(i => i.application_id === app.id);

      const nextId = certificates.length ? Math.max(...certificates.map(c => c.id)) + 1 : 1;
      const stateCode = (app.state || 'MH').substring(0, 2).toUpperCase();
      const year = new Date().getFullYear();
      const certNum = `LM/${stateCode}/${year}/${String(730 + nextId).padStart(6, '0')}`;
      const token = generateUUID();

      const issueDateObj = new Date();
      const expiryDateObj = new Date(issueDateObj);
      expiryDateObj.setMonth(expiryDateObj.getMonth() + Number(validity_months));

      const newCert: Certificate = {
        id: nextId,
        cert_number: certNum,
        token: token,
        application_id: app.id,
        instrument_id: app.instrument_id,
        holder_email: app.applicant_email,
        holder_name: app.applicant_name,
        business_name: app.business_name,
        instrument_label: app.instrument_label,
        serial_number: app.serial_number,
        make: inst?.make || 'Standard Metrology OEM',
        model: inst?.model || 'Industrial Model',
        capacity: inst?.capacity || 'Standard Range',
        seal_number: insp?.seal_number || `SEAL-${stateCode}-${year}-${1000 + nextId}`,
        issue_date: issueDateObj.toISOString().split('T')[0],
        expiry_date: expiryDateObj.toISOString().split('T')[0],
        issued_by_name: issued_by_name || 'Legal Metrology Officer',
        district: app.district || 'Pune',
        state: app.state || 'Maharashtra',
        status: 'valid',
        created_at: new Date().toISOString()
      };

      certificates.unshift(newCert);
      setLocal(STORAGE_KEYS.certificates, certificates);

      // Update app status to certified
      const appIdx = applications.findIndex(a => a.id === app.id);
      if (appIdx !== -1) {
        applications[appIdx].status = 'certified';
        applications[appIdx].updated_at = new Date().toISOString();
        setLocal(STORAGE_KEYS.applications, applications);
      }

      // Citizen notification
      const notifs = getLocal<Notification>(STORAGE_KEYS.notifications, INITIAL_NOTIFICATIONS);
      notifs.unshift({
        id: notifs.length ? Math.max(...notifs.map(n => n.id)) + 1 : 1,
        user_email: app.applicant_email,
        title: `Certificate Issued · ${certNum}`,
        message: `Digital Certificate of Verification has been issued for your ${app.instrument_label}. Verification QR is now live.`,
        kind: 'certificate',
        read: false,
        created_at: new Date().toISOString()
      });
      setLocal(STORAGE_KEYS.notifications, notifs);

      appendAudit(issued_by_email, issued_by_name, 'certificate_issued', 'certificate', certNum, {
        token,
        application: app.app_number
      });

      return newCert;
    }

    if (method === 'PUT') {
      const { id, status, actor_email, actor_name, remarks } = body || {};
      const index = certificates.findIndex(c => c.id === Number(id));
      if (index === -1) throw new Error('Certificate not found');

      certificates[index].status = status;
      setLocal(STORAGE_KEYS.certificates, certificates);
      appendAudit(actor_email, actor_name, `certificate_${status}`, 'certificate', certificates[index].cert_number, { remarks });
      return certificates[index];
    }
  }

  // PUBLIC VERIFICATION
  if (pathname === '/api/verify') {
    const certificates = getLocal<Certificate>(STORAGE_KEYS.certificates, INITIAL_CERTIFICATES);
    const token = searchParams.get('token');
    const cert_number = searchParams.get('cert_number');

    let cert: Certificate | undefined;
    if (token) {
      cert = certificates.find(c => c.token.toLowerCase() === token.toLowerCase());
    } else if (cert_number) {
      cert = certificates.find(c => c.cert_number.toLowerCase() === cert_number.trim().toLowerCase());
    }

    if (cert) {
      appendAudit('public', 'Public Verifier', 'public_qr_verified', 'certificate', cert.token, {
        cert_number: cert.cert_number,
        status: cert.status
      });
      return { found: true, certificate: cert };
    }
    return { found: false, error: 'No certificate found matching the provided identifier.' };
  }

  // NOTIFICATIONS
  if (pathname === '/api/notifications') {
    const notifs = getLocal<Notification>(STORAGE_KEYS.notifications, INITIAL_NOTIFICATIONS);
    if (method === 'GET') {
      const email = searchParams.get('email');
      const role = searchParams.get('role');
      if (email) {
        return notifs.filter(n => n.user_email?.toLowerCase() === email.toLowerCase() || (role && n.target_role === role));
      }
      return notifs;
    }
    if (method === 'PUT') {
      const { id, mark_all, email } = body || {};
      if (mark_all && email) {
        notifs.forEach(n => {
          if (n.user_email?.toLowerCase() === email.toLowerCase()) {
            n.read = true;
          }
        });
      } else if (id) {
        const found = notifs.find(n => n.id === Number(id));
        if (found) found.read = true;
      }
      setLocal(STORAGE_KEYS.notifications, notifs);
      return { success: true };
    }
  }

  // AUDIT LOGS
  if (pathname === '/api/audit') {
    const logs = getLocal<AuditLog>(STORAGE_KEYS.audit_logs, INITIAL_AUDIT_LOGS);
    if (method === 'GET') {
      return logs;
    }
  }

  // STATS
  if (pathname === '/api/stats') {
    const certificates = getLocal<Certificate>(STORAGE_KEYS.certificates, INITIAL_CERTIFICATES);
    const applications = getLocal<Application>(STORAGE_KEYS.applications, INITIAL_APPLICATIONS);
    const instruments = getLocal<Instrument>(STORAGE_KEYS.instruments, INITIAL_INSTRUMENTS);
    return {
      certificates_count: certificates.length,
      instruments_count: instruments.length,
      applications_count: applications.length,
      inspections_count: applications.filter(a => a.status === 'inspected' || a.status === 'certified').length,
    };
  }

  throw new Error(`Unhandled mock API route: ${method} ${pathname}`);
}

async function request(path: string, options: RequestInit = {}): Promise<any> {
  // If in browser, use mock API engine for immediate reliable responsiveness
  return handleMockApi(path, options.method || 'GET', options.body ? JSON.parse(options.body as string) : undefined);
}

export const api = {
  get: (url: string) => request(url, { method: 'GET' }),
  post: (url: string, data?: any) =>
    request(url, { method: 'POST', body: JSON.stringify(data) }),
  put: (url: string, data?: any) =>
    request(url, { method: 'PUT', body: JSON.stringify(data) }),
  del: (url: string) => request(url, { method: 'DELETE' }),
};
