'use client'
/**
 * Vaidya Kiosk — Idle Detection Hook
 *
 * Detects user inactivity on a shared touchscreen kiosk.
 * When idle for `timeoutMs`, triggers a warning overlay.
 * If the warning is dismissed (no interaction within `warningMs`), the session resets.
 *
 * Events monitored: pointerdown, pointermove, keydown, touchstart, click
 * These cover both touch and keyboard interaction robustly.
 */

import { useEffect, useRef, useCallback, useState } from 'react'

interface UseIdleDetectionOptions {
  /** Milliseconds of inactivity before isIdle becomes true (default: 120_000 = 2 min) */
  timeoutMs?: number
  /** Whether idle detection is currently active */
  enabled?: boolean
  /** Callback fired when user becomes idle */
  onIdle?: () => void
  /** Callback fired when user resumes activity */
  onActive?: () => void
}

interface UseIdleDetectionReturn {
  isIdle: boolean
  /** Call this to manually reset the idle timer (e.g., on explicit user actions) */
  resetTimer: () => void
  /** Seconds remaining until idle (0 = already idle) */
  secondsActive: number
}

const IDLE_EVENTS: Array<keyof DocumentEventMap> = [
  'pointerdown',
  'pointermove',
  'keydown',
  'touchstart',
  'click',
]

export function useIdleDetection({
  timeoutMs = 120_000,
  enabled = true,
  onIdle,
  onActive,
}: UseIdleDetectionOptions = {}): UseIdleDetectionReturn {
  const [isIdle, setIsIdle] = useState(false)
  const [secondsActive, setSecondsActive] = useState(Math.floor(timeoutMs / 1000))

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastActivityRef = useRef<number>(Date.now())
  const isIdleRef = useRef(false)

  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (tickRef.current) clearInterval(tickRef.current)
  }, [])

  const startTickDown = useCallback(() => {
    if (tickRef.current) clearInterval(tickRef.current)
    tickRef.current = setInterval(() => {
      const elapsed = Date.now() - lastActivityRef.current
      const remaining = Math.max(0, Math.floor((timeoutMs - elapsed) / 1000))
      setSecondsActive(remaining)
    }, 1000)
  }, [timeoutMs])

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now()
    clearTimers()

    if (!enabled) return

    if (isIdleRef.current) {
      isIdleRef.current = false
      setIsIdle(false)
      onActive?.()
    }

    setSecondsActive(Math.floor(timeoutMs / 1000))
    startTickDown()

    timerRef.current = setTimeout(() => {
      isIdleRef.current = true
      setIsIdle(true)
      onIdle?.()
    }, timeoutMs)
  }, [clearTimers, enabled, onActive, onIdle, startTickDown, timeoutMs])

  useEffect(() => {
    if (!enabled) {
      clearTimers()
      setIsIdle(false)
      return
    }

    resetTimer()

    const handleActivity = () => resetTimer()

    IDLE_EVENTS.forEach((event) => {
      document.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      clearTimers()
      IDLE_EVENTS.forEach((event) => {
        document.removeEventListener(event, handleActivity)
      })
    }
  }, [enabled, resetTimer, clearTimers])

  return { isIdle, resetTimer, secondsActive }
}
