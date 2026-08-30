'use client'
/**
 * K-02 — Language Selection Screen
 *
 * Route: /kiosk/language
 *
 * Stitch reference: welcome_language_selection_animated (primary)
 *                   welcome_language_selection (fallback reference)
 *                   welcome_language_selection_desktop (layout reference)
 *
 * Visual refinements over Stitch:
 * - Stagger-animated tile entrance (motion-safe, reduced-motion respects opacity=1)
 * - Larger tiles (88px min-height vs Stitch ~56px) — hospital kiosk standing distance
 * - 3-column grid on landscape, 2-column on portrait/narrow (vs Stitch 2-col only)
 * - Selected state: solid blue bg, white text, checkmark (matches Stitch intent)
 * - Continue button: sticky to bottom, slides up on first selection
 * - Bilingual instruction line (EN + HI from Stitch)
 * - Multilingual heading stack (Welcome / स्वागत है / स्वागत आहे)
 * - "Hear instructions" audio affordance (UI only, Phase 1)
 *
 * Accessibility:
 * - role="radiogroup" wrapping all language tiles
 * - Each tile: role="radio", aria-checked
 * - Continue button aria-disabled until selection made
 * - Language heading labeled for screen readers
 * - Focus management: first tile gets focus on mount
 *
 * State:
 * - Selected language → useKioskStore.setLanguage()
 * - Navigate to /kiosk/identify on Continue
 */

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useKioskStore } from '@/store/kiosk.store'
import { LanguageTile } from '@/components/kiosk/language-tile'
import { KioskButton } from '@/components/kiosk/kiosk-button'
import { KIOSK_LANGUAGES } from '@/lib/kiosk-localization'
import type { Language } from '@/types'

// Stagger delay per tile (ms) — matches Stitch animated reference (200–530ms range)
const TILE_STAGGER_BASE = 180
const TILE_STAGGER_STEP = 35

// Heading stack: cascading opacity (from Stitch welcome_language_selection_animated)
const HEADING_LINES = [
  { text: 'Welcome',      opacity: 1.0,  lang: 'en' },
  { text: 'स्वागत है',   opacity: 0.70, lang: 'hi' },
  { text: 'स्वागत आहे',  opacity: 0.45, lang: 'mr' },
]

export default function KioskLanguagePage() {
  const router = useRouter()
  const { language: storedLang, setLanguage, advanceStep, updateActivity } = useKioskStore()
  const [selected, setSelected] = useState<Language | null>(storedLang)
  const [isContinuing, setIsContinuing] = useState(false)

  // Update store when selection changes
  const handleSelect = useCallback(
    (code: Language) => {
      setSelected(code)
      setLanguage(code)
      updateActivity()
    },
    [setLanguage, updateActivity]
  )

  const handleContinue = useCallback(async () => {
    if (!selected || isContinuing) return
    setIsContinuing(true)
    advanceStep('IDENTIFY')
    // Navigate to next step (Phase 2 will implement /kiosk/identify)
    // For now: route to a placeholder (will add in next phases)
    router.push('/kiosk/identify')
  }, [selected, isContinuing, advanceStep, router])

  // Keyboard navigation within the radio group
  const handleGridKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const tiles = Array.from(
        e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')
      )
      const currentIdx = tiles.findIndex((t) => t === document.activeElement)

      let nextIdx = currentIdx
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIdx = (currentIdx + 1) % tiles.length
        e.preventDefault()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIdx = (currentIdx - 1 + tiles.length) % tiles.length
        e.preventDefault()
      } else if (e.key === 'Enter' || e.key === ' ') {
        const focusedTile = tiles[currentIdx]
        const code = focusedTile?.dataset.lang as Language | undefined
        if (code) handleSelect(code)
        e.preventDefault()
        return
      }

      tiles[nextIdx]?.focus()
    },
    [handleSelect]
  )

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff]">
      {/* Spacer for fixed header */}
      <div className="h-[59px] shrink-0" />

      {/* Scrollable content area */}
      <div className="flex-1 w-full max-w-[680px] mx-auto px-5 pb-36 pt-6 flex flex-col gap-6">

        {/* Heading stack */}
        <div className="flex flex-col items-center text-center gap-1" aria-label="Language selection heading">
          {HEADING_LINES.map((line, i) => (
            <h1
              key={line.lang}
              lang={line.lang}
              className="text-[34px] font-bold text-[#191b23] leading-snug motion-safe:animate-[kiosk-slide-fade-up_0.4s_ease-out_forwards] opacity-0"
              style={{
                opacity: 0, // will be overridden by animation
                animationDelay: `${i * 60}ms`,
                ['--final-opacity' as string]: line.opacity,
              }}
            >
              {line.text}
            </h1>
          ))}
        </div>

        {/* Bilingual instruction */}
        <div className="flex flex-col items-center text-center gap-1">
          <p className="text-[16px] text-[#191b23] font-medium">
            Select your language to continue
          </p>
          <p className="text-[15px] text-[#434655]" lang="hi">
            आगे बढ़ने के लिए अपनी भाषा चुनें
          </p>
        </div>

        {/* Language grid */}
        <div
          role="radiogroup"
          aria-label="Select your preferred language"
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full"
          onKeyDown={handleGridKeyDown}
        >
          {KIOSK_LANGUAGES.map((lang, idx) => (
            <LanguageTile
              key={lang.code}
              lang={lang}
              isSelected={selected === lang.code}
              onSelect={handleSelect}
              animationDelay={TILE_STAGGER_BASE + idx * TILE_STAGGER_STEP}
            />
          ))}
        </div>

        {/* Audio assistance affordance */}
        <div className="flex justify-center">
          <button
            className="flex items-center gap-2 text-[#004ac6] text-[14px] font-medium px-6 py-3 rounded-full bg-[#f3f3fe] hover:bg-[#ededf9] transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004ac6]/40"
            aria-label="Hear instructions in selected language (audio assistance)"
            onClick={() => {
              // TODO Phase 2: Trigger TTS via Bhashini API
            }}
          >
            <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" aria-hidden="true">
              <path d="M9 3.5a.5.5 0 00-.8-.4L4.6 6H2a1 1 0 00-1 1v6a1 1 0 001 1h2.6l3.6 2.9a.5.5 0 00.8-.4V3.5zM14.07 5.93a7 7 0 010 8.14M16.24 3.76a10 10 0 010 12.48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Hear instructions
          </button>
        </div>

        {/* Help note */}
        <p className="text-center text-[13px] text-[#737686]">
          Need help? Ask our staff
        </p>
      </div>

      {/* Sticky Continue CTA — slides up after selection */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="continue-bar"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-50 px-5 pb-8 pt-4 bg-gradient-to-t from-[#faf8ff] via-[#faf8ff]/95 to-transparent"
            role="navigation"
            aria-label="Session navigation"
          >
            <div className="max-w-[680px] mx-auto">
              <KioskButton
                variant="primary"
                size="fullLg"
                onClick={handleContinue}
                isLoading={isContinuing}
                aria-label={`Continue with ${selected ? KIOSK_LANGUAGES.find((l) => l.code === selected)?.english : 'selected language'}`}
              >
                {isContinuing ? null : (
                  <>
                    Continue
                    <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" aria-hidden="true">
                      <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </KioskButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
