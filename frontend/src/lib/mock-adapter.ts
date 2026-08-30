// Simulates API response delay for realistic behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

import {
  DEMO_PATIENTS, DEMO_ENCOUNTERS, DEMO_FACTS_ENC001,
  DEMO_CONFLICTS_ENC001, DEMO_DOCUMENTS_ENC001, DEMO_TIMELINE_ENC001,
  DEMO_RED_FLAG_ENC002, DEMO_COMPLETENESS_ENC001, DEMO_TRIAGE_QUEUE,
  DEMO_ADMIN_METRICS, DEMO_INTEGRATIONS, DEMO_AUDIT_EVENTS,
  DEMO_QUESTIONS,
} from '@/constants/demo-data'
import type {
  Patient, Encounter, ClinicalFact, ClinicalConflict, MedicalDocument,
  TimelineEvent, RedFlagAlert, CompletenessEntry, TriageQueueEntry,
  AdminMetrics, IntegrationStatus, AuditEvent, Question,
} from '@/types'

export const mockAdapter = {
  // ── Patients ──────────────────────────────────────────────────────────
  async getPatient(id: string): Promise<Patient | null> {
    await delay(200)
    return DEMO_PATIENTS.find(p => p.id === id) ?? null
  },
  async lookupPatientByABHA(abha: string): Promise<Patient | null> {
    await delay(400)
    return DEMO_PATIENTS.find(p => p.abhaNumber === abha) ?? null
  },
  async lookupPatientByPhone(phone: string): Promise<Patient | null> {
    await delay(400)
    return DEMO_PATIENTS.find(p => p.phone === phone) ?? null
  },
  async createPatient(data: Partial<Patient>): Promise<Patient> {
    await delay(600)
    return { id: `pat-${Date.now()}`, createdAt: new Date().toISOString(), preferredLanguage: 'hi', sex: 'M', name: 'New Patient', ...data } as Patient
  },

  // ── Encounters ────────────────────────────────────────────────────────
  async getEncounter(id: string): Promise<Encounter | null> {
    await delay(200)
    return DEMO_ENCOUNTERS.find(e => e.id === id) ?? null
  },
  async createEncounter(patientId: string, dept: string): Promise<Encounter> {
    await delay(500)
    return { id: `enc-${Date.now()}`, patientId, department: dept, encounterType: 'OPD_ALLOPATHIC', state: 'INITIATED', tokenNumber: String(Math.floor(Math.random() * 99) + 1), createdAt: new Date().toISOString() }
  },
  async getPatientQueue(): Promise<Encounter[]> {
    await delay(300)
    return DEMO_ENCOUNTERS
  },

  // ── Clinical Facts ─────────────────────────────────────────────────────
  async getFacts(encounterId: string): Promise<ClinicalFact[]> {
    await delay(300)
    if (encounterId === 'enc-001') return DEMO_FACTS_ENC001
    return []
  },
  async updateFact(factId: string, value: string): Promise<ClinicalFact> {
    await delay(400)
    const fact = DEMO_FACTS_ENC001.find(f => f.id === factId)
    if (!fact) throw new Error('Fact not found')
    return { ...fact, rawValue: value, verificationStatus: 'PHYSICIAN_VERIFIED', confidenceTier: 1 }
  },

  // ── Conflicts ──────────────────────────────────────────────────────────
  async getConflicts(encounterId: string): Promise<ClinicalConflict[]> {
    await delay(250)
    if (encounterId === 'enc-001') return DEMO_CONFLICTS_ENC001
    return []
  },
  async resolveConflict(conflictId: string, resolution: 'RESOLVED_A' | 'RESOLVED_B' | 'RESOLVED_UNCERTAIN', note?: string): Promise<void> {
    await delay(400)
    console.log('Conflict resolved:', conflictId, resolution, note)
  },

  // ── Documents ─────────────────────────────────────────────────────────
  async getDocuments(encounterId: string): Promise<MedicalDocument[]> {
    await delay(300)
    if (encounterId === 'enc-001') return DEMO_DOCUMENTS_ENC001
    return []
  },
  async uploadDocument(encounterId: string, file: File, type: string): Promise<MedicalDocument> {
    void type
    await delay(800)
    return {
      id: `doc-${Date.now()}`, encounterId, patientId: 'pat-001',
      documentType: 'OTHER' as const, originalFilename: file.name,
      qualityScore: 0.85, hasHandwriting: false, pageCount: 1,
      status: 'PROCESSING', uploadedAt: new Date().toISOString(),
    }
  },

  // ── Timeline ──────────────────────────────────────────────────────────
  async getTimeline(encounterId: string): Promise<TimelineEvent[]> {
    await delay(350)
    if (encounterId === 'enc-001') return DEMO_TIMELINE_ENC001
    return []
  },

  // ── Red Flags ─────────────────────────────────────────────────────────
  async getRedFlags(encounterId: string): Promise<RedFlagAlert[]> {
    await delay(200)
    if (encounterId === 'enc-002') return [DEMO_RED_FLAG_ENC002]
    return []
  },
  async acknowledgeAlert(alertId: string, action: string, note?: string): Promise<void> {
    await delay(400)
    console.log('Alert acknowledged:', alertId, action, note)
  },

  // ── Interview ─────────────────────────────────────────────────────────
  async getNextQuestion(sessionId: string, lastAnswerId?: string): Promise<Question> {
    await delay(300)
    const idx = lastAnswerId ? 1 : 0
    return DEMO_QUESTIONS[idx % DEMO_QUESTIONS.length]
  },
  async submitAnswer(sessionId: string, questionId: string, answer: string): Promise<void> {
    await delay(250)
    console.log('Answer submitted:', sessionId, questionId, answer)
  },

  // ── Triage ────────────────────────────────────────────────────────────
  async getTriageQueue(): Promise<TriageQueueEntry[]> {
    await delay(300)
    return DEMO_TRIAGE_QUEUE
  },

  // ── Completeness ──────────────────────────────────────────────────────
  async getCompleteness(encounterId: string): Promise<CompletenessEntry[]> {
    await delay(200)
    if (encounterId === 'enc-001') return DEMO_COMPLETENESS_ENC001
    return []
  },

  // ── Approval ──────────────────────────────────────────────────────────
  async approveCase(encounterId: string): Promise<{ fhirBundleId: string; hisEncounterId: string }> {
    void encounterId
    await delay(1200)
    return { fhirBundleId: `fhir-${Date.now()}`, hisEncounterId: `ENC-0829-1042` }
  },

  // ── Admin ─────────────────────────────────────────────────────────────
  async getAdminMetrics(): Promise<AdminMetrics> {
    await delay(300)
    return DEMO_ADMIN_METRICS
  },
  async getIntegrationHealth(): Promise<IntegrationStatus[]> {
    await delay(200)
    return DEMO_INTEGRATIONS
  },
  async getAuditEvents(filters?: { eventType?: string; dateRange?: string }): Promise<AuditEvent[]> {
    void filters
    await delay(350)
    return DEMO_AUDIT_EVENTS
  },
}
