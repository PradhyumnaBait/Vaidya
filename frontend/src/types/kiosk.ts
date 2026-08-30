/**
 * Vaidya Kiosk — Type Definitions
 *
 * Foundation types for the standalone kiosk application surface (/kiosk/*).
 * These are intentionally separate from the main application types to keep the
 * kiosk self-contained and avoid coupling to staff-facing data models.
 */

import type { Language } from '@/types'

// ── Kiosk Step / Navigation ───────────────────────────────────────────────────

/**
 * Ordered steps in the kiosk patient journey.
 * The kiosk always starts at ATTRACT and returns to ATTRACT after COMPLETE.
 */
export type KioskStep =
  | 'ATTRACT'        // K-01: Idle / attract screen — no patient context
  | 'LANGUAGE'       // K-02: Language selection
  | 'IDENTIFY'       // K-03: Patient identification (ABHA / phone / new)
  | 'CONFIRM'        // K-04: Demographic confirmation (returning patient)
  | 'REGISTER'       // K-05: New patient registration
  | 'CONSENT'        // K-06: Informed consent
  | 'INTAKE'         // K-07: AI-driven clinical interview
  | 'DOCUMENTS'      // K-08: Document upload / scan
  | 'REVIEW'         // K-09: Session review & confirmation
  | 'COMPLETE'       // K-10: Token issued / session complete
  | 'STAFF_ASSIST'   // K-11: Staff assistance requested

// ── Kiosk Session Status ──────────────────────────────────────────────────────

export type KioskSessionStatus =
  | 'idle'       // No active patient session — showing attract screen
  | 'active'     // Patient is interacting
  | 'timeout'    // Idle timeout warning is showing
  | 'complete'   // Session completed — showing completion screen
  | 'reset'      // Privacy reset in progress

// ── Kiosk Session ─────────────────────────────────────────────────────────────

export interface KioskPatientData {
  id?: string
  name: string
  age: number
  sex: 'Male' | 'Female' | 'Other' | 'M' | 'F' | 'O'
  phone: string
  abhaNumber?: string
  lastVisit?: string
  preferredLanguage?: string
}

export interface KioskDocument {
  id: string
  name: string
  type: 'PRESCRIPTION' | 'LAB_REPORT' | 'DISCHARGE_SUMMARY' | 'OTHER'
  extractedEntitiesCount?: number
  confidenceScore: number
  status: 'COMPLETE' | 'REVIEW_REQUIRED' | 'PROCESSING'
  capturedAt: string
}

/**
 * Ephemeral kiosk session state held in memory only (never localStorage).
 * A new session begins when the patient taps the attract screen.
 * It is fully cleared on reset/completion/timeout.
 *
 * Only non-PHI references are kept here.
 * Clinical data flows through the backend service layer.
 */
export interface KioskSession {
  /** Unique identifier for this kiosk session (generated client-side, confirmed by backend) */
  sessionId: string | null
  /**
   * Session hash (SHA-256) returned by the backend after session init.
   * Used for backend API calls. The sessionId itself is never sent to
   * external systems — only the hash is.
   */
  sessionHash: string | null
  /** Current step in the kiosk journey */
  step: KioskStep
  /** Overall session status */
  status: KioskSessionStatus
  /** Language selected by the patient */
  language: Language | null
  /** Timestamp of last user interaction (used for idle detection) */
  lastActivityAt: number | null
  /** Timestamp when the session began (patient tapped attract) */
  startedAt: number | null
  /**
   * Opaque reference to the patient identity.
   * Null until identity is established in K-03/K-04.
   */
  patientRef: string | null
  /**
   * In-memory patient summary data for current session UI display.
   * Cleared completely on resetSession(). Never persisted.
   */
  patientData: KioskPatientData | null
  /**
   * In-memory collected clinical intake answers for the current session.
   * Cleared completely on resetSession(). Never persisted.
   */
  intakeAnswers: Record<string, string>
  /**
   * In-memory list of documents captured in the current session.
   * Cleared completely on resetSession(). Never persisted.
   */
  documents: KioskDocument[]
  /**
   * Opaque encounter reference. Null until encounter is created.
   */
  encounterRef: string | null
  /**
   * Whether the patient has been identified as returning (has existing records).
   * Drives the K-04 vs K-05 branch in the identification flow.
   */
  isReturningPatient: boolean | null
}

// ── Kiosk Configuration ───────────────────────────────────────────────────────

/**
 * Static kiosk configuration — describes the physical deployment context.
 * In production this would come from environment variables or a config API.
 */
export interface KioskConfig {
  hospitalName: string
  departmentName: string
  kioskId: string
  /** Idle timeout in seconds before showing the timeout warning overlay */
  idleTimeoutSeconds: number
  /** Seconds of the warning overlay before auto-reset */
  warningDurationSeconds: number
}

export const DEFAULT_KIOSK_CONFIG: KioskConfig = {
  hospitalName: 'All India Institute of Ayurveda',
  departmentName: 'OPD',
  kioskId: 'AIIA-K-01',
  idleTimeoutSeconds: 120,
  warningDurationSeconds: 30,
}

// ── Localization ───────────────────────────────────────────────────────────────

/** Subset of languages actively supported in the kiosk UI strings for Phase 1 */
export type KioskUILanguage = 'en' | 'hi' | 'mr'

/** All supported patient-selectable languages on the kiosk */
export interface KioskLanguageOption {
  code: Language
  /** Native script name */
  native: string
  /** English transliteration / name */
  english: string
  /** Direction for RTL support */
  dir?: 'ltr' | 'rtl'
}
