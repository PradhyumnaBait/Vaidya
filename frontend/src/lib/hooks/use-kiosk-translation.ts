'use client'
/**
 * Hook for consuming active kiosk translations based on selected in-memory language.
 * Defaults to 'en' if not set or invalid.
 */

import { useKioskStore } from '@/store/kiosk.store'
import { KIOSK_TRANSLATIONS, type KioskTranslationSchema } from '@/lib/translations/kiosk-translations'

export function useKioskTranslation(): {
  t: KioskTranslationSchema
  language: 'en' | 'hi' | 'mr'
  setLanguage: (lang: 'en' | 'hi' | 'mr') => void
} {
  const { language, setLanguage } = useKioskStore()

  const safeLang: 'en' | 'hi' | 'mr' =
    language === 'hi' || language === 'mr' || language === 'en' ? language : 'en'

  return {
    t: KIOSK_TRANSLATIONS[safeLang],
    language: safeLang,
    setLanguage: (lang) => setLanguage(lang),
  }
}
