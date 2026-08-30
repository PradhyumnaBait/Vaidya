// Vaidya/frontend/src/types/index.ts

export type Role = 'patient' | 'doctor' | 'nursing' | 'admin'
export type Language = 'hi' | 'en' | 'mr' | 'gu' | 'bn' | 'te' | 'ta' | 'kn' | 'ml' | 'pa' | 'or' | 'ur'
export type ConfidenceTier = 1 | 2 | 3 | 4 | 5
export type SourceType = 'INTERVIEW' | 'DOCUMENT_EXTRACT' | 'PHYSICIAN_ENTERED'
export type VerificationStatus = 'UNVERIFIED' | 'PHYSICIAN_VERIFIED' | 'REJECTED'
export type ConflictStatus = 'NO_CONFLICT' | 'IN_CONFLICT' | 'CONFLICT_RESOLVED'
export type DatePrecision = 'EXACT' | 'APPROXIMATE' | 'RELATIVE' | 'UNKNOWN'
export type DomainStatus = 'COLLECTED' | 'PARTIAL' | 'NOT_COLLECTED' | 'CONFLICT' | 'NOT_APPLICABLE'
export type DocumentType = 'PRESCRIPTION' | 'LAB_REPORT' | 'DISCHARGE_SUMMARY' | 'IMAGING' | 'OTHER'
export type DocumentStatus = 'UPLOADED' | 'QUALITY_CHECKED' | 'PROCESSING' | 'PROCESSED' | 'FAILED'
export type AlertSeverity = 'HIGH' | 'MEDIUM' | 'LOW'
export type AlertStatus = 'PENDING' | 'ACKNOWLEDGED' | 'ESCALATED' | 'DISMISSED'
export type EncounterType = 'OPD_ALLOPATHIC' | 'OPD_AYUSH'
export type Modality = 'VOICE' | 'TOUCH' | 'MULTIMODAL'
export type QuestionType = 'FREE_TEXT' | 'SINGLE_CHOICE' | 'MULTI_CHOICE' | 'NUMERIC' | 'DATE'

export type EncounterState =
  | 'INITIATED' | 'IDENTIFIED' | 'CONSENTED' | 'INTERVIEWING'
  | 'INTERVIEW_COMPLETE' | 'PROCESSING_DOCUMENTS' | 'READY_FOR_REVIEW'
  | 'UNDER_PHYSICIAN_REVIEW' | 'CONFLICTS_RESOLVED' | 'PHYSICIAN_APPROVED'
  | 'FHIR_EXPORTED' | 'HIS_SYNCED' | 'COMPLETED'

export interface Patient {
  id: string
  abhaNumber?: string
  abhaId?: string
  name: string
  dateOfBirth?: string
  age?: number
  sex: 'M' | 'F' | 'O' | 'male' | 'female' | 'other'
  gender?: string
  phone?: string
  preferredLanguage: Language
  createdAt?: string
}

export interface Encounter {
  id: string
  patientId: string
  patient?: Patient
  department: string
  encounterType: EncounterType
  state: EncounterState
  tokenNumber: string
  physicianId?: string
  createdAt: string
  completedAt?: string
}

export interface ClinicalFact {
  id: string
  patientId: string
  encounterId: string
  factType: string
  domain: string
  fieldName: string
  rawValue: string
  normalizedValue?: string
  valueUnit?: string
  sourceType: SourceType
  sourceId: string
  sourceDocumentId?: string
  sourcePage?: number
  sourceBoundingBox?: { x1: number; y1: number; x2: number; y2: number }
  sourceText?: string
  confidence: number
  confidenceTier: ConfidenceTier
  ocrConfidence?: number
  verificationStatus: VerificationStatus
  verifiedBy?: string
  verifiedAt?: string
  conflictStatus: ConflictStatus
  eventDate?: string
  eventDatePrecision: DatePrecision
  createdAt: string
}

