import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Scale,
  Plus,
  X,
  MapPin,
  ClipboardList,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/supabase';
import { INSTRUMENT_TYPES, INDIAN_STATES, formatCurrency } from '../../lib/constants';
import { LocationPicker } from '../../components/LocationPicker';
import { Spinner } from '../../components/Spinner';
import { Instrument } from '../../types';

export function Instruments() {
  const { user, profile } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isAdmin = profile?.role === 'admin';

  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(searchParams.get('new') === '1');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [itype, setItype] = useState('weighbridge');
  const [serial, setSerial] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [capacity, setCapacity] = useState('');
  const [accuracyClass, setAccuracyClass] = useState('Class III (Medium)');
  const [businessName, setBusinessName] = useState(profile?.organization || '');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [lat, setLat] = useState(18.6278);
  const [lng, setLng] = useState(73.8344);

  const loadInstruments = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const url = isAdmin
        ? '/api/instruments'
        : `/api/instruments?owner_email=${encodeURIComponent(user.email)}`;
      const data = await api.get(url);
      if (Array.isArray(data)) setInstruments(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load instruments');
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    loadInstruments();
  }, [loadInstruments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!serial.trim()) {
      setErrorMsg('Serial number is required.');
      return;
    }
    if (!businessName.trim()) {
      setErrorMsg('Business name is required.');
      return;
    }

    setSubmitting(true);
    try {
      const typeCfg = INSTRUMENT_TYPES.find((t) => t.value === itype);
      await api.post('/api/instruments', {
        owner_email: user.email,
        owner_name: profile?.full_name || user.email.split('@')[0],
        business_name: businessName.trim(),
        instrument_type: itype,
        type_label: typeCfg?.label || itype,
        make: make.trim() || 'Standard OEM',
        model: model.trim() || 'Model Spec',
        serial_number: serial.trim(),
        capacity: capacity.trim() || 'Standard Capacity',
        accuracy_class: accuracyClass,
        address: address.trim(),
        district,
        state,
        latitude: lat,
        longitude: lng
      });

      setShowForm(false);
      setSerial('');
      setMake('');
      setModel('');
      setCapacity('');
      await loadInstruments();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register instrument.');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTypeInfo = INSTRUMENT_TYPES.find((t) => t.value === itype);

  return (
    <div className="space-y-6 rise">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            {isAdmin ? 'All Registered Instruments' : 'My Registered Instruments'}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Commercial weighing and measuring devices enrolled on the portal.
          </p>
        </div>

        {!isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white transition hover:bg-primary-dark shadow-sm"
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? 'Cancel' : 'Register New Instrument'}
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMsg}
        </div>
      )}

      {/* Registration Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-base font-extrabold text-ink">Register Weighing / Measuring Device</h2>
          <p className="mt-1 text-xs text-ink-soft">
            Provide technical specifications and geo-location for statutory inspection.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft">
                Instrument Category *
              </label>
              <select
                value={itype}
                onChange={(e) => setItype(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {INSTRUMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label} (Statutory Fee: {formatCurrency(t.fee)} · Validity: {t.validity}m)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft">
                Serial Number *
              </label>
              <input
                type="text"
                value={serial}
                onChange={(e) => setSerial(e.target.value)}
                placeholder="e.g. AV-50T-2026-904"
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 font-mono text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft">
                Manufacturer / Make
              </label>
              <input
                type="text"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="e.g. Avery India, Essae"
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft">
                Model Identifier
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. E-1205 Pitless"
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft">
                Max Capacity & Verification Scale Interval (e)
              </label>
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g. 50,000 kg (e=10 kg)"
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft">
                Accuracy Class
              </label>
              <select
                value={accuracyClass}
                onChange={(e) => setAccuracyClass(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="Class I (Special)">Class I (Special Precision)</option>
                <option value="Class II (High)">Class II (High Accuracy)</option>
                <option value="Class III (Medium)">Class III (Medium Commercial)</option>
                <option value="Class IIII (Ordinary)">Class IIII (Ordinary)</option>
                <option value="Class 0.5 (Petroleum)">Class 0.5 (Fuel/Petroleum)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft">
                Business / Enterprise Name *
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Kumar Trading Co."
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft">
                State
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft">
                District / Zone
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Pune"
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft">
                Premises Physical Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Plot / Survey No, Industrial Area, Street, Landmark"
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* GPS Location Map */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft">
                Premises GPS Coordinates
              </label>
              <div className="mt-2">
                <LocationPicker
                  latitude={lat}
                  longitude={lng}
                  onChange={(nLat, nLng) => {
                    setLat(nLat);
                    setLng(nLng);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-xs font-bold text-ink-soft hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-primary px-6 py-2.5 text-xs font-bold text-white transition hover:bg-primary-dark shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Registering…' : 'Save & Enrol Instrument'}
            </button>
          </div>
        </form>
      )}

      {/* Instruments Grid */}
      {loading ? (
        <Spinner label="Loading instruments…" />
      ) : instruments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Scale size={36} className="mx-auto text-ink-soft/40" />
          <h3 className="mt-3 text-base font-bold text-ink">No Instruments Registered Yet</h3>
          <p className="mt-1 text-xs text-ink-soft">
            Enrol your first weighing or measuring device to begin online verification applications.
          </p>
          {!isAdmin && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm"
            >
              Register First Instrument
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {instruments.map((inst) => (
            <div key={inst.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Scale size={20} />
                </div>
                <span className="font-mono text-xs font-bold text-primary">#{inst.id}</span>
              </div>

              <h3 className="mt-4 font-extrabold text-ink">{inst.type_label}</h3>
              <p className="font-mono text-xs text-ink-soft">SN: {inst.serial_number}</p>

              <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Make / Model:</span>
                  <span className="font-medium text-ink">{inst.make} {inst.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Capacity:</span>
                  <span className="font-medium text-ink">{inst.capacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Premises:</span>
                  <span className="font-medium text-ink truncate max-w-[150px]">{inst.business_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">Location:</span>
                  <span className="font-medium text-ink">{inst.district}, {inst.state}</span>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <button
                  onClick={() => navigate(`/dashboard/applications?new=1&inst=${inst.id}`)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-surface py-2 text-xs font-bold text-primary transition hover:bg-primary hover:text-white"
                >
                  <ClipboardList size={14} /> Apply for Verification
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
