import type {
  Patient, Encounter, ClinicalFact, ClinicalConflict, MedicalDocument,
  TimelineEvent, RedFlagAlert, CompletenessEntry,
  TriageQueueEntry, AuditEvent, IntegrationStatus, AdminMetrics, Question
} from '@/types'

// ─── Demo Patients ────────────────────────────────────────────────────────

export const DEMO_PATIENTS: Patient[] = [
  {
    id: 'pat-001',
    abhaNumber: '12-3456-7890-1234',
    name: 'Dhananjay Patil',
    age: 67,
    sex: 'M',
    phone: '9876543210',
    preferredLanguage: 'mr',
    createdAt: '2026-08-15T08:00:00Z',
  },
  {
    id: 'pat-002',
    name: 'Priya Menon',
    age: 42,
    sex: 'F',
    phone: '9876541234',
    preferredLanguage: 'en',
    createdAt: '2026-08-15T10:20:00Z',
  },
  {
    id: 'pat-003',
    name: 'Ramesh Kumar',
    age: 58,
    sex: 'M',
    preferredLanguage: 'hi',
    createdAt: '2026-08-15T09:00:00Z',
  },
  {
    id: 'pat-004',
    name: 'Sunita Sharma',
    age: 45,
    sex: 'F',
    preferredLanguage: 'hi',
    createdAt: '2026-08-15T09:30:00Z',
  },
  {
    id: 'pat-005',
    name: 'Aisha Khan',
    age: 32,
    sex: 'F',
    preferredLanguage: 'ur',
    createdAt: '2026-08-15T10:00:00Z',
  },
]

// ─── Demo Encounters ──────────────────────────────────────────────────────

export const DEMO_ENCOUNTERS: Encounter[] = [
  {
    id: 'enc-001',
    patientId: 'pat-001',
    patient: DEMO_PATIENTS[0],
    department: 'Internal Medicine',
    encounterType: 'OPD_ALLOPATHIC',
    state: 'READY_FOR_REVIEW',
    tokenNumber: 'A-028',
    createdAt: '2026-08-15T10:14:00Z',
  },
  {
    id: 'enc-002',
    patientId: 'pat-002',
    patient: DEMO_PATIENTS[1],
    department: 'Internal Medicine',
    encounterType: 'OPD_ALLOPATHIC',
    state: 'UNDER_PHYSICIAN_REVIEW',
    tokenNumber: 'A-023',
    createdAt: '2026-08-15T10:22:00Z',
  },
  {
    id: 'enc-003',
    patientId: 'pat-003',
    patient: DEMO_PATIENTS[2],
    department: 'Internal Medicine',
    encounterType: 'OPD_ALLOPATHIC',
    state: 'READY_FOR_REVIEW',
    tokenNumber: 'A-031',
    createdAt: '2026-08-15T09:10:00Z',
  },
  {
    id: 'enc-004',
    patientId: 'pat-004',
    patient: DEMO_PATIENTS[3],
    department: 'AYUSH OPD',
    encounterType: 'OPD_AYUSH',
    state: 'PROCESSING_DOCUMENTS',
    tokenNumber: 'AY-014',
    createdAt: '2026-08-15T09:30:00Z',
  },
  {
    id: 'enc-005',
    patientId: 'pat-005',
    patient: DEMO_PATIENTS[4],
    department: 'Internal Medicine',
    encounterType: 'OPD_ALLOPATHIC',
    state: 'INTERVIEWING',
    tokenNumber: 'A-042',
    createdAt: '2026-08-15T10:00:00Z',
  },
]

// ─── Demo Clinical Facts (for enc-001 / Dhananjay Patil) ──────────────────

