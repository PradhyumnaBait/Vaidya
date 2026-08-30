/**
 * Vaidya Kiosk — Localization
 *
 * Lightweight typed string catalog for kiosk UI strings.
 * Phase 1: English, Hindi, Marathi.
 *
 * Architecture notes:
 * - Not using i18next or react-intl — overkill for Phase 1 scale
 * - Simple record-based structure; adding a language = adding one record entry
 * - Components consume `useKioskTranslation(lang)` → `t(key)` pattern
 * - All user-facing kiosk strings must live here — no hardcoded strings in components
 * - Keys use SCREAMING_SNAKE_CASE to make missing keys visually obvious at runtime
 */

import type { KioskUILanguage } from '@/types/kiosk'

// ── String Catalog ────────────────────────────────────────────────────────────

/** All localizable kiosk UI string keys */
export type KioskStringKey =
  // K-01 Attract / Welcome
  | 'ATTRACT_TITLE'
  | 'ATTRACT_SUBTITLE'
  | 'ATTRACT_TAP_TO_BEGIN'
  | 'ATTRACT_TAP_SUBTITLE'
  | 'ATTRACT_AVAILABLE_LANGUAGES'
  | 'ATTRACT_CLOCK_LABEL'

  // K-02 Language selection
  | 'LANGUAGE_HEADING'
  | 'LANGUAGE_SUBHEADING_EN'
  | 'LANGUAGE_SUBHEADING_HI'
  | 'LANGUAGE_INSTRUCTION'
  | 'LANGUAGE_INSTRUCTION_HI'
  | 'LANGUAGE_CONTINUE'
  | 'LANGUAGE_HEAR_BUTTON'

  // Navigation
  | 'NAV_CONTINUE'
  | 'NAV_BACK'
  | 'NAV_CANCEL'

  // Session / Shell
  | 'SESSION_SECURE'
  | 'SESSION_PRIVACY_NOTE'
  | 'SESSION_HELP'
  | 'SESSION_TIMEOUT_TITLE'
  | 'SESSION_TIMEOUT_BODY'
  | 'SESSION_TIMEOUT_CONTINUE'
  | 'SESSION_TIMEOUT_END'
  | 'SESSION_CLEARED'

  // Accessibility
  | 'A11Y_LANGUAGE_SELECTED'
  | 'A11Y_LANGUAGE_NOT_SELECTED'
  | 'A11Y_PROCEED'

  // Errors
  | 'ERROR_GENERIC'
  | 'ERROR_RETRY'

type KioskStrings = Record<KioskStringKey, string>

const EN: KioskStrings = {
  ATTRACT_TITLE: 'Vaidya',
  ATTRACT_SUBTITLE: 'Intelligent Patient Intake',
  ATTRACT_TAP_TO_BEGIN: 'Touch anywhere to begin',
  ATTRACT_TAP_SUBTITLE: 'शुरू करने के लिए स्क्रीन छुएं',
  ATTRACT_AVAILABLE_LANGUAGES: 'Available Languages',
  ATTRACT_CLOCK_LABEL: 'Current time',

  LANGUAGE_HEADING: 'Welcome',
  LANGUAGE_SUBHEADING_EN: 'Select your language to continue',
  LANGUAGE_SUBHEADING_HI: 'आगे बढ़ने के लिए अपनी भाषा चुनें',
  LANGUAGE_INSTRUCTION: 'Select your language to continue',
  LANGUAGE_INSTRUCTION_HI: 'आगे बढ़ने के लिए अपनी भाषा चुनें',
  LANGUAGE_CONTINUE: 'Continue',
  LANGUAGE_HEAR_BUTTON: 'Hear instructions',

  NAV_CONTINUE: 'Continue',
  NAV_BACK: 'Back',
  NAV_CANCEL: 'Cancel',

  SESSION_SECURE: 'Secure System',
  SESSION_PRIVACY_NOTE: 'Your data is private and secure',
  SESSION_HELP: 'Need help? Ask our staff',
  SESSION_TIMEOUT_TITLE: 'Are you still there?',
  SESSION_TIMEOUT_BODY: 'Your session will reset due to inactivity.',
  SESSION_TIMEOUT_CONTINUE: 'Continue Session',
  SESSION_TIMEOUT_END: 'End Session',
  SESSION_CLEARED: 'Previous session cleared securely',

  A11Y_LANGUAGE_SELECTED: 'Selected',
  A11Y_LANGUAGE_NOT_SELECTED: 'Not selected',
  A11Y_PROCEED: 'Proceed to next step',

  ERROR_GENERIC: 'Something went wrong. Please try again.',
  ERROR_RETRY: 'Try Again',
}

