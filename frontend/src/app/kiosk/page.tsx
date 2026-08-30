'use client'
/**
 * K-01 — Attract / Welcome Screen
 *
 * Route: /kiosk
 *
 * Multilingual Architecture:
 * - Dynamic strings from useKioskTranslation()
 * - Multi-script greetings stack
 * - Interactive language pill row
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useKioskStore } from '@/store/kiosk.store'
import { useKioskTranslation } from '@/lib/hooks/use-kiosk-translation'
import { KioskFooter } from '@/components/kiosk/kiosk-footer'
import { kioskService } from '@/services/kiosk.service'

// Multilingual greeting stack — 6 supported languages
const GREETINGS = [
  { text: 'Welcome',        opacity: 'opacity-100', lang: 'en' },
  { text: 'स्वागत है',     opacity: 'opacity-80',  lang: 'hi' },
  { text: 'स्वागत आहे',    opacity: 'opacity-65',  lang: 'mr' },
  { text: 'સ્વાગત છે',     opacity: 'opacity-50',  lang: 'gu' },
  { text: 'স্বাগতম',         opacity: 'opacity-40',  lang: 'bn' },
  { text: 'வரவேற்கிறோம்',   opacity: 'opacity-30',  lang: 'ta' },
]

// Available language pills shown at bottom of attract screen
const LANGUAGE_PILLS = [
  'English', 'हिन्दी', 'मराठी', 'ગુજરાતી', 'বাংলা', 'தமிழ்',
]


export default function KioskAttractPage() {
  const router = useRouter()
  const { t } = useKioskTranslation()
  const { status, beginSession, setSessionRefs } = useKioskStore()
  const [isBeginning, setIsBeginning] = useState(false)
  const [showCleared, setShowCleared] = useState(false)
  const beginBtnRef = useRef<HTMLButtonElement>(null)

  // Show "session cleared" banner briefly if we just came from a reset
  useEffect(() => {
    if (status === 'reset') {
      setShowCleared(true)
      const tTimer = setTimeout(() => setShowCleared(false), 4000)
      return () => clearTimeout(tTimer)
    }
  }, [status])

  const handleBegin = useCallback(async () => {
    if (isBeginning) return
    setIsBeginning(true)

    // Begin session in store immediately for snappy UX
    beginSession()

    // Initialize session with backend (async, non-blocking for navigation)
    kioskService.initSession().then(({ sessionId, sessionHash }) => {
      setSessionRefs(sessionId, sessionHash)
    }).catch(() => {
      // Session init failure handled gracefully
    })

    // Navigate to language selection
    router.push('/kiosk/language')
  }, [isBeginning, beginSession, setSessionRefs, router])

  return (
    <>
      {/* Session cleared banner */}
      <div
        role="status"
        aria-live="polite"
        className={[
          'fixed top-4 left-1/2 -translate-x-1/2 z-50',
          'flex items-center gap-3 px-6 py-3 rounded-2xl',
          'bg-[#006a61] text-white shadow-lg',
          'transition-all duration-500 ease-out',
          showCleared ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none',
        ].join(' ')}
      >
        <svg viewBox="0 0 20 20" className="w-5 h-5 shrink-0" fill="none" aria-hidden="true">
          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fill="currentColor"/>
        </svg>
        <span className="text-[14px] font-medium">{t.attract.sessionCleared}</span>
      </div>

      {/* Full-screen attract container */}
      <div
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#faf8ff] cursor-pointer select-none"
        onClick={handleBegin}
        role="button"
        tabIndex={-1}
        aria-label="Touch anywhere to begin your kiosk session"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBegin() }}
      >
        {/* Ambient background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div
            className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full motion-safe:animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(0,74,198,0.06) 0%, transparent 70%)',
              animationDuration: '8s',
            }}
          />
          <div
            className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full motion-safe:animate-pulse"
            style={{
              background: 'radial-gradient(circle, rgba(0,106,97,0.05) 0%, transparent 70%)',
              animationDuration: '12s',
              animationDelay: '2s',
            }}
          />
        </div>

        {/* Main content area */}
        <div className="relative z-10 flex flex-col items-center gap-10 px-6 pb-40 pt-8">
          {/* Wordmark */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-3xl bg-[#004ac6] flex items-center justify-center shadow-[0_8px_32px_rgba(0,74,198,0.25)] motion-safe:animate-[kiosk-float_6s_ease-in-out_infinite]">
              <svg viewBox="0 0 48 48" className="w-10 h-10 text-white" fill="none" aria-hidden="true">
                <path
                  d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 6a6 6 0 110 12 6 6 0 010-12zm0 28c-6.67 0-12.54-3.33-16-8.4.08-5.31 10.67-8.2 16-8.2 5.32 0 15.91 2.89 16 8.2C36.54 34.67 30.67 38 24 38z"
                  fill="currentColor"
                />
              </svg>
            </div>

            <div className="text-center">
              <h1 className="text-[48px] font-bold text-[#004ac6] tracking-tight uppercase leading-none">
                Vaidya
              </h1>
              <p className="text-[13px] font-medium text-[#737686] tracking-[0.15em] uppercase mt-1.5">
                {t.attract.touchToBeginSub}
              </p>
            </div>
          </div>

          {/* Multi-script greetings */}
          <div className="flex flex-col items-center gap-1 text-center" aria-hidden="true">
            {GREETINGS.map((g, i) => (
              <span
                key={g.lang}
                className={[
                  'text-[32px] font-semibold text-[#191b23] leading-tight',
                  g.opacity,
                  'motion-safe:animate-[kiosk-slide-fade-up_0.5s_ease-out_forwards] opacity-0',
                ].join(' ')}
                style={{ animationDelay: `${i * 80}ms` }}
                lang={g.lang}
              >
                {g.text}
              </span>
            ))}
          </div>

          {/* Primary CTA */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative flex items-center justify-center" aria-hidden="true">
              <div
                className="absolute w-32 h-32 rounded-full bg-[#004ac6]/10 motion-safe:animate-ping"
                style={{ animationDuration: '2.5s' }}
              />
              <div
                className="absolute w-24 h-24 rounded-full bg-[#004ac6]/15 motion-safe:animate-ping"
                style={{ animationDuration: '2.5s', animationDelay: '0.4s' }}
              />
              <button
                ref={beginBtnRef}
                type="button"
                className="relative w-16 h-16 rounded-full bg-[#004ac6] text-white shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#004ac6]/40"
                aria-label="Begin kiosk intake session"
              >
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="text-center">
              <p className="text-[20px] font-bold text-[#191b23]">
                {t.attract.touchToBegin}
              </p>
              <p className="text-[14px] text-[#737686] mt-0.5">
                {t.attract.touchToBeginSub}
              </p>
            </div>
          </div>

          {/* Available languages pill strip */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[11px] font-semibold text-[#737686] uppercase tracking-widest">
              {t.attract.availableLanguages}
            </span>
            <div className="flex flex-wrap justify-center gap-2 max-w-[480px]">
              {LANGUAGE_PILLS.map((lang) => (
                <span
                  key={lang}
                  className="px-3 py-1 bg-[#ededf9] text-[#434655] rounded-full text-[13px] font-medium"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <KioskFooter currentToken={28} />
      </div>
    </>
  )
}
