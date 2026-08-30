'use client'
/**
 * KioskHeader — Persistent top header bar for the kiosk shell.
 *
 * Shows:
 * - Hospital identity (logo mark + name + department)
 * - Step progress indicator (thin bar, only when in active session)
 * - Dynamic language switcher toggle (EN | HI | MR) that preserves session state
 *
 * Does NOT show patient name or any PHI.
 * Height: 56px — consistent across all kiosk screens.
 */

import { cn } from '@/lib/utils'
import { useKioskStore } from '@/store/kiosk.store'
import type { KioskStep } from '@/types/kiosk'

interface KioskHeaderProps {
  step: KioskStep
  language: string | null
  progressPercent?: number
  className?: string
}

// Steps that show the progress bar and language indicator
const ACTIVE_STEPS: KioskStep[] = [
  'LANGUAGE', 'IDENTIFY', 'CONFIRM', 'REGISTER',
  'CONSENT', 'INTAKE', 'DOCUMENTS', 'REVIEW',
]

// Map steps to progress percent for the header bar
const STEP_PROGRESS: Partial<Record<KioskStep, number>> = {
  LANGUAGE: 5,
  IDENTIFY: 20,
  CONFIRM: 30,
  REGISTER: 30,
  CONSENT: 40,
  INTAKE: 65,
  DOCUMENTS: 80,
  REVIEW: 92,
  COMPLETE: 100,
}

import type { SupportedKioskLanguage } from '@/lib/translations/kiosk-translations'

export function KioskHeader({ step, language, progressPercent, className }: KioskHeaderProps) {
  const { setLanguage, updateActivity } = useKioskStore()
  const isActive = ACTIVE_STEPS.includes(step)
  const progress = progressPercent ?? STEP_PROGRESS[step] ?? 0

  const activeLang = language ?? 'en'

  const handleLangChange = (newLang: SupportedKioskLanguage) => {
    updateActivity()
    setLanguage(newLang)
  }


  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'bg-white/95 backdrop-blur-xl border-b border-[#e1e2ed]/50',
        'shadow-[0_1px_8px_rgba(0,0,0,0.04)]',
        className
      )}
      role="banner"
    >
      <div className="max-w-[680px] mx-auto px-5 h-14 flex items-center justify-between gap-4">
        {/* Left: wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Logo mark */}
          <div className="w-8 h-8 rounded-lg bg-[#004ac6] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 20 20" className="w-4 h-4 text-white" fill="none" aria-hidden="true">
              <path
                d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 3a2 2 0 110 4 2 2 0 010-4zm0 9.2c-2.67 0-5.01-1.33-6.4-3.36.03-2.12 4.27-3.28 6.4-3.28 2.12 0 6.37 1.16 6.4 3.28C15.01 13.87 12.67 15.2 10 15.2z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-bold text-[#004ac6] tracking-tight uppercase">
              Vaidya
            </span>
            <span className="text-[10px] font-medium text-[#737686] tracking-wider uppercase">
              AIIA OPD
            </span>
          </div>
        </div>

        {/* Right: Dynamic in-session Language Switcher */}
        <div className="shrink-0 flex items-center gap-2">
          {isActive && (
            <div className="flex items-center bg-[#ededf9] rounded-xl p-0.5 sm:p-1 gap-0.5 sm:gap-1 border border-[#c3c6d7]/40 max-w-[340px] sm:max-w-none overflow-x-auto">
              {[
                { code: 'en' as const, label: 'EN' },
                { code: 'hi' as const, label: 'हिंदी' },
                { code: 'mr' as const, label: 'मराठी' },
                { code: 'gu' as const, label: 'ગુજરાતી' },
                { code: 'bn' as const, label: 'বাংলা' },
                { code: 'ta' as const, label: 'தமிழ்' },
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleLangChange(item.code)}
                  className={cn(
                    'px-2 sm:px-2.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold transition-all whitespace-nowrap',
                    activeLang === item.code
                      ? 'bg-[#004ac6] text-white shadow-xs'
                      : 'text-[#434655] hover:text-[#191b23]'
                  )}
                  aria-label={`Switch interface to ${item.label}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}


          <div className="hidden sm:flex items-center gap-1.5 text-[#a1a1aa] pl-1">
            <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" aria-hidden="true">
              <rect x="2" y="7" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-[10px] font-medium tracking-wide uppercase">Secure</span>
          </div>
        </div>
      </div>

      {/* Progress bar — only in active session steps */}
      {isActive && (
        <div
          className="h-[3px] bg-[#e1e2ed]"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Session progress"
        >
          <div
            className="h-full bg-[#004ac6] transition-all duration-500 ease-out rounded-r-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </header>
  )
}
