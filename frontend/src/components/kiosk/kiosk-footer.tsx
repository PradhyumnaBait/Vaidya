'use client'
/**
 * KioskFooter — Bottom strip for the attract/idle screen.
 *
 * From Stitch kiosk_idle reference:
 * - Dark inverse-surface strip anchored to bottom
 * - Live digital clock (hours:minutes AM/PM)
 * - Current serving token number
 * - Hospital attribution
 *
 * Used ONLY on the attract/idle screen (K-01).
 * Not shown during active patient sessions.
 */

import { useEffect, useState } from 'react'

interface KioskFooterProps {
  currentToken?: number
}

function useKioskClock() {
  const [time, setTime] = useState<string>('--:-- --')
  const [date, setDate] = useState<string>('')

  useEffect(() => {
    function update() {
      const now = new Date()
      let hours = now.getHours()
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const ampm = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12 || 12
      setTime(`${hours}:${minutes} ${ampm}`)
      setDate(now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }))
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  return { time, date }
}

export function KioskFooter({ currentToken }: KioskFooterProps) {
  const { time, date } = useKioskClock()

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#2e3039] text-[#f0f0fb] rounded-t-2xl shadow-[0_-4px_24px_rgba(0,0,0,0.16)]"
      role="contentinfo"
    >
      <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Clock */}
        <div className="flex flex-col leading-none">
          <time
            className="text-[22px] font-bold font-mono tracking-wider"
            aria-label={`Current time: ${time}`}
          >
            {time}
          </time>
          <span className="text-[12px] text-[#f0f0fb]/70 mt-0.5 font-medium">
            {date}
          </span>
        </div>

        {/* Center: hospital info */}
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-medium tracking-widest uppercase text-[#f0f0fb]/50">
            All India Institute of Ayurveda
          </span>
          <span className="text-[10px] font-medium tracking-widest uppercase text-[#f0f0fb]/40">
            Ministry of Ayush · SIH26047
          </span>
        </div>

        {/* Serving token */}
        {currentToken !== undefined && (
          <div className="flex items-center gap-2 bg-[#004ac6]/25 px-4 py-2 rounded-xl">
            <div className="w-2 h-2 rounded-full bg-[#6bd8cb] animate-pulse" aria-hidden="true" />
            <span className="text-[14px] font-semibold">
              Serving Token #{currentToken}
            </span>
          </div>
        )}
      </div>
    </footer>
  )
}
