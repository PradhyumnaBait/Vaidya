/**
 * Vaidya Kiosk — Service Layer
 *
 * Clean API boundary for kiosk-specific backend operations.
 *
 * Architecture:
 * - All kiosk UI code interacts with THIS service, not the mock adapter directly
 * - When the backend is ready, only this file changes — not the UI
 * - Integration points are clearly marked with TODO comments
 * - Phase 1: delegates to the existing mock adapter where appropriate
 *
 * Backend contract (medikiosk-backend):
 * - Primary: WebSocket at ws://<host>/api/v1/ws/{session_id}
 * - REST fallback: GET /session/{session_id}/status
 * - Session init: POST /session/init (TODO: not yet implemented in backend)
 * - Patient lookup: existing mock adapter methods
 */

import { apiClient } from '@/lib/api-client'
import type { Patient } from '@/types'
import type { KioskSession } from '@/types/kiosk'

// ── Session Operations ─────────────────────────────────────────────────────────

export interface InitSessionResult {
  sessionId: string
  sessionHash: string
}

export interface PatientLookupResult {
  patient: Patient | null
  found: boolean
}

export const kioskService = {
  /**
   * Initialize a new kiosk session.
   *
   * TODO (Phase 2): Replace with POST /api/v1/session/init to the medikiosk-backend.
   * The backend will:
   * 1. Generate a session_id (UUID)
   * 2. Compute session_hash = SHA-256(session_id)
   * 3. Initialize BeliefState in Redis with FSM state = IDLE
   * 4. Return { session_id, session_hash }
   *
   * Current: generates a client-side session ID as a placeholder.
   */
  async initSession(): Promise<InitSessionResult> {
    // Simulated delay representing backend session creation
    await new Promise((r) => setTimeout(r, 150))

    const sessionId = `ks-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    // In production: session_hash = await crypto.subtle.digest('SHA-256', ...)
    const sessionHash = `hash-${sessionId}`

    return { sessionId, sessionHash }
  },

  /**
   * Lookup a patient by ABHA number.
   *
   * TODO (Phase 2): Route through the medikiosk-backend patient lookup API.
   * Current: delegates to mock adapter.
   */
  async lookupByABHA(abha: string): Promise<PatientLookupResult> {
    const patient = await apiClient.lookupPatientByABHA(abha)
    return { patient, found: patient !== null }
  },

  /**
   * Lookup a patient by phone number.
   *
   * TODO (Phase 2): Route through the medikiosk-backend patient lookup API.
   * Current: delegates to mock adapter.
   */
  async lookupByPhone(phone: string): Promise<PatientLookupResult> {
    const patient = await apiClient.lookupPatientByPhone(phone)
    return { patient, found: patient !== null }
  },

  /**
   * Register a new patient at the kiosk.
   *
   * TODO (Phase 2): POST to backend patient creation endpoint.
   * Current: delegates to mock adapter.
   */
  async registerNewPatient(data: Partial<Patient>): Promise<Patient> {
    return apiClient.createPatient(data)
  },

  /**
   * Create a new encounter for an existing patient.
   *
   * TODO (Phase 2): POST to backend encounter creation endpoint.
   * Current: delegates to mock adapter.
   */
  async createEncounter(patientId: string, department: string) {
    return apiClient.createEncounter(patientId, department)
  },

  /**
   * Submit session completion and trigger FHIR synthesis.
   *
   * TODO (Phase 2): Send WebSocket message with FSM event COMPLETE,
   * or POST to /session/{sessionId}/complete.
   * Current: no-op placeholder.
   */
  async completeSession(sessionRef: KioskSession['sessionId']): Promise<void> {
    // TODO: Backend integration
    console.debug('[kioskService] completeSession called for', sessionRef)
    await new Promise((r) => setTimeout(r, 300))
  },

  /**
   * Signal session teardown for privacy reset.
   *
   * TODO (Phase 2): Send WebSocket message SESSION_TEARDOWN or
   * DELETE /session/{sessionId}.
   * Current: no-op placeholder.
   */
  async teardownSession(sessionRef: KioskSession['sessionId']): Promise<void> {
    // TODO: Backend integration — triggers Redis TTL expiry and audit log entry
    console.debug('[kioskService] teardownSession called for', sessionRef)
    await new Promise((r) => setTimeout(r, 100))
  },
}