export interface ClinicalConflict {
  id: string
  patientId: string
  encounterId: string
  conflictType: string
  fieldLabel: string
  factA: ClinicalFact
  factB: ClinicalFact
  detectedAt: string
  resolutionStatus: 'PENDING' | 'RESOLVED_A' | 'RESOLVED_B' | 'RESOLVED_UNCERTAIN'
  resolvedBy?: string
  resolvedAt?: string
  resolutionNote?: string
}

export interface MedicalDocument {
  id: string
  encounterId: string
  patientId: string
  documentType: DocumentType
  originalFilename: string
  qualityScore: number
  qualityIssues?: string[]
  hasHandwriting: boolean
  pageCount: number
  status: DocumentStatus
  ocrConfidence?: number
  extractedFactsCount?: number
  uploadedAt: string
  processedAt?: string
}

export interface TimelineEvent {
  id: string
  eventDate?: string
  datePrecision: DatePrecision
  title: string
  detail?: string
  sourceType: SourceType
  sourceId: string
  factId?: string
  isConflict?: boolean
}

export interface RedFlagAlert {
  id: string
  encounterId: string
  patientId: string
  ruleId: string
  ruleName: string
  triggerText: string
  triggerLanguage: Language
  triggerTextTranslated?: string
  severity: AlertSeverity
  status: AlertStatus
  alertedAt: string
  acknowledgedBy?: string
  acknowledgedAt?: string
  acknowledgmentAction?: 'ESCALATED' | 'STABLE' | 'OPD_APPROPRIATE'
  acknowledgmentNote?: string
}

export interface CompletenessEntry {
  domain: string
  label: string
  status: DomainStatus
  sourceTiers?: ConfidenceTier[]
}

export interface CaseIntelligencePackage {
  id: string
  encounterId: string
  patientId: string
  version: number
  status: 'DRAFT' | 'READY_FOR_REVIEW' | 'PHYSICIAN_APPROVED'
  completeness: CompletenessEntry[]
  aiSummary?: string
  aiSummaryReviewed: boolean
  generatedAt: string
  approvedBy?: string
  approvedAt?: string
}

export interface IntakeSession {
  id: string
  encounterId: string
  language: Language
  modality: Modality
  state: 'ACTIVE' | 'PAUSED' | 'COMPLETE' | 'ABANDONED'
  currentQuestionId?: string
  completeness: Partial<Record<string, number>>
  estimatedMinutesRemaining: number
  progressPercent: number
  startedAt: string
  completedAt?: string
}

export interface QuestionOption {
  id: string
  label: Partial<Record<Language, string>>
}

export interface Question {
  id: string
  code: string
  domain: string
  pathway?: string
  text: Partial<Record<Language, string>>
  questionType: QuestionType
  options?: QuestionOption[]
  isRedFlagRelevant: boolean
  isAyush: boolean
}

export interface TriageQueueEntry {
  encounterId: string
  patient: Patient
  tokenNumber: string
  chiefComplaint: string
  arrivedAt: string
  waitMinutes: number
  sessionState: EncounterState
  hasActiveAlert: boolean
  activeAlert?: RedFlagAlert
  completeness: CompletenessEntry[]
}

export interface AuthUser {
  id: string
  name: string
  role: Role
  department?: string
  languagePreferences: Language[]
}

export interface AdminMetrics {
  encountersToday: number
  encountersCompleted: number
  encountersInProgress: number
  alertsToday: number
  avgIntakeDurationSec: number
  ayushSessions: number
  documentsProcessed: number
  documentsProcessingNow: number
  documentsFailed: number
  avgOcrConfidence: number
}

export interface IntegrationStatus {
  name: string
  description: string
  status: 'OPERATIONAL' | 'DEGRADED' | 'DOWN'
  latencyMs: number
  uptimePercent: number
  lastChecked: string
  lastError?: string
}

export interface AuditEvent {
  id: string
  timestamp: string
  eventType: 'CLINICAL' | 'TRIAGE' | 'AUTH' | 'INTEGRATION' | 'SYSTEM'
  description: string
  actor?: string
  patientName?: string
  patientId?: string
  resourceId: string
}
