import React, { useState } from 'react';
import { MapPin, LocateFixed, ExternalLink } from 'lucide-react';

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  onChange?: (lat: number, lng: number) => void;
  readOnly?: boolean;
}

export function LocationViewer({ latitude = 18.6278, longitude = 73.8344, height = 220 }: { latitude?: number; longitude?: number; height?: number }) {
  const bbox = `${longitude - 0.004},${latitude - 0.0028},${longitude + 0.004},${latitude + 0.0028}`;
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <iframe
        title="Premises location map"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${latitude},${longitude}`}
        style={{ width: '100%', height, border: 0 }}
        loading="lazy"
      />
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-surface px-3 py-1.5 text-[11px] font-mono text-ink-soft">
        <span className="flex items-center gap-1">
          <MapPin size={12} className="text-primary" /> GPS Coordinates: {latitude.toFixed(5)}, {longitude.toFixed(5)}
        </span>
        <a
          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-primary hover:underline font-sans font-bold"
        >
          Open in Maps <ExternalLink size={10} />
        </a>
      </div>
    </div>
  );
}

export function LocationPicker({ latitude = 18.6278, longitude = 73.8344, onChange, readOnly = false }: LocationPickerProps) {
  const [lat, setLat] = useState(latitude);
  const [lng, setLng] = useState(longitude);
  const [locating, setLocating] = useState(false);

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newLat = Number(pos.coords.latitude.toFixed(5));
        const newLng = Number(pos.coords.longitude.toFixed(5));
        setLat(newLat);
        setLng(newLng);
        onChange?.(newLat, newLng);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handlePreset = (pLat: number, pLng: number) => {
    setLat(pLat);
    setLng(pLng);
    onChange?.(pLat, pLng);
  };

  return (
    <div className="space-y-3">
      <LocationViewer latitude={lat} longitude={lng} height={200} />
      {!readOnly && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLocate}
              disabled={locating}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-ink transition hover:border-primary hover:text-primary disabled:opacity-50"
            >
              <LocateFixed size={13} className={locating ? 'animate-spin' : ''} />
              {locating ? 'Detecting GPS…' : 'Use Current GPS'}
            </button>
            <div className="flex gap-1 text-[11px]">
              <span className="text-ink-soft">Presets:</span>
              <button
                type="button"
                onClick={() => handlePreset(18.6278, 73.8344)}
                className="font-bold text-primary hover:underline"
              >
                Pune
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => handlePreset(19.0760, 72.8777)}
                className="font-bold text-primary hover:underline"
              >
                Mumbai
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => handlePreset(12.9716, 77.5946)}
                className="font-bold text-primary hover:underline"
              >
                Bengaluru
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => handlePreset(28.6139, 77.2090)}
                className="font-bold text-primary hover:underline"
              >
                Delhi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