export const DEMO_FACTS_ENC001: ClinicalFact[] = [
  {
    id: 'fact-001', patientId: 'pat-001', encounterId: 'enc-001',
    factType: 'SYMPTOM', domain: 'HPI', fieldName: 'chief_complaint',
    rawValue: 'Epigastric pain, 3 months duration',
    sourceType: 'INTERVIEW', sourceId: 'sess-001',
    confidence: 0.87, confidenceTier: 3,
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'RELATIVE', createdAt: '2026-08-15T10:24:00Z',
  },
  {
    id: 'fact-002', patientId: 'pat-001', encounterId: 'enc-001',
    factType: 'MEDICATION', domain: 'MEDICATIONS', fieldName: 'medication_name',
    rawValue: 'Metformin 500 mg twice daily',
    normalizedValue: 'Metformin', valueUnit: 'mg',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-001',
    sourceDocumentId: 'doc-001', sourcePage: 1,
    sourceText: 'Tab. Metformin 500mg BID',
    confidence: 0.94, confidenceTier: 2, ocrConfidence: 0.94,
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'UNKNOWN', createdAt: '2026-08-15T10:31:00Z',
  },
  {
    id: 'fact-003', patientId: 'pat-001', encounterId: 'enc-001',
    factType: 'MEDICATION', domain: 'MEDICATIONS', fieldName: 'medication_name',
    rawValue: 'Amlodipine 5 mg once daily',
    normalizedValue: 'Amlodipine', valueUnit: 'mg',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-001',
    sourceDocumentId: 'doc-001', sourcePage: 1,
    confidence: 0.91, confidenceTier: 2, ocrConfidence: 0.91,
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'UNKNOWN', createdAt: '2026-08-15T10:31:00Z',
  },
  {
    id: 'fact-004', patientId: 'pat-001', encounterId: 'enc-001',
    factType: 'LAB_RESULT', domain: 'INVESTIGATIONS', fieldName: 'HbA1c',
    rawValue: '8.4', normalizedValue: '8.4', valueUnit: '%',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-002',
    sourceDocumentId: 'doc-002', sourcePage: 2,
    sourceText: 'HbA1c — 8.4%',
    confidence: 0.97, confidenceTier: 2, ocrConfidence: 0.97,
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDate: '2025-03-14', eventDatePrecision: 'EXACT',
    createdAt: '2026-08-15T10:32:00Z',
  },
  {
    id: 'fact-005', patientId: 'pat-001', encounterId: 'enc-001',
    factType: 'ALLERGY', domain: 'ALLERGIES', fieldName: 'allergy_substance',
    rawValue: 'No known allergy',
    sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-001',
    sourceDocumentId: 'doc-001', sourcePage: 1,
    confidence: 0.91, confidenceTier: 2, ocrConfidence: 0.91,
    verificationStatus: 'UNVERIFIED', conflictStatus: 'IN_CONFLICT',
    eventDatePrecision: 'UNKNOWN', createdAt: '2026-08-15T10:31:00Z',
  },
  {
    id: 'fact-006', patientId: 'pat-001', encounterId: 'enc-001',
    factType: 'ALLERGY', domain: 'ALLERGIES', fieldName: 'allergy_substance',
    rawValue: 'Penicillin',
    sourceType: 'INTERVIEW', sourceId: 'sess-001',
    confidence: 0.89, confidenceTier: 3,
    verificationStatus: 'UNVERIFIED', conflictStatus: 'IN_CONFLICT',
    eventDatePrecision: 'UNKNOWN', createdAt: '2026-08-15T10:26:00Z',
  },
  {
    id: 'fact-007', patientId: 'pat-001', encounterId: 'enc-001',
    factType: 'SYMPTOM_QUALITY', domain: 'HPI', fieldName: 'pain_character',
    rawValue: 'Burning, sharp sensation aggravated after meals',
    sourceType: 'INTERVIEW', sourceId: 'sess-001',
    confidence: 0.92, confidenceTier: 3,
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'RELATIVE', createdAt: '2026-08-15T10:25:00Z',
  },
  {
    id: 'fact-008', patientId: 'pat-001', encounterId: 'enc-001',
    factType: 'LIFESTYLE', domain: 'AYUSH', fieldName: 'ahara_vihara',
    rawValue: 'Ahara: Irregular timing, spicy/fried food; Vihara: High stress, disturbed sleep',
    sourceType: 'INTERVIEW', sourceId: 'sess-001',
    confidence: 0.88, confidenceTier: 3,
    verificationStatus: 'UNVERIFIED', conflictStatus: 'NO_CONFLICT',
    eventDatePrecision: 'RELATIVE', createdAt: '2026-08-15T10:27:00Z',
  },
]

