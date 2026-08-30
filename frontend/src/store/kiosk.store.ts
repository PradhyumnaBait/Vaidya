'use client'
/**
 * Vaidya Kiosk — Session Store
 *
 * In-memory only (NO persist middleware). The kiosk is a shared physical device.
 * Patient session data must never persist across kiosk sessions in localStorage.
 *
 * All clinical/PHI data lives in the backend. This store holds only:
 * - Navigation state (current step)
 * - UI session metadata (language, status, timestamps)
 * - Opaque references (session hash, patient ref — never PHI)
 */

import { create } from 'zustand'
import type { Language } from '@/types'
import type { KioskSession, KioskStep, KioskSessionStatus } from '@/types/kiosk'

interface KioskStore extends KioskSession {
  // ── Actions ─────────────────────────────────────────────────────────────────

  /** Called when patient taps the attract screen — begins a new session */
  beginSession: () => void

  /** Update the selected language */
  setLanguage: (lang: Language) => void

  /** Advance to the next kiosk step */
  advanceStep: (step: KioskStep) => void

  /** Set session status */
  setStatus: (status: KioskSessionStatus) => void

  /** Record latest user interaction timestamp (for idle detection) */
  updateActivity: () => void

  /** Set backend session references after session init API call */
  setSessionRefs: (sessionId: string, sessionHash: string) => void

  /** Set patient ref after identity is established */
  setPatientRef: (patientRef: string, isReturning: boolean) => void

  /** Set patient summary data for in-memory session display */
  setPatientData: (patientData: KioskSession['patientData'], isReturning: boolean) => void

  /** Record a clinical intake answer */
  setIntakeAnswer: (key: string, value: string) => void

  /** Add a captured document to the session in-memory list */
  addDocument: (doc: KioskSession['documents'][number]) => void

  /** Remove a document from the session in-memory list */
  removeDocument: (docId: string) => void

  /** Set encounter ref after encounter is created */
  setEncounterRef: (encounterRef: string) => void

  /**
   * Full privacy reset — clears ALL session state and returns to ATTRACT.
   * Must be called after session completion or timeout.
   * Designed to prevent any previous patient data from being visible to the
   * next patient walking up to the kiosk.
   */
  resetSession: () => void
}

const EMPTY_SESSION: KioskSession = {
  sessionId: null,
  sessionHash: null,
  step: 'ATTRACT',
  status: 'idle',
  language: null,
  lastActivityAt: null,
  startedAt: null,
  patientRef: null,
  patientData: null,
  intakeAnswers: {},
  documents: [],
  encounterRef: null,
  isReturningPatient: null,
}

export const useKioskStore = create<KioskStore>((set) => ({
  ...EMPTY_SESSION,

  beginSession: () =>
    set({
      status: 'active',
      step: 'LANGUAGE',
      startedAt: Date.now(),
      lastActivityAt: Date.now(),
      // Clear any stale refs from a previous session
      sessionId: null,
      sessionHash: null,
      patientRef: null,
      patientData: null,
      intakeAnswers: {},
      documents: [],
      encounterRef: null,
      isReturningPatient: null,
      language: null,
    }),

  setLanguage: (language) => set({ language, lastActivityAt: Date.now() }),

  advanceStep: (step) => set({ step, lastActivityAt: Date.now() }),

  setStatus: (status) => set({ status }),

  updateActivity: () => set({ lastActivityAt: Date.now() }),

  setSessionRefs: (sessionId, sessionHash) => set({ sessionId, sessionHash }),

  setPatientRef: (patientRef, isReturningPatient) =>
    set({ patientRef, isReturningPatient, lastActivityAt: Date.now() }),

  setPatientData: (patientData, isReturningPatient) =>
    set({
      patientData,
      patientRef: patientData?.id ?? (patientData ? `pat-${Date.now()}` : null),
      isReturningPatient,
      lastActivityAt: Date.now(),
    }),

  setIntakeAnswer: (key, value) =>
    set((state) => ({
      intakeAnswers: { ...state.intakeAnswers, [key]: value },
      lastActivityAt: Date.now(),
    })),

  addDocument: (doc) =>
    set((state) => ({
      documents: [...state.documents, doc],
      lastActivityAt: Date.now(),
    })),

  removeDocument: (docId) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== docId),
      lastActivityAt: Date.now(),
    })),

  setEncounterRef: (encounterRef) =>
    set({ encounterRef, lastActivityAt: Date.now() }),

  resetSession: () =>
    set({
      ...EMPTY_SESSION,
      // Brief 'reset' status to allow the shell to show privacy-reset animation
      status: 'reset',
    }),
}))
