'use client'
/**
 * Hook for consuming active kiosk translations based on selected in-memory language.
 * Supports: 'en' | 'hi' | 'mr' | 'gu' | 'bn' | 'ta'.
 * Defaults to 'en' if not set or invalid.
 */

import { useKioskStore } from '@/store/kiosk.store'
import {
  KIOSK_TRANSLATIONS,
  type KioskTranslationSchema,
  type SupportedKioskLanguage,
} from '@/lib/translations/kiosk-translations'

export function useKioskTranslation(): {
  t: KioskTranslationSchema
  language: SupportedKioskLanguage
  setLanguage: (lang: SupportedKioskLanguage) => void
} {
  const { language, setLanguage } = useKioskStore()

  const safeLang: SupportedKioskLanguage =
    language === 'hi' ||
    language === 'mr' ||
    language === 'gu' ||
    language === 'bn' ||
    language === 'ta' ||
    language === 'en'
      ? (language as SupportedKioskLanguage)
      : 'en'

  return {
    t: KIOSK_TRANSLATIONS[safeLang],
    language: safeLang,
    setLanguage: (lang) => setLanguage(lang),
  }
}
