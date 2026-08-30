'use client'
/**
 * KioskShell — The canonical layout shell for ALL kiosk screens.
 *
 * Architecture:
 * - ONE canonical shell. Every kiosk screen inherits from it.
 * - No auth check. No redirect to login or dashboards.
 * - Handles: idle detection, session timeout overlay, language state, privacy reset.
 * - Composes: KioskHeader (persistent), page content (slot), KioskFooter (attract only).
 *
 * Usage:
 * - Set in /app/kiosk/layout.tsx
 * - All /kiosk/* routes automatically get this shell
 *
 * Privacy model:
 * - Idle detection is ACTIVE during active sessions only.
 * - On timeout → warning overlay → either continue or reset.
 * - Reset clears kiosk store (no PHI in store anyway) and navigates to /kiosk.
 * - The 'reset' status shows a brief cleared banner before returning to attract.
 *
 * Reduced motion:
 * - All animations use CSS `motion-safe:` or respect prefers-reduced-motion via Tailwind.
 */

import { ReactNode, useEffect, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useKioskStore } from '@/store/kiosk.store'
import { useIdleDetection } from '@/lib/hooks/use-idle-detection'
import { KioskHeader } from '@/components/kiosk/kiosk-header'
import { SessionTimeoutOverlay } from '@/components/kiosk/session-timeout-overlay'
import { kioskService } from '@/services/kiosk.service'
import { DEFAULT_KIOSK_CONFIG } from '@/types/kiosk'

interface KioskShellProps {
  children: ReactNode
}

/** Kiosk timeout warning duration in seconds */
const WARNING_DURATION_S = DEFAULT_KIOSK_CONFIG.warningDurationSeconds

/** Kiosk idle timeout in ms (before showing warning) */
const IDLE_TIMEOUT_MS = DEFAULT_KIOSK_CONFIG.idleTimeoutSeconds * 1000

export function KioskShell({ children }: KioskShellProps) {
  const router = useRouter()
  const pathname = usePathname()

  const { step, status, language, sessionId, setStatus, updateActivity, resetSession } = useKioskStore()
  const sessionIdRef = useRef(sessionId)
  useEffect(() => { sessionIdRef.current = sessionId }, [sessionId])

  // Idle detection is ONLY active during an active patient session
  const isActiveSession = status === 'active'

  const handleIdle = useCallback(() => {
    if (isActiveSession) {
      setStatus('timeout')
    }
  }, [isActiveSession, setStatus])

  const handleActive = useCallback(() => {
    if (status === 'timeout') {
      setStatus('active')
    }
  }, [status, setStatus])

  const { isIdle, secondsActive, resetTimer } = useIdleDetection({
    timeoutMs: IDLE_TIMEOUT_MS,
    enabled: isActiveSession,
    onIdle: handleIdle,
    onActive: handleActive,
  })

  // Sync idle detection reset with store activity
  useEffect(() => {
    if (isActiveSession) {
      updateActivity()
    }
  }, [pathname, isActiveSession, updateActivity])

  // Warning countdown: how many seconds left on the warning overlay
  // warning window is 30s, and isIdle fires after IDLE_TIMEOUT_MS
  // secondsActive gives seconds since last activity; we use it inversely
  const warningSecondsRemaining = Math.max(0, WARNING_DURATION_S - Math.max(0, Math.floor((IDLE_TIMEOUT_MS / 1000) - secondsActive + WARNING_DURATION_S - IDLE_TIMEOUT_MS / 1000)))

  // Auto-reset when warning countdown reaches 0
  useEffect(() => {
    if (status === 'timeout' && warningSecondsRemaining === 0) {
      handlePrivacyReset()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, warningSecondsRemaining])

  const handlePrivacyReset = useCallback(async () => {
    // Notify backend of session teardown (no-op in Phase 1)
    if (sessionIdRef.current) {
      await kioskService.teardownSession(sessionIdRef.current).catch(() => {
        // Silently handle errors — kiosk must always reset regardless
      })
    }
    resetSession()
    // Brief delay for reset animation, then navigate to attract
    setTimeout(() => {
      router.replace('/kiosk')
      // Clear the 'reset' status after navigation lands
      setTimeout(() => {
        useKioskStore.getState().setStatus('idle')
      }, 600)
    }, 800)
  }, [resetSession, router])

  const handleContinueSession = useCallback(() => {
    setStatus('active')
    resetTimer()
  }, [setStatus, resetTimer])

  const handleEndSession = useCallback(() => {
    handlePrivacyReset()
  }, [handlePrivacyReset])

  // Language code for the header indicator
  const langCode = language ?? null

  return (
    <div
      className="min-h-screen w-full bg-[#faf8ff] flex flex-col overflow-x-hidden"
      // Inform assistive tech this is an application (kiosk mode)
      role="application"
      aria-label="Vaidya Patient Kiosk"
    >
      {/* Persistent kiosk header — shown on all screens except attract */}
      {step !== 'ATTRACT' && (
        <KioskHeader
          step={step}
          language={langCode}
        />
      )}

      {/* Page content */}
      <main
        className="flex-1 flex flex-col"
        id="kiosk-main-content"
        tabIndex={-1}
      >
        {children}
      </main>

      {/* Session timeout overlay — shown when idle detection fires */}
      {status === 'timeout' && isIdle && (
        <SessionTimeoutOverlay
          secondsRemaining={Math.max(0, WARNING_DURATION_S)}
          onContinue={handleContinueSession}
          onEnd={handleEndSession}
        />
      )}
    </div>
  )
}
