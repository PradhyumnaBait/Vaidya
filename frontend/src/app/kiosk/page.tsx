'use client'
/**
 * K-01 — Attract / Welcome Screen
 *
 * The first thing a patient sees when they walk up to the kiosk.
 * Route: /kiosk
 *
 * Stitch reference: kiosk_idle_p_23 + welcome_language_selection (combined)
 *
 * Visual design decisions (refined from Stitch):
 * - Full-screen, centered composition — no headers during attract mode
 * - Ambient background blobs (very subtle, motion-safe only)
 * - Vaidya wordmark + icon (large, confident)
 * - Multi-script greeting: Welcome / स्वागत है / स्वागत आहे / ਸੁਆਗਤ ਹੈ (staggered opacity)
 * - Pulsing touch target with "Touch anywhere to begin" (English + Hindi)
 * - Language pill row at bottom showing available scripts
 * - Dark footer strip: clock, serving token, hospital attribution
 *
 * Interaction:
 * - ANY touch/click on the screen begins the session and navigates to /kiosk/language
 * - The pulsing ring draws the eye to the primary action
 *
 * Accessibility:
 * - `role="main"` with descriptive aria-label
 * - motion-safe: all animations
 * - Sufficient contrast on all text elements
 * - Tab: focus lands on "Begin" button
 * - Enter/Space: begins session
 *
 * Privacy:
 * - Zero patient data on this screen
 * - If a reset just happened, shows a brief "Session cleared" banner
 */

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useKioskStore } from '@/store/kiosk.store'
import { KioskFooter } from '@/components/kiosk/kiosk-footer'
import { kioskService } from '@/services/kiosk.service'

// Multilingual greeting stack — exactly as in Stitch but refined spacing
const GREETINGS = [
  { text: 'Welcome',        opacity: 'opacity-100', lang: 'en' },
  { text: 'स्वागत है',     opacity: 'opacity-70',  lang: 'hi' },
  { text: 'स्वागत आहे',    opacity: 'opacity-50',  lang: 'mr' },
  { text: 'ਸੁਆਗਤ ਹੈ',     opacity: 'opacity-30',  lang: 'pa' },
]

// Available language pills shown at bottom of attract screen
const LANGUAGE_PILLS = [
  'हिंदी', 'English', 'मराठी', 'ગુજરાતી', 'বাংলা', 'తెలుగు', 'தமிழ்',
]

export default function KioskAttractPage() {
  const router = useRouter()
  const { status, beginSession, setSessionRefs } = useKioskStore()
  const [isBeginning, setIsBeginning] = useState(false)
  const [showCleared, setShowCleared] = useState(false)
  const beginBtnRef = useRef<HTMLButtonElement>(null)

  // Show "session cleared" banner briefly if we just came from a reset
  useEffect(() => {
    if (status === 'reset') {
      setShowCleared(true)
      const t = setTimeout(() => setShowCleared(false), 4000)
      return () => clearTimeout(t)
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
      // Session init failure is non-fatal for Phase 1 (using mock)
      // Phase 2: handle gracefully with retry or staff alert
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
        <span className="text-[14px] font-medium">Previous session cleared securely</span>
      </div>

      {/*
        Full-screen attract container.
        Touching ANYWHERE begins the session — the entire screen is the touch target.
      */}
      <div
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#faf8ff] cursor-pointer select-none"
        onClick={handleBegin}
        // Keyboard: make the wrapper accessible as a button-like element
        role="button"
        tabIndex={-1} // Tab will focus the actual begin button below
        aria-label="Touch anywhere to begin your kiosk session"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBegin() }}
      >

        {/* ── Ambient background blobs (motion-safe only) ── */}
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

        {/* ── Main content area ── */}
        <div className="relative z-10 flex flex-col items-center gap-10 px-6 pb-40 pt-8">

          {/* Wordmark */}
          <div className="flex flex-col items-center gap-3">
            {/* Icon mark */}
            <div className="w-20 h-20 rounded-3xl bg-[#004ac6] flex items-center justify-center shadow-[0_8px_32px_rgba(0,74,198,0.25)] motion-safe:animate-[kiosk-float_6s_ease-in-out_infinite]">
              <svg viewBox="0 0 48 48" className="w-10 h-10 text-white" fill="none" aria-hidden="true">
                {/* Healthcare cross / person icon */}
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
                Intelligent Patient Intake
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

          {/* Primary CTA — touch target */}
          <div className="flex flex-col items-center gap-6">
            {/* Pulsing touch indicator */}
            <div className="relative flex items-center justify-center" aria-hidden="true">
              {/* Outer pulse rings */}
              <div
                className="absolute w-32 h-32 rounded-full bg-[#004ac6]/10 motion-safe:animate-ping"
                style={{ animationDuration: '2.5s' }}
              />
              <div
                className="absolute w-24 h-24 rounded-full bg-[#004ac6]/15 motion-safe:animate-ping"
                style={{ animationDuration: '2.5s', animationDelay: '0.4s' }}
              />
              {/* Core button */}
              <button
                ref={beginBtnRef}
                onClick={handleBegin}
                disabled={isBeginning}
                aria-label="Tap to begin your health intake"
                className={[
                  'relative w-20 h-20 rounded-full',
                  'bg-[#004ac6] text-white',
                  'flex items-center justify-center',
                  'shadow-[0_8px_24px_rgba(0,74,198,0.35)]',
                  'transition-transform duration-150',
                  'active:scale-95 focus-visible:outline-none',
                  'focus-visible:ring-4 focus-visible:ring-[#004ac6]/40 focus-visible:ring-offset-4',
                  isBeginning && 'animate-pulse',
                ].join(' ')}
              >
                <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" aria-hidden="true">
                  {/* Touch/hand icon */}
                  <path
                    d="M12 8a2 2 0 014 0v6.17A4.5 4.5 0 0122.5 18.5v1a6.5 6.5 0 01-6.5 6.5h-2a6.5 6.5 0 01-6.5-6.5V14a2 2 0 114 0V8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* Text prompts */}
            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-[20px] font-semibold text-[#191b23]">
                {isBeginning ? 'Starting…' : 'Touch anywhere to begin'}
              </p>
              <p className="text-[16px] text-[#434655]" lang="hi">
                शुरू करने के लिए स्क्रीन छुएं
              </p>
            </div>
          </div>

          {/* Available language pills */}
          <div className="flex flex-col items-center gap-3 mt-2">
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#a1a1aa]">
              Available Languages
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {LANGUAGE_PILLS.map((lang) => (
                <span
                  key={lang}
                  className="px-4 py-1.5 bg-[#ededf9] rounded-full text-[14px] font-medium text-[#434655]"
                >
                  {lang}
                </span>
              ))}
              <span className="px-4 py-1.5 bg-[#ededf9] rounded-full text-[14px] font-medium text-[#737686]">
                +5 More
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dark footer strip with clock and token */}
      <KioskFooter currentToken={28} />
    </>
  )
}
