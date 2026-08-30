'use client'
/**
 * LanguageTile — Large touch-friendly language selection tile for K-02.
 *
 * Design from Stitch reference (welcome_language_selection):
 * - White card with subtle shadow
 * - Native script name prominent (large, primary color text)
 * - English name below (small, muted)
 * - Selected: blue background, white text, ring
 * - Entrance: staggered slideFadeUp animation (motion-safe)
 * - Min height: 88px for comfortable touch targets
 * - RTL support for Urdu
 */

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { KioskLanguageOption } from '@/types/kiosk'

interface LanguageTileProps {
  lang: KioskLanguageOption
  isSelected: boolean
  onSelect: (code: KioskLanguageOption['code']) => void
  animationDelay?: number
}

export const LanguageTile = forwardRef<HTMLButtonElement, LanguageTileProps>(
  function LanguageTile({ lang, isSelected, onSelect, animationDelay = 0 }, ref) {
  return (
    <button
      ref={ref}
      onClick={() => onSelect(lang.code)}
      role="radio"
      aria-checked={isSelected}
      aria-label={`${lang.native} — ${lang.english}${isSelected ? ' (selected)' : ''}`}
      dir={lang.dir ?? 'ltr'}
      data-lang={lang.code}
      style={{
        animationDelay: `${animationDelay}ms`,
      }}
      className={cn(
        // Base layout
        'relative flex flex-col items-center justify-center gap-1',
        'min-h-[88px] px-4 py-5 rounded-2xl',
        // Transition
        'transition-all duration-[150ms] ease-out',
        'active:scale-[0.96]',
        // Focus
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#004ac6]/40 focus-visible:ring-offset-2',
        // Entrance animation (motion-safe only)
        'motion-safe:animate-[kiosk-slide-fade-up_0.4s_ease-out_forwards] opacity-0',
        // Idle state
        !isSelected && [
          'bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]',
          'hover:bg-[#f3f3fe] hover:shadow-[0_2px_8px_rgba(0,74,198,0.12)]',
        ],
        // Selected state
        isSelected && [
          'bg-[#004ac6] shadow-[0_4px_16px_rgba(0,74,198,0.30)]',
          'ring-2 ring-[#004ac6] ring-offset-2',
        ]
      )}
    >
      {/* Native script name */}
      <span
        className={cn(
          'text-[20px] font-semibold leading-tight',
          isSelected ? 'text-white' : 'text-[#191b23]'
        )}
      >
        {lang.native}
      </span>

      {/* English name */}
      <span
        className={cn(
          'text-[12px] font-medium tracking-wide uppercase',
          isSelected ? 'text-white/80' : 'text-[#737686]'
        )}
      >
        {lang.english}
      </span>

      {/* Selected checkmark */}
      {isSelected && (
        <span
          className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"
          aria-hidden="true"
        >
          <svg viewBox="0 0 12 12" className="w-3 h-3 text-white" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </button>
  )
})
LanguageTile.displayName = 'LanguageTile'
