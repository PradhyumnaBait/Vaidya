'use client'
import { cn } from '@/lib/utils'
import { Language } from '@/types'

const LANGUAGES: Array<{ code: Language; native: string; english: string }> = [
  { code: 'hi', native: 'हिंदी', english: 'Hindi' },
  { code: 'en', native: 'English', english: 'English' },
  { code: 'mr', native: 'मराठी', english: 'Marathi' },
  { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati' },
  { code: 'bn', native: 'বাংলা', english: 'Bengali' },
  { code: 'te', native: 'తెలుగు', english: 'Telugu' },
  { code: 'ta', native: 'தமிழ்', english: 'Tamil' },
  { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada' },
  { code: 'ml', native: 'മലയാളം', english: 'Malayalam' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
  { code: 'or', native: 'ଓଡ଼ିଆ', english: 'Odia' },
  { code: 'ur', native: 'اردو', english: 'Urdu' },
]

interface LanguageSelectorProps {
  selected: Language | null
  onSelect: (lang: Language) => void
}

export function LanguageSelector({ selected, onSelect }: LanguageSelectorProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {LANGUAGES.map(lang => (
        <button
          key={lang.code}
          onClick={() => onSelect(lang.code)}
          className={cn(
            'min-h-[56px] px-3 flex flex-col items-center justify-center rounded-lg border transition-all duration-fast',
            selected === lang.code
              ? 'border-2 border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
              : 'border-[1.5px] border-[var(--color-border)] bg-white hover:bg-[var(--color-surface-subtle)]'
          )}
        >
          <span className={cn('text-[16px] font-medium', selected === lang.code ? 'text-[var(--color-accent-text)]' : 'text-[var(--color-text-primary)]')}>
            {lang.native}
          </span>
          <span className="text-[11px] text-[var(--color-text-muted)]">{lang.english}</span>
        </button>
      ))}
    </div>
  )
}
