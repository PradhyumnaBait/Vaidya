'use client'
/**
 * SessionTimeoutOverlay — Full-screen overlay shown when the patient becomes idle.
 *
 * From Stitch design system:
 * - Privacy-first: warns patient their session will reset
 * - Countdown timer (seconds remaining)
 * - Two actions: "Continue Session" or "End Session"
 * - On "End Session" or countdown reaching 0 → full privacy reset → back to /kiosk
 *
 * Accessibility:
 * - role="alertdialog" with aria-modal
 * - Focus trapped inside overlay
 * - Countdown announced via aria-live
 */

import { useEffect, useRef } from 'react'
import { KioskButton } from './kiosk-button'

interface SessionTimeoutOverlayProps {
  secondsRemaining: number
  onContinue: () => void
  onEnd: () => void
}

export function SessionTimeoutOverlay({
  secondsRemaining,
  onContinue,
  onEnd,
}: SessionTimeoutOverlayProps) {
  const continueRef = useRef<HTMLButtonElement>(null)

  // Auto-focus the continue button when overlay appears
  useEffect(() => {
    continueRef.current?.focus()
  }, [])

  const progressPercent = Math.max(0, Math.min(100, (secondsRemaining / 30) * 100))

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-[#191b23]/80 backdrop-blur-sm"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="timeout-title"
      aria-describedby="timeout-body"
    >
      {/* Dialog panel */}
      <div className="bg-white rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.20)] p-10 max-w-[480px] w-full mx-6 flex flex-col items-center gap-6">
        {/* Countdown ring */}
        <div className="relative w-24 h-24 shrink-0" aria-hidden="true">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="42" stroke="#e1e2ed" strokeWidth="6" fill="none" />
            <circle
              cx="48"
              cy="48"
              r="42"
              stroke="#004ac6"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - progressPercent / 100)}`}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[28px] font-bold text-[#004ac6] font-mono">
            {secondsRemaining}
          </span>
        </div>

        {/* Text */}
        <div className="text-center space-y-2">
          <h2
            id="timeout-title"
            className="text-[22px] font-semibold text-[#191b23] leading-snug"
          >
            Are you still there?
          </h2>
          <p
            id="timeout-body"
            className="text-[15px] text-[#434655] leading-relaxed"
          >
            Your session will reset automatically in{' '}
            <span aria-live="polite" aria-atomic="true" className="font-semibold text-[#004ac6]">
              {secondsRemaining} second{secondsRemaining !== 1 ? 's' : ''}
            </span>
            .
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 w-full">
          <KioskButton
            ref={continueRef}
            variant="primary"
            size="full"
            onClick={onContinue}
          >
            Continue Session
          </KioskButton>
          <KioskButton
            variant="ghost"
            size="full"
            onClick={onEnd}
          >
            End Session
          </KioskButton>
        </div>

        {/* Privacy note */}
        <p className="text-[12px] text-[#a1a1aa] text-center leading-relaxed">
          For your privacy, all session data will be cleared before the next patient.
        </p>
      </div>
    </div>
  )
}