// ─── Demo Conflict ─────────────────────────────────────────────────────────

export const DEMO_CONFLICTS_ENC001: ClinicalConflict[] = [
  {
    id: 'conf-001',
    patientId: 'pat-001',
    encounterId: 'enc-001',
    conflictType: 'VALUE_MISMATCH',
    fieldLabel: 'Allergy Status',
    factA: DEMO_FACTS_ENC001[4], // No known allergy (document)
    factB: DEMO_FACTS_ENC001[5], // Penicillin (interview)
    detectedAt: '2026-08-15T10:33:00Z',
    resolutionStatus: 'PENDING',
  },
]

// ─── Demo Documents ────────────────────────────────────────────────────────

export const DEMO_DOCUMENTS_ENC001: MedicalDocument[] = [
  {
    id: 'doc-001',
    encounterId: 'enc-001',
    patientId: 'pat-001',
    documentType: 'PRESCRIPTION',
    originalFilename: 'Prescription_Jan2025.jpg',
    qualityScore: 0.94,
    hasHandwriting: false,
    pageCount: 1,
    status: 'PROCESSED',
    ocrConfidence: 0.94,
    extractedFactsCount: 4,
    uploadedAt: '2026-08-15T10:28:00Z',
    processedAt: '2026-08-15T10:31:00Z',
  },
  {
    id: 'doc-002',
    encounterId: 'enc-001',
    patientId: 'pat-001',
    documentType: 'LAB_REPORT',
    originalFilename: 'Lab_Report_March_2025.jpg',
    qualityScore: 0.68,
    qualityIssues: ['Low contrast'],
    hasHandwriting: false,
    pageCount: 3,
    status: 'PROCESSED',
    ocrConfidence: 0.68,
    extractedFactsCount: 5,
    uploadedAt: '2026-08-15T10:29:00Z',
    processedAt: '2026-08-15T10:32:00Z',
  },
  {
    id: 'doc-003',
    encounterId: 'enc-001',
    patientId: 'pat-001',
    documentType: 'DISCHARGE_SUMMARY',
    originalFilename: 'Discharge_Summary_AIIMS_2022.pdf',
    qualityScore: 0.91,
    hasHandwriting: false,
    pageCount: 4,
    status: 'PROCESSED',
    ocrConfidence: 0.91,
    extractedFactsCount: 3,
    uploadedAt: '2026-08-15T10:30:00Z',
    processedAt: '2026-08-15T10:33:00Z',
  },
]

// ─── Demo Timeline ─────────────────────────────────────────────────────────

