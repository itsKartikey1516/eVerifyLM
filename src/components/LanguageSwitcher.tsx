import React from 'react';
import { Languages } from 'lucide-react';
import { useI18n, LANGUAGES, SupportedLanguage } from '../lib/i18n';

interface LanguageSwitcherProps {
  light?: boolean;
}

export function LanguageSwitcher({ light }: LanguageSwitcherProps) {
  const { lang, setLang } = useI18n();

  return (
    <div className="relative inline-flex items-center">
      <Languages
        size={14}
        className={`pointer-events-none absolute left-2.5 ${light ? 'text-white/80' : 'text-ink-soft'}`}
        aria-hidden="true"
      />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as SupportedLanguage)}
        aria-label="Select language / भाषा चुनें"
        className={`h-9 cursor-pointer appearance-none rounded-xl border py-0 pl-8 pr-3 text-xs font-bold outline-none transition ${
          light
            ? 'border-white/30 bg-white/10 text-white hover:bg-white/20 [&>option]:text-ink'
            : 'border-slate-300 bg-white text-ink hover:border-primary'
        }`}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native} ({l.label})
          </option>
        ))}
      </select>
    </div>
  );
}
