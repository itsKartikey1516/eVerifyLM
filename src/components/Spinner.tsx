import React from 'react';

interface SpinnerProps {
  label?: string;
}

export function Spinner({ label }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10" role="status" aria-live="polite">
      <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary/25 border-t-primary" />
      {label && <p className="text-sm font-medium text-ink-soft">{label}</p>}
    </div>
  );
}
