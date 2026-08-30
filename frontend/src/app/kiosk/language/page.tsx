'use client'
/**
 * K-02 — Language Selection Screen
 *
 * Route: /kiosk/language
 *
 * Multilingual Architecture:
 * - Dynamic strings from useKioskTranslation()
 * - Selecting language immediately updates kioskStore language state
 * - Continue button label instantly adapts to selected language
 */

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useKioskStore } from '@/store/kiosk.store'
import { useKioskTranslation } from '@/lib/hooks/use-kiosk-translation'
import { LanguageTile } from '@/components/kiosk/language-tile'
import { KioskButton } from '@/components/kiosk/kiosk-button'
import { KIOSK_LANGUAGES } from '@/lib/kiosk-localization'
import type { Language } from '@/types'

// Stagger delay per tile (ms)
const TILE_STAGGER_BASE = 180
const TILE_STAGGER_STEP = 35

// Heading stack: cascading opacity
const HEADING_LINES = [
  { text: 'Welcome',      opacity: 1.0,  lang: 'en' },
  { text: 'स्वागत है',   opacity: 0.75, lang: 'hi' },
  { text: 'સ્વાગત છે · স্বাগতম · வரவேற்பு',  opacity: 0.50, lang: 'gu' },
]


export default function KioskLanguagePage() {
  const router = useRouter()
  const { t } = useKioskTranslation()
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
                opacity: 0,
                animationDelay: `${i * 60}ms`,
                ['--final-opacity' as string]: line.opacity,
              }}
            >
              {line.text}
            </h1>
          ))}
        </div>

        {/* Localized instruction */}
        <div className="flex flex-col items-center text-center gap-1">
          <p className="text-[16px] text-[#191b23] font-semibold">
            {t.language.title}
          </p>
          <p className="text-[14px] text-[#737686]">
            {t.language.instructions}
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

        {/* Help note */}
        <p className="text-center text-[13px] text-[#737686]">
          {t.common.staffHelp}
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
                aria-label={`Continue in selected language`}
              >
                {isContinuing ? null : t.language.confirmButton}
              </KioskButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