export const DEMO_TIMELINE_ENC001: TimelineEvent[] = [
  { id: 'tl-001', eventDate: '2010-01-01', datePrecision: 'APPROXIMATE', title: 'Appendectomy', detail: 'AIIMS Delhi — Discharge Summary 2010', sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-003' },
  { id: 'tl-002', eventDate: '2018-01-01', datePrecision: 'APPROXIMATE', title: 'Quit smoking', detail: 'Patient reported — 20 pack-year history', sourceType: 'INTERVIEW', sourceId: 'sess-001' },
  { id: 'tl-003', eventDate: '2019-01-01', datePrecision: 'APPROXIMATE', title: 'Type 2 Diabetes Mellitus diagnosed', sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-001' },
  { id: 'tl-004', eventDate: '2022-06-01', datePrecision: 'APPROXIMATE', title: 'Admitted — AIIMS Delhi (severe anemia)', sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-003' },
  { id: 'tl-005', eventDate: '2025-01-01', datePrecision: 'APPROXIMATE', title: 'Hemoglobin 11.2 g/dL (low)', sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-002' },
  { id: 'tl-006', eventDate: '2025-03-14', datePrecision: 'EXACT', title: 'HbA1c 8.4% · Fasting glucose 148 mg/dL', detail: 'Both above normal range', sourceType: 'DOCUMENT_EXTRACT', sourceId: 'doc-002' },
  { id: 'tl-007', eventDate: '2026-08-15', datePrecision: 'EXACT', title: 'Allergy conflict detected — Penicillin', isConflict: true, sourceType: 'INTERVIEW', sourceId: 'sess-001' },
]

// ─── Demo Red Flag (for enc-002 / Priya Menon) ────────────────────────────

export const DEMO_RED_FLAG_ENC002: RedFlagAlert = {
  id: 'alert-001',
  encounterId: 'enc-002',
  patientId: 'pat-002',
  ruleId: 'CARDIAC_001',
  ruleName: 'Possible cardiac event',
  triggerText: 'Mujhe seene mein bahut dard hai, aur dard baayein haath mein bhi ja raha hai.',
  triggerLanguage: 'hi',
  triggerTextTranslated: 'I have severe chest pain, and the pain is also going to my left arm.',
  severity: 'HIGH',
  status: 'PENDING',
  alertedAt: '2026-08-15T10:31:00Z',
}

// ─── Demo Completeness ─────────────────────────────────────────────────────

export const DEMO_COMPLETENESS_ENC001: CompletenessEntry[] = [
  { domain: 'CHIEF_COMPLAINT', label: 'Chief Complaint', status: 'COLLECTED', sourceTiers: [3] },
  { domain: 'HPI', label: 'History of Present Illness', status: 'COLLECTED', sourceTiers: [3] },
  { domain: 'MEDICATIONS', label: 'Current Medications', status: 'COLLECTED', sourceTiers: [2, 3] },
  { domain: 'ALLERGIES', label: 'Allergies', status: 'CONFLICT', sourceTiers: [2, 3] },
  { domain: 'PMH', label: 'Past Medical History', status: 'PARTIAL', sourceTiers: [2, 3] },
  { domain: 'SURGICAL', label: 'Surgical History', status: 'COLLECTED', sourceTiers: [2] },
  { domain: 'FAMILY', label: 'Family History', status: 'NOT_COLLECTED' },
  { domain: 'SOCIAL', label: 'Social History', status: 'PARTIAL', sourceTiers: [3] },
  { domain: 'ROS', label: 'Review of Systems', status: 'PARTIAL', sourceTiers: [3] },
  { domain: 'AYUSH', label: 'AYUSH Assessment', status: 'NOT_APPLICABLE' },
]

// ─── Demo Triage Queue ─────────────────────────────────────────────────────

export const DEMO_TRIAGE_QUEUE: TriageQueueEntry[] = [
  {
    encounterId: 'enc-002', patient: DEMO_PATIENTS[1], tokenNumber: '23',
    chiefComplaint: 'Chest pain, breathlessness', arrivedAt: '2026-08-15T10:22:00Z',
    waitMinutes: 9, sessionState: 'UNDER_PHYSICIAN_REVIEW',
    hasActiveAlert: true, activeAlert: DEMO_RED_FLAG_ENC002,
    completeness: [],
  },
  {
    encounterId: 'enc-001', patient: DEMO_PATIENTS[0], tokenNumber: '31',
    chiefComplaint: 'Epigastric pain, 3 months', arrivedAt: '2026-08-15T10:14:00Z',
    waitMinutes: 28, sessionState: 'READY_FOR_REVIEW',
    hasActiveAlert: false, completeness: DEMO_COMPLETENESS_ENC001,
  },
  {
    encounterId: 'enc-003', patient: DEMO_PATIENTS[2], tokenNumber: '28',
    chiefComplaint: 'Knee pain, fatigue', arrivedAt: '2026-08-15T09:10:00Z',
    waitMinutes: 52, sessionState: 'READY_FOR_REVIEW',
    hasActiveAlert: false, completeness: [],
  },
]

// ─── Demo Admin Metrics ───────────────────────────────────────────────────

export const DEMO_ADMIN_METRICS: AdminMetrics = {
  encountersToday: 38,
  encountersCompleted: 24,
  encountersInProgress: 9,
  alertsToday: 3,
  avgIntakeDurationSec: 872,
  ayushSessions: 6,
  documentsProcessed: 41,
  documentsProcessingNow: 4,
  documentsFailed: 2,
  avgOcrConfidence: 0.83,
}

// ─── Demo Integration Status ──────────────────────────────────────────────

export const DEMO_INTEGRATIONS: IntegrationStatus[] = [
  { name: 'Bhashini ASR', description: 'Speech-to-text — primary', status: 'OPERATIONAL', latencyMs: 214, uptimePercent: 99.8, lastChecked: '2026-08-15T10:42:00Z' },
  { name: 'Whisper ASR (Fallback)', description: 'Speech-to-text fallback', status: 'OPERATIONAL', latencyMs: 480, uptimePercent: 99.9, lastChecked: '2026-08-15T10:42:00Z' },
  { name: 'Bhashini TTS', description: 'Text-to-speech', status: 'OPERATIONAL', latencyMs: 320, uptimePercent: 99.7, lastChecked: '2026-08-15T10:42:00Z' },
  { name: 'Google Document AI', description: 'OCR + extraction', status: 'DEGRADED', latencyMs: 2100, uptimePercent: 98.2, lastChecked: '2026-08-15T10:42:00Z', lastError: '502 Bad Gateway — 10:21 AM' },
  { name: 'ABDM Sandbox', description: 'ABHA identity lookup', status: 'DEGRADED', latencyMs: 890, uptimePercent: 95.1, lastChecked: '2026-08-15T10:42:00Z' },
  { name: 'FHIR Export Service', description: 'Internal FHIR generation', status: 'OPERATIONAL', latencyMs: 54, uptimePercent: 100, lastChecked: '2026-08-15T10:42:00Z' },
  { name: 'HIS Adapter (Mock)', description: 'Hospital system sync', status: 'OPERATIONAL', latencyMs: 412, uptimePercent: 100, lastChecked: '2026-08-15T10:42:00Z' },
]

// ─── Demo Audit Events ─────────────────────────────────────────────────────

export const DEMO_AUDIT_EVENTS: AuditEvent[] = [
  { id: 'evt-001', timestamp: '2026-08-15T10:45:02Z', eventType: 'CLINICAL', description: 'Case approved — Dhananjay Patil (ENC-0829)', actor: 'Dr. R. Mehta', patientName: 'D. Patil', patientId: 'pat-001', resourceId: 'enc-001' },
  { id: 'evt-002', timestamp: '2026-08-15T10:42:33Z', eventType: 'INTEGRATION', description: 'HIS sync successful — ENC-0829-1042', actor: 'System', patientId: 'pat-001', resourceId: 'HIS-ENC-0829' },
  { id: 'evt-003', timestamp: '2026-08-15T10:38:47Z', eventType: 'TRIAGE', description: 'Alert acknowledged — Assessed stable', actor: 'Nurse S. Kumar', patientName: 'P. Menon', patientId: 'pat-002', resourceId: 'alert-001' },
  { id: 'evt-004', timestamp: '2026-08-15T10:38:12Z', eventType: 'TRIAGE', description: 'Triage alert triggered — CARDIAC_001', actor: 'System', patientName: 'P. Menon', patientId: 'pat-002', resourceId: 'alert-001' },
  { id: 'evt-005', timestamp: '2026-08-15T10:26:43Z', eventType: 'CLINICAL', description: 'Conflict detected — allergy status', actor: 'System', patientId: 'pat-001', resourceId: 'conf-001' },
  { id: 'evt-006', timestamp: '2026-08-15T10:24:00Z', eventType: 'CLINICAL', description: 'Interview session started', actor: 'System', patientId: 'pat-001', resourceId: 'sess-001' },
  { id: 'evt-007', timestamp: '2026-08-15T10:22:15Z', eventType: 'CLINICAL', description: 'Consent recorded — English', actor: 'System', patientId: 'pat-002', resourceId: 'cons-001' },
  { id: 'evt-008', timestamp: '2026-08-15T10:14:32Z', eventType: 'AUTH', description: 'Physician login', actor: 'Dr. R. Mehta', resourceId: 'auth-001' },
]

// ─── Demo Interview Questions ─────────────────────────────────────────────

export const DEMO_QUESTIONS: Question[] = [
  {
    id: 'q-001', code: 'HPI_ONSET_DURATION', domain: 'HPI', pathway: 'ABDOMINAL_PAIN',
    text: { en: 'How long have you had this pain?', hi: 'यह दर्द आपको कितने समय से है?', mr: 'हे दुखणे तुम्हाला किती दिवसांपासून आहे?' },
    questionType: 'SINGLE_CHOICE',
    options: [
      { id: 'less-1w', label: { en: 'Less than 1 week', hi: '1 हफ्ते से कम', mr: '1 आठवड्यापेक्षा कमी' } },
      { id: '1-4w', label: { en: '1–4 weeks', hi: '1–4 हफ्ते', mr: '1–4 आठवडे' } },
      { id: '1-3m', label: { en: '1–3 months', hi: '1–3 महीने', mr: '1–3 महिने' } },
      { id: 'gt-3m', label: { en: 'More than 3 months', hi: '3 महीने से अधिक', mr: '3 महिन्यांपेक्षा जास्त' } },
    ],
    isRedFlagRelevant: false, isAyush: false,
  },
  {
    id: 'q-002', code: 'HPI_SEVERITY', domain: 'HPI',
    text: { en: 'How severe is the pain on a scale of 1 to 10?', hi: 'दर्द की तीव्रता 1 से 10 के पैमाने पर कितनी है?', mr: 'वेदना 1 ते 10 च्या प्रमाणात किती तीव्र आहे?' },
    questionType: 'NUMERIC',
    isRedFlagRelevant: false, isAyush: false,
  },
  {
    id: 'q-003', code: 'RED_FLAG_CHEST_RADIATION', domain: 'HPI', pathway: 'CHEST_PAIN',
    text: { en: 'Does the pain spread to your arm, jaw, or neck?', hi: 'क्या दर्द आपके हाथ, जबड़े या गर्दन तक फैलता है?' },
    questionType: 'SINGLE_CHOICE',
    options: [
      { id: 'yes', label: { en: 'Yes', hi: 'हाँ' } },
      { id: 'no', label: { en: 'No', hi: 'नहीं' } },
      { id: 'not-sure', label: { en: "I'm not sure", hi: 'मुझे नहीं पता' } },
    ],
    isRedFlagRelevant: true, isAyush: false,
  },
  {
    id: 'q-004', code: 'AYUSH_AHARA_FREQUENCY', domain: 'AYUSH', isAyush: true,
    text: { en: 'How often do you eat, and at what times?', hi: 'आप आमतौर पर कब और कितनी बार खाना खाते हैं?', mr: 'तुम्ही साधारणपणे कधी आणि किती वेळा जेवता?' },
    questionType: 'SINGLE_CHOICE',
    options: [
      { id: 'two-meals', label: { en: '2 main meals, sometimes breakfast', hi: '2 मुख्य भोजन, कभी-कभी नाश्ता' } },
      { id: 'three-meals', label: { en: '3 regular meals at fixed times', hi: '3 नियमित भोजन तय समय पर' } },
      { id: 'irregular', label: { en: 'Irregular — no fixed times', hi: 'अनियमित — कोई निश्चित समय नहीं' } },
      { id: 'one-meal', label: { en: '1 meal a day only', hi: 'दिन में केवल 1 बार' } },
    ],
    isRedFlagRelevant: false,
  },
]