const HI: KioskStrings = {
  ATTRACT_TITLE: 'वैद्य',
  ATTRACT_SUBTITLE: 'बुद्धिमान रोगी सेवा',
  ATTRACT_TAP_TO_BEGIN: 'शुरू करने के लिए छुएं',
  ATTRACT_TAP_SUBTITLE: 'Touch anywhere to begin',
  ATTRACT_AVAILABLE_LANGUAGES: 'उपलब्ध भाषाएँ',
  ATTRACT_CLOCK_LABEL: 'वर्तमान समय',

  LANGUAGE_HEADING: 'स्वागत है',
  LANGUAGE_SUBHEADING_EN: 'Welcome',
  LANGUAGE_SUBHEADING_HI: 'अपनी भाषा चुनें',
  LANGUAGE_INSTRUCTION: 'आगे बढ़ने के लिए अपनी भाषा चुनें',
  LANGUAGE_INSTRUCTION_HI: 'Select your language to continue',
  LANGUAGE_CONTINUE: 'आगे बढ़ें',
  LANGUAGE_HEAR_BUTTON: 'निर्देश सुनें',

  NAV_CONTINUE: 'आगे बढ़ें',
  NAV_BACK: 'वापस',
  NAV_CANCEL: 'रद्द करें',

  SESSION_SECURE: 'सुरक्षित प्रणाली',
  SESSION_PRIVACY_NOTE: 'आपका डेटा निजी और सुरक्षित है',
  SESSION_HELP: 'मदद चाहिए? हमारे कर्मचारियों से पूछें',
  SESSION_TIMEOUT_TITLE: 'क्या आप अभी भी यहाँ हैं?',
  SESSION_TIMEOUT_BODY: 'निष्क्रियता के कारण आपका सत्र रीसेट हो जाएगा।',
  SESSION_TIMEOUT_CONTINUE: 'सत्र जारी रखें',
  SESSION_TIMEOUT_END: 'सत्र समाप्त करें',
  SESSION_CLEARED: 'पिछला सत्र सुरक्षित रूप से साफ़ किया गया',

  A11Y_LANGUAGE_SELECTED: 'चुना गया',
  A11Y_LANGUAGE_NOT_SELECTED: 'नहीं चुना गया',
  A11Y_PROCEED: 'अगले चरण पर जाएं',

  ERROR_GENERIC: 'कुछ गलत हुआ। कृपया पुनः प्रयास करें।',
  ERROR_RETRY: 'पुनः प्रयास करें',
}

const MR: KioskStrings = {
  ATTRACT_TITLE: 'वैद्य',
  ATTRACT_SUBTITLE: 'बुद्धिमान रुग्ण सेवा',
  ATTRACT_TAP_TO_BEGIN: 'सुरू करण्यासाठी स्पर्श करा',
  ATTRACT_TAP_SUBTITLE: 'Touch anywhere to begin',
  ATTRACT_AVAILABLE_LANGUAGES: 'उपलब्ध भाषा',
  ATTRACT_CLOCK_LABEL: 'सध्याची वेळ',

  LANGUAGE_HEADING: 'स्वागत आहे',
  LANGUAGE_SUBHEADING_EN: 'Welcome',
  LANGUAGE_SUBHEADING_HI: 'आपली भाषा निवडा',
  LANGUAGE_INSTRUCTION: 'पुढे जाण्यासाठी तुमची भाषा निवडा',
  LANGUAGE_INSTRUCTION_HI: 'Select your language to continue',
  LANGUAGE_CONTINUE: 'पुढे',
  LANGUAGE_HEAR_BUTTON: 'सूचना ऐका',

  NAV_CONTINUE: 'पुढे',
  NAV_BACK: 'मागे',
  NAV_CANCEL: 'रद्द करा',

  SESSION_SECURE: 'सुरक्षित प्रणाली',
  SESSION_PRIVACY_NOTE: 'तुमचा डेटा खाजगी आणि सुरक्षित आहे',
  SESSION_HELP: 'मदत हवी आहे? कर्मचाऱ्यांना विचारा',
  SESSION_TIMEOUT_TITLE: 'तुम्ही अजून आहात का?',
  SESSION_TIMEOUT_BODY: 'निष्क्रियतेमुळे तुमचे सत्र रीसेट होईल.',
  SESSION_TIMEOUT_CONTINUE: 'सत्र सुरू ठेवा',
  SESSION_TIMEOUT_END: 'सत्र संपवा',
  SESSION_CLEARED: 'मागील सत्र सुरक्षितपणे साफ केले',

  A11Y_LANGUAGE_SELECTED: 'निवडले',
  A11Y_LANGUAGE_NOT_SELECTED: 'निवडले नाही',
  A11Y_PROCEED: 'पुढील चरणावर जा',

  ERROR_GENERIC: 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.',
  ERROR_RETRY: 'पुन्हा प्रयत्न करा',
}

const CATALOGS: Record<KioskUILanguage, KioskStrings> = { en: EN, hi: HI, mr: MR }

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Returns a `t()` function for the given UI language.
 * Falls back to English for unsupported languages or missing keys.
 */
export function getKioskTranslation(lang: string | null): (key: KioskStringKey) => string {
  const catalog = CATALOGS[(lang as KioskUILanguage) ?? 'en'] ?? CATALOGS.en
  return (key: KioskStringKey): string => catalog[key] ?? EN[key] ?? key
}

// ── Language Options ───────────────────────────────────────────────────────────

import type { KioskLanguageOption } from '@/types/kiosk'
import type { Language } from '@/types'

export const KIOSK_LANGUAGES: KioskLanguageOption[] = [
  { code: 'hi' as Language, native: 'हिंदी', english: 'Hindi' },
  { code: 'en' as Language, native: 'English', english: 'English' },
  { code: 'mr' as Language, native: 'मराठी', english: 'Marathi' },
  { code: 'gu' as Language, native: 'ગુજરાતી', english: 'Gujarati' },
  { code: 'bn' as Language, native: 'বাংলা', english: 'Bengali' },
  { code: 'te' as Language, native: 'తెలుగు', english: 'Telugu' },
  { code: 'ta' as Language, native: 'தமிழ்', english: 'Tamil' },
  { code: 'kn' as Language, native: 'ಕನ್ನಡ', english: 'Kannada' },
  { code: 'ml' as Language, native: 'മലയാളം', english: 'Malayalam' },
  { code: 'pa' as Language, native: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
  { code: 'or' as Language, native: 'ଓଡ଼ିଆ', english: 'Odia' },
  { code: 'ur' as Language, native: 'اردو', english: 'Urdu', dir: 'rtl' },
]
