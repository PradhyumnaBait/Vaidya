# 🩺 VAIDYA — MASTER PRODUCT CONTEXT & IMPLEMENTATION SPECIFICATION
## SIH 2026 | Problem Statement ID: SIH26047 | Theme: MedTech / BioTech / HealthTech
### Ministry of Ayush & All India Institute of Ayurveda (AIIA)
**Authoritative Single Source of Truth**

---

# 1. OFFICIAL PROBLEM STATEMENT

### 1.1 Metadata
* **Problem Statement ID:** SIH26047
* **Title:** Patient Case-Taking Software
* **Organization:** Ministry of Ayush
* **Department / Institution:** All India Institute of Ayurveda (AIIA)
* **Theme:** MedTech / BioTech / HealthTech
* **Target Environment:** High-throughput Public Hospital Outpatient Departments (OPDs), Ayurvedic Teaching Hospitals, Community Health Centres (CHCs), and District Hospitals.

### 1.2 The Clinical History-Taking Bottleneck
History taking—the structured elicitation of a patient's presenting complaints, history of present illness (HPI), past medical and surgical history, drug and allergy history, family and personal history, and review of systems—is the foundation of diagnostic medicine, yielding 70–80% of accurate diagnoses before physical examination or laboratory investigations.

In India's overburdened public healthcare institutions, tertiary hospitals register 4,000 to 10,000 OPD patients daily. Consequently, the doctor-to-patient consultation time has collapsed to an unsustainable **2 to 5 minutes per patient** (BMJ Open benchmark for Indian primary care: ~2 minutes). Within this narrow window, a physician must simultaneously elicit history, conduct examination, review messy paper files, formulate a diagnostic plan, prescribe medications, and counsel the patient. This structural constraint leads to:
* Systematic under-elicitation of clinical history.
* Missed comorbidities and adverse drug interaction risks.
* Redundant questioning across repeat hospital visits.
* Physician burnout and preventable diagnostic errors.

### 1.3 The AYUSH Assessment Challenge
Ayurvedic clinical case-taking requires a holistic assessment framework:
* **Trividha Pariksha** (Darshana / Sparshana / Prashna)
* **Ashtavidha Pariksha** (Nadi, Mutra, Mala, Jihva, Shabda, Sparsha, Druk, Akruti)
* **Dashavidha Pariksha** (Prakriti, Vikriti, Sara, Samhanana, Pramana, Satmya, Sattva, Ahara Shakti, Vyayama Shakti, Vaya)
* **Ahara-Vihara Assessment** (Dietary habits, circadian rhythm, lifestyle triggers)
* **Nidana & Samprapti** (Etiological factors and disease pathogenesis)

Capturing this depth manually within a 3-minute OPD encounter is impossible, forcing clinicians to abbreviate the foundational assessment that defines personalized Ayurvedic care.

### 1.4 Records Fragmentation & The First-Mile ABDM Gap
Patients carry unorganized physical paper documents: handwritten prescriptions, private diagnostic lab reports, government hospital discharge summaries, and radiology films. During consultation, physicians spend up to 40% of their consultation time deciphering degraded physical handwriting and disordered records.

While the **Ayushman Bharat Digital Mission (ABDM)** has established national digital health standards (ABHA IDs, Health Information Exchange, FHIR R4 profiles), the **first-mile ingestion problem** remains unsolved: there is no autonomous, patient-facing system that captures structured history and digitizes legacy paper records *before* the patient reaches the consultation desk.

---

# 2. ONE-PARAGRAPH PRODUCT DEFINITION

> **VAIDYA** is an autonomous, multimodal pre-consultation clinical intake and document intelligence platform that enables outpatient hospital patients to self-record their medical history through conversational regional voice and icon-guided touch, scan legacy paper medical records, and synthesize an 11-domain, provenance-tracked, physician-verified clinical summary before entering the doctor's chamber. VAIDYA is **not** a chatbot, telemedicine app, autonomous diagnosis engine, ambient scribe, generic registration kiosk, or standalone OCR scanner; it is a **point-of-intake clinical pre-processor** that bridges patient narration, document evidence, AYUSH lifestyle parameters, and hospital EHR/ABDM interoperability while strictly reserving diagnostic and prescribing authority for licensed physicians.

---

# 3. CORE PRODUCT THESIS

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           PATIENT ARRIVAL                               │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. MULTIMODAL CLINICAL INTAKE (Voice via Bhashini ASR + Large Touch)    │
│    • Elicits Chief Complaint, Onset, Duration, Severity, Character      │
│    • Explores AYUSH Ahara-Vihara, Agni, Koshtha, Sleep, Stress          │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. DOCUMENT INTELLIGENCE (High-Speed Optical Scanner + OCR + NLP)       │
│    • Ingests Prescriptions, Lab Reports, Discharge Summaries            │
│    • Bounding-box entity extraction (Medications, Dosages, Diagnoses)   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 3. CLINICAL INTELLIGENCE SYNTHESIS ENGINE                               │
│    • Longitudinal Chronological Health Timeline Reconstruction          │
│    • 5-Tier Provenance Tracking (Source Attribution & Confidence)       │
│    • Conflict & Contradiction Detection (Patient Report vs Record)      │
│    • Deterministic Red-Flag Triage Detection (Cardiac, Neuro, Sepsis)   │
│    • 11-Domain Intake Completeness Audit                                │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 4. PHYSICIAN-READY CASE CONSOLE & VERIFICATION                          │
│    • Scannable 2×2 Structured Brief delivered to Doctor OPD Queue       │
│    • One-click optical crop inspection & voice transcript playback      │
│    • Physician verification, physical exam notes, and prescription      │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 5. INTEROPERABLE INTEGRATION (ABDM M1/M2/M3 • FHIR R4 • Hospital HIS)   │
│    • DiagnosticReport & Composition Bundles pushed to EHR & Health      │
│      Locker                                                             │
└─────────────────────────────────────────────────────────────────────────┘
```

---

# 4. PRODUCT OBJECTIVES

1. **Reduce Clinical History Bottleneck:** Offload repetitive history elicitation from the physician's 3-minute consultation window to patient-facing self-service intake.
2. **First-Mile Document Digitization:** Extract, structure, and chronologically arrange paper prescriptions, lab reports, and discharge summaries prior to examination.
3. **India-First Accessibility:** Provide barrier-free access for illiterate, elderly, and rural patients through 6+ Indian languages (Hindi, Marathi, Gujarati, Tamil, Telugu, English) with voice-guided interaction.
4. **Holistic AYUSH Integration:** Systematically capture Dashavidha Pariksha, Ahara (dietary regimen), Vihara (lifestyle), Agni, and Koshtha parameters without increasing doctor burden.
5. **Source-First Provenance & Explainability:** Track every clinical fact back to its exact origin (spoken transcript offset or optical bounding-box crop on scanned paper).
6. **Contradiction & Discrepancy Highlighting:** Detect and surface conflicts between patient narration and historical records (e.g., reported allergies vs paper prescriptions) for physician adjudication.
7. **Triage Safety & Acute Red-Flag Escalation:** Automatically flag life-threatening symptoms (chest pain, stroke signs, severe dyspnea) to nursing staff in real time without asserting autonomous medical diagnoses.
8. **National Interoperability:** Support ABHA ID creation/linking, FHIR R4 standard data modeling, and ABDM Milestone 1/2/3 compliance.
9. **Continuity of Care:** Provide patients with a simplified personal health record portal linked to their ABHA account.
10. **Zero Clinical Hallucination Risk:** Enforce deterministic extraction and strictly require licensed physician verification before committing records to the hospital EHR.

---

# 5. USER ROLES & PERMISSIONS

### 5.1 Patient
* **Persona:** Outpatient visitor, potentially elderly, non-English literate, accompanied by family, carrying paper files.
* **Goals:** Register quickly, report symptoms in mother tongue, scan prior papers, obtain OPD token, and view prescription afterwards.
* **Permissions & Actions:** Create/link ABHA, speak/touch symptom responses, scan documents, confirm intake review, view own token and prescriptions in Patient Portal.
* **Restricted Data:** Cannot view internal clinical triage notes, other patients' files, raw unverified NLP confidence matrices, or hospital administrative metrics.

### 5.2 Doctor / Physician
* **Persona:** OPD Consultant or Medical Officer managing 80–120 patients per shift.
* **Goals:** Comprehend incoming patient's clinical situation in under 10 seconds, inspect source evidence, adjudicate conflicts, record exam notes, and issue prescriptions.
* **Permissions & Actions:** View departmental queue, review synthesized AI case brief, inspect source crops/audio transcripts, resolve clinical conflicts, edit clinical facts, record examination notes, sign and finalize consultations, generate electronic prescriptions, and trigger FHIR EHR sync.
* **Restricted Data:** Cannot modify system-wide AI model weights, audit logs, or hospital-wide infrastructure settings.

### 5.3 Nursing / Triage Staff
* **Persona:** OPD Staff Nurse or Triage Officer stationed at the entrance/vitals desk.
* **Goals:** Monitor kiosk queue flow, identify urgent red flags, capture vital signs, and guide distressed patients.
* **Permissions & Actions:** View live intake queue, receive real-time red-flag alerts, acknowledge and escalate priority cardiac/stroke cases, enter station vitals (BP, SpO2, Pulse, Temp), and monitor kiosk hardware status.
* **Restricted Data:** Cannot finalize diagnostic summaries or sign prescriptions.

### 5.4 Administrator / IT Officer
* **Persona:** Hospital Medical Superintendent, Informatics Officer, or Systems Admin.
* **Goals:** Ensure kiosk hardware availability, monitor OCR/ASR pipeline latencies, review ABDM bridge health, and inspect audit logs.
* **Permissions & Actions:** View aggregate OPD metrics, inspect API integration health (Bhashini, OCR, ABDM, HIS), search tamper-evident audit trail, manage staff accounts, and configure clinical pathways.
* **Restricted Data:** Cannot access unmasked patient clinical narratives or alter clinical decisions.

---

# 6. APPLICATION SURFACES & RUNTIME TOPOLOGY

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     VAIDYA DUAL-RUNTIME ARCHITECTURE                    │
├────────────────────────────────────┬────────────────────────────────────┤
│ SURFACE 1: STANDALONE KIOSK CLIENT │ SURFACE 2: MAIN CLINICAL SUITE     │
│ Port: http://localhost:5173        │ Port: http://localhost:5180        │
│ Cache Dir: .next-5173              │ Cache Dir: .next-5180              │
├────────────────────────────────────┼────────────────────────────────────┤
│ • KIOSK HARDWARE RUNTIME           │ • HOMEPAGE LANDING & STORY (/)     │
│ • Fullscreen, Large Touch Targets  │ • PATIENT PORTAL (/patient/*)      │
│ • Push-to-Talk Multilingual Voice  │ • CLINICAL LOGIN (/auth/*)         │
│ • Integrated Flatbed/Camera Scanner│ • DOCTOR QUEUE (/doctor/queue)     │
│ • Thermal Token Slip Dispenser     │ • DOCTOR ENCOUNTER (/doctor/*)     │
│ • Strict Kiosk Mode Lockdown       │ • NURSING TRIAGE (/nursing/*)      │
│                                    │ • ADMIN OPERATIONS (/admin/*)      │
└────────────────────────────────────┴────────────────────────────────────┘
```

---

# 7. COMPLETE SCREEN INVENTORY (57 SCREENS)

### 7.1 Patient Surface (P-01 → P-23)
| ID | Screen Name | Route | Purpose | Key Actions |
|---|---|---|---|---|
| **P-01** | Welcome & Language Selection | `/patient/welcome` | Initial attract screen; selects regional language | Select language (6 languages), start intake |
| **P-02** | Patient Identification | `/patient/identify` | Identification method choice | Scan ABHA QR, Enter ABHA/Mobile, New patient |
| **P-03** | New Patient Registration | `/patient/register` | Capture minimal demographics for unregistered users | Enter Name, Age, Sex, Phone; generate temporary ID |
| **P-04** | Returning Patient Confirm | `/patient/confirm` | Confirm profile fetched from ABDM registry | Confirm "Yes, this is me", update contact info |
| **P-05** | Digital Consent (DPDP Act) | `/patient/consent` | Explain data usage and capture biometric/touch consent | Accept terms, view Marathi/Hindi privacy notice |
| **P-06** | Chief Complaint Selection | `/patient/intake/start` | Identify primary reason for visit | Touch common visual body symptom cards, speak |
| **P-07** | Voice Listening Interface | `/patient/intake/interview` | Multilingual speech-to-text intake session | Push-to-talk, real-time waveform, speak freely |
| **P-08** | Transcription Review | `/patient/intake/interview` | Verify speech recognition output | Confirm text, re-record audio, edit by touch |
| **P-09** | Touch Answer Fallback | `/patient/intake/interview` | Alternative touch-based symptom questionnaire | Select duration, severity slider, body region |
| **P-10** | Adaptive Follow-Up Question | `/patient/intake/interview` | Context-aware deep-dive based on prior answers | Answer symptom onset, character, triggers |
| **P-11** | AYUSH Branch Introduction | `/patient/intake/ayush-intro` | Introduce Ayurvedic lifestyle questionnaire | Proceed to Ahara-Vihara assessment |
| **P-12** | AYUSH Ahara-Vihara Intake | `/patient/intake/ayush-question` | Assess Prakriti, Agni, sleep, digestion, diet | Answer standardized Ayurvedic visual cards |
| **P-13** | Intake Progress Checkpoint | `/patient/intake/progress` | Intermediate progress visualization | View completed domains, continue to documents |
| **P-14** | Pause / Resume Session | `/patient/intake/pause` | Secure session lock for restroom or queue movement | Pause session, enter 4-digit PIN to resume |
| **P-15** | Document Upload Prompt | `/patient/documents` | Invite user to scan physical paper documents | Place prescription/lab report on scanner glass |
| **P-16** | Document Scanning Screen | `/patient/documents/scan` | Hardware capture & image rectification | Trigger camera scan, preview document image |
| **P-17** | Document Quality Warning | `/patient/documents/quality` | Alert on blur, skew, or low illumination | Retake scan, proceed anyway, flatten paper |
| **P-18** | Document Processing Screen | `/patient/documents` | Progress animation for OCR & entity extraction | Watch real-time OCR extraction status |
| **P-19** | Digitized Document List | `/patient/documents` | Review list of processed files & detected types | View scanned files, add another document |
| **P-20** | Final Patient Review | `/patient/review` | Summary review before final submission | Confirm symptom summary and attached files |
| **P-21** | Completion & Token Slip | `/patient/review` | Print physical token and display OPD queue number | Collect printed token (e.g. A-028), finish |
| **P-22** | Staff Alerted / Triage Screen| `/patient/intake/pause` | Safety screen when red flag is triggered | Reassurance message: "Staff has been notified" |
| **P-23** | Patient Dashboard (Portal) | `/patient/dashboard` | Post-visit patient portal | View token, active prescriptions, digital files |

### 7.2 Nursing & Triage Surface (T-01 → T-05)
| ID | Screen Name | Route | Purpose | Key Actions |
|---|---|---|---|---|
| **T-01** | Triage Alert Queue | `/nursing/dashboard` | Real-time queue of waiting patients & red flags | Filter priority alerts, search OPD tokens |
| **T-02** | Red Flag Case Detail | `/nursing/dashboard` | Deep-dive into triggered safety alarm | View extracted symptoms (chest pain, SpO2) |
| **T-03** | Acknowledge & Action Modal | `/nursing/dashboard` | Nurse clinical confirmation & fast-track | Mark acknowledged, route to Emergency/Priority |
| **T-04** | Station Vitals Entry | `/nursing/dashboard` | Record baseline physiological vitals | Input BP, Pulse, SpO2, Temperature, Glucose |
| **T-05** | Resolved Alerts Archive | `/nursing/dashboard` | Audit log of handled triage emergencies | Review historical timestamps & nurse initials |

### 7.3 Doctor / Physician Surface (D-01 → D-18)
| ID | Screen Name | Route | Purpose | Key Actions |
|---|---|---|---|---|
| **D-01** | Doctor OPD Queue | `/doctor/queue` | Departmental waiting queue of prepared cases | Filter by status/priority, click `Review Case` |
| **D-02** | Case Overview & Patient Bar | `/doctor/encounter/[id]` | Flagship console top header & identity anchor | View ABHA, Age, Token, start consultation |
| **D-03** | HPI & Clinical Summary Brief| `/doctor/encounter/[id]` | Scannable 2×2 AI-assisted clinical brief | Review chief complaint, duration, character |
| **D-04** | Medications & Allergy Review | `/doctor/encounter/[id]` | Review current drug regimen & allergies | Confirm active drugs, view contraindications |
| **D-05** | Diagnostic Investigations | `/doctor/encounter/[id]` | Historical and recent lab values | View HbA1c, CBC, lipid profiles, trend flags |
| **D-06** | AYUSH Assessment Card | `/doctor/encounter/[id]` | Prakriti, Agni, Koshtha, Ahara-Vihara parameters | Review Ayurvedic profile, dietary factors |
| **D-07** | Longitudinal Health Timeline | `/doctor/encounter/[id]` | Chronological visualization of past encounters | Filter by admissions, prescriptions, surgeries |
| **D-08** | Document Carousel / Grid | `/doctor/encounter/[id]` | Grid of all digitized physical paper documents | Click document to view bounding-box crops |
| **D-09** | Optical Document Viewer | `/doctor/encounter/[id]` | Full-resolution scan viewer with bounding boxes | Zoom, pan, inspect OCR bounding boxes |
| **D-10** | Source Evidence Drawer | `EvidenceDrawer.tsx` | Slide-over drawer with exact source proof | Play Bhashini Marathi audio, inspect crop |
| **D-11** | Conflict Resolution Card | `ConflictCard.tsx` | Side-by-side discrepancy adjudication | Choose Patient Report, Record, or Physical Exam |
| **D-12** | Clinical Fact Editor | `/doctor/encounter/[id]` | Manual physician correction of extracted facts | Edit value, change confidence, add clinical note |
| **D-13** | Red Flag Banner | `RedFlagBanner.tsx` | High-visibility warning for triage conditions | Review safety trigger rationale |
| **D-14** | 11-Domain Completeness Grid | `CompletenessGrid.tsx` | Audit of missing clinical information | Identify unasked domains before consultation |
| **D-15** | AI Synthesis & Diagnosis Plan| `/doctor/encounter/[id]` | Synthesis overview requiring human review | Review pre-consultation brief, enter exam notes |
| **D-16** | Consultation Sign-Off | `/doctor/encounter/[id]` | Finalize consultation and approve summary | Sign case, issue digital prescription |
| **D-17** | FHIR / HIS Sync Pipeline | `/doctor/encounter/[id]` | Background bundling into ABDM FHIR bundle | Trigger ABDM push, view sync receipt |
| **D-18** | Finalized Consultation State| `/doctor/encounter/[id]` | Post-encounter confirmation & prescription print| Print prescription slip, return to OPD queue |

### 7.4 Hospital Administrator Surface (A-01 → A-07)
| ID | Screen Name | Route | Purpose | Key Actions |
|---|---|---|---|---|
| **A-01** | Operations Overview | `/admin` | Executive dashboard for OPD throughput & KPIs | View total intake, completion rate, wait times |
| **A-02** | Intake Analytics | `/admin` | Language distribution & intake duration stats | Analyze Marathi/Hindi usage, drop-off rates |
| **A-03** | Document Pipeline Metrics | `/admin` | OCR accuracy, processing times, error rates | Monitor OCR latency and recognition quality |
| **A-04** | Integration Health Monitor | `/admin` | Live health check for 7 system integrations | Inspect Bhashini, OCR, ABDM, HIS, DB status |
| **A-05** | Tamper-Evident Audit Trail | `/admin` | Searchable log of all user and data events | Filter by actor, patient, timestamp, action |
| **A-06** | Clinical Pathway Config | `/admin` | Configure specialty intake question sets | Adjust cardiology/ayurveda question trees |
| **A-07** | User & Role Management | `/admin` | Manage clinician accounts and access roles | Assign Doctor, Nurse, Admin permissions |

### 7.5 Kiosk Dedicated Surface (K-01 → K-04)
| ID | Screen Name | Route | Purpose | Key Actions |
|---|---|---|---|---|
| **K-01** | Kiosk Attract Screen | `/kiosk` | High-contrast visual attract loop with audio | Touch to start, select language |
| **K-02** | Kiosk ABHA Scanner | `/kiosk/identify` | Hardware-integrated QR scanner interface | Scan national ABHA card via hardware lens |
| **K-03** | Kiosk Touch & Voice Pod | `/kiosk/intake` | High-SPL microphone voice questionnaire | Speak into directional mic, touch options |
| **K-04** | Kiosk Document Feed & Print | `/kiosk/documents` & `/kiosk/review` | Document scanning and thermal ticket print | Feed paper prescriptions, collect token |

---

# 8. MASTER FEATURE INVENTORY

| Feature Category | Feature Name | Target User | Surface | Technical Mechanism | Status | Priority |
|---|---|---|---|---|---|---|
| **Intake** | Multilingual Language Picker | Patient | Kiosk / Web | Bhashini language switcher (6 langs) | **IMPLEMENTED** | P0 |
| **Intake** | ABHA Identification (M1) | Patient | Kiosk / Web | ABDM QR parsing & OTP validation | **IMPLEMENTED** | P0 |
| **Intake** | DPDP Act Digital Consent | Patient | Kiosk / Web | Timestamped consent recording | **IMPLEMENTED** | P0 |
| **Intake** | Push-to-Talk Speech Intake | Patient | Kiosk / Web | Bhashini ASR / Web Speech API fallback | **IMPLEMENTED** | P0 |
| **Intake** | Touch-Based Symptom Fallback| Patient | Kiosk / Web | Visual anatomical symptom selector | **IMPLEMENTED** | P0 |
| **Intake** | Adaptive Questioning Engine | Patient | Kiosk / Web | Rule-based dynamic pathway branching | **IMPLEMENTED** | P0 |
| **Intake** | AYUSH Ahara-Vihara Intake | Patient | Kiosk / Web | Dashavidha Pariksha questionnaire | **IMPLEMENTED** | P1 |
| **Intake** | Session Pause & Resume | Patient | Kiosk / Web | Tokenized local session persistence | **IMPLEMENTED** | P1 |
| **Document** | Hardware Scanner Capture | Patient | Kiosk | Video capture / Canvas rectification | **IMPLEMENTED** | P0 |
| **Document** | Medical OCR Processing | System | Backend | PyTesseract / TrOCR / LayoutLM | **PARTIAL** | P0 |
| **Document** | Entity Extraction | System | Backend | Clinical NER (Meds, Doses, Labs) | **PARTIAL** | P0 |
| **Intelligence** | 5-Tier Provenance System | Doctor | Web | Source bounding box & transcript link | **IMPLEMENTED** | P0 |
| **Intelligence** | Contradiction Detection | Doctor | Web | Rule-based record vs speech matcher | **IMPLEMENTED** | P0 |
| **Intelligence** | 11-Domain Completeness Audit| Doctor | Web | Schema-based missing field detector | **IMPLEMENTED** | P0 |
| **Intelligence** | Longitudinal Health Timeline| Doctor | Web | Chronological event synthesizer | **IMPLEMENTED** | P0 |
| **Safety** | Deterministic Red-Flag Triage| Nurse / Doctor | Web | Hardcoded clinical threshold rules | **IMPLEMENTED** | P0 |
| **Clinician** | OPD Department Queue | Doctor | Web | Real-time triage & intake queue | **IMPLEMENTED** | P0 |
| **Clinician** | 2×2 Scannable Summary Brief| Doctor | Web | Structured HPI visualization | **IMPLEMENTED** | P0 |
| **Clinician** | Optical Evidence Drawer | Doctor | Web | Interactive bounding-box inspector | **IMPLEMENTED** | P0 |
| **Clinician** | Discrepancy Adjudication | Doctor | Web | 3-way decision console (A/B/Exam) | **IMPLEMENTED** | P0 |
| **Clinician** | Physical Exam & Clinical Note| Doctor | Web | Physician observation logging | **IMPLEMENTED** | P0 |
| **Clinician** | Prescription Generation | Doctor | Web | Structured Rx modal with print support| **IMPLEMENTED** | P0 |
| **Operations**| Nurse Priority Triage Board | Nurse | Web | Urgent cardiac/stroke alarm console | **IMPLEMENTED** | P0 |
| **Operations**| Station Vitals Logging | Nurse | Web | Quick physiological parameter entry | **IMPLEMENTED** | P1 |
| **Admin** | Hospital KPI Dashboard | Admin | Web | Aggregate throughput analytics | **IMPLEMENTED** | P1 |
| **Admin** | Integration Health Monitor | Admin | Web | Health-check ping for 7 subsystems | **IMPLEMENTED** | P1 |
| **Admin** | Tamper-Evident Audit Log | Admin | Web | Chronological event search & filter | **IMPLEMENTED** | P0 |
| **Patient** | Health Record Portal | Patient | Web | Post-visit prescription & file viewer | **IMPLEMENTED** | P1 |
| **Ecosystem** | FHIR R4 Bundle Construction | System | Backend | HL7 FHIR Composition/Bundle builder | **PARTIAL** | P1 |
| **Ecosystem** | ABDM Milestone 1/2/3 Bridge| System | Backend | National Health Authority sandbox | **PLANNED** | P2 |

---

# 9. CLINICAL ONTOLOGY & FACT MODEL

### 9.1 Allopathic Clinical Domains
1. **Chief Complaint (CC):** Presenting symptom and primary anatomical location.
2. **History of Present Illness (HPI):** Onset, duration, character, severity (1–10), aggravating/relieving factors.
3. **Past Medical History (PMHx):** Chronic conditions (Diabetes, Hypertension, Tuberculosis, Asthma).
4. **Past Surgical History (PSHx):** Prior surgical interventions, dates, hospitalizations.
5. **Medication History (Rx):** Current drugs, dosages, frequency, adherence.
6. **Allergy History (Allergies):** Drug allergies (Penicillin, Sulfa), food allergies, reaction severity.
7. **Family History (FHx):** Hereditary conditions, cardiovascular disease, malignancy.
8. **Personal & Social History:** Tobacco, alcohol, occupation, sleep hygiene.
9. **Review of Systems (ROS):** Cardiovascular, Respiratory, Gastrointestinal, Neurological, Musculoskeletal.
10. **Diagnostic Investigations:** Lab panels (CBC, LFT, KFT, Blood Sugar, Lipid Profile), imaging reports.
11. **Physiological Vitals:** BP, Pulse, SpO2, Temperature, Respiratory Rate, BMI.

### 9.2 AYUSH Clinical Domains (Dashavidha Pariksha)
* **Prakriti:** Baseline psychosomatic constitution (Vata, Pitta, Kapha, Dwandwaja, Sannipataja).
* **Vikriti:** Current morbidity / doshic imbalance.
* **Sara:** Tissue excellence / qualitative essence of Dhatus.
* **Samhanana:** Body compactness / structural integrity.
* **Pramana:** Anthropometric measurements and bodily proportions.
* **Satmya:** Adaptability and dietary tolerance.
* **Sattva:** Mental strength and psychological resilience.
* **Ahara Shakti:** Digestive capacity (Jarana Shakti) and intake appetite (Abhyavaharana Shakti).
* **Vyayama Shakti:** Physical endurance and capacity for exertion.
* **Vaya:** Age categorization (Bala, Madhyama, Vriddha).
* **Ahara Assessment:** Diet type (Shita, Ushna, Snigdha, Ruksha), meal timing regularity, spicy food intake.
* **Vihara Assessment:** Sleep patterns (Ratri Jagarana, Diva Swapna), stress, physical activity.

### 9.3 Formal Clinical Fact Data Model
```typescript
export interface ClinicalFact {
  id: string
  encounterId: string
  domain: ClinicalDomain
  category: string
  fieldLabel: string
  rawValue: string
  normalizedCode?: string // SNOMED-CT or NAMASTE Code
  codingSystem?: 'SNOMED_CT' | 'ICD_10' | 'NAMASTE' | 'LOINC'
  sourceType: 'INTERVIEW' | 'DOCUMENT' | 'TRIAGE' | 'PHYSICIAN'
  sourceId: string // Document ID or Audio Segment ID
  sourceTextSnippet: string
  sourceBoundingBox?: {
    pageNumber: number
    x: number
    y: number
    width: number
    height: number
  }
  audioOffsetMs?: {
    start: number
    end: number
  }
  confidence: number // 0.00 to 1.00
  provenanceTier: 1 | 2 | 3 | 4 | 5
  verificationStatus: 'UNVERIFIED' | 'PHYSICIAN_VERIFIED' | 'REJECTED'
  conflictStatus: 'NO_CONFLICT' | 'CONFLICT_DETECTED' | 'CONFLICT_RESOLVED'
  createdAt: string
  verifiedAt?: string
  verifiedByPhysicianId?: string
}
```

---

# 10. PROVENANCE & CONFLICT RESOLUTION SYSTEM

### 10.1 The 5-Tier Provenance Hierarchy
To ensure absolute clinical explainability, every extracted clinical fact is visually badged with a standardized provenance tier:

```
┌─────────┬───────────────────┬──────────────┬───────────────────────────────────────────┐
│ TIER    │ PROVENANCE LEVEL  │ COLOR / BADGE│ MEANING & EVIDENCE ORIGIN                 │
├─────────┼───────────────────┼──────────────┼───────────────────────────────────────────┤
│ Tier 1  │ Physician Verified│ Green (#16A34A) Signed by licensed doctor during encounter  │
│ Tier 2  │ Document High Conf│ Blue (#2563EB) Extracted from verified OCR scan (>85% conf)│
│ Tier 3  │ Patient Reported  │ Gray (#71717A) Verbal narration via Bhashini voice intake │
│ Tier 4  │ Document Low Conf │ Amber (#D97706)Degraded handwriting or unverified document│
│ Tier 5  │ Estimated / Model │ Purple(#9333EA)Inferred clinical classification or trend   │
└─────────┴───────────────────┴──────────────┴───────────────────────────────────────────┘
```

### 10.2 Conflict Resolution Mechanism
When patient narration directly contradicts physical documentation (e.g. Patient reports: *"I am allergic to Penicillin"* vs Scanned 2024 prescription states: *"Amoxicillin 500mg tolerated"*), the system:
1. **Never autonomously discards either claim.**
2. Generates an explicit `ClinicalConflict` entity with side-by-side evidence cards.
3. Renders a prominent amber warning card in the physician encounter console.
4. Requires the physician to select one of three explicit clinical determinations:
   * **Resolution A:** Confirm Patient Report (prioritize safety).
   * **Resolution B:** Confirm Document Record (document is authoritative).
   * **Resolution C:** Mark for Physical Examination & Allergy Testing.
5. Logs the physician's identity, timestamp, and optional rationale note to the audit trail.

---

# 11. RED-FLAG TRIAGE SAFETY ENGINE

### 11.1 Safety Principles
* **Not an AI Doctor:** The system never issues diagnostic pronouncements (e.g. never asserts *"Patient has Acute Myocardial Infarction"*).
* **Deterministic Thresholds:** Red flags are triggered by deterministic heuristic rule matching against recognized emergency symptoms:
  * **Cardiovascular:** Crushing retrosternal chest pain radiating to left arm/jaw, diaphoresis.
  * **Neurological:** Sudden onset unilateral facial droop, hemiparesis, acute dysphasia (FAST criteria).
  * **Respiratory:** Acute severe dyspnea, stridor, SpO2 < 90% at triage.
  * **Obstetric / Sepsis:** High fever with altered sensorium, active hemorrhage in pregnancy.
* **Immediate Dual-Channel Escalation:**
  1. **Patient Kiosk Screen (P-22):** Displays calm reassurance (*"Please remain seated. A nurse is coming to assist you immediately."*) without inducing panic.
  2. **Nursing Station Dashboard (T-01):** Triggers flashing visual and auditory priority alert with Token number and symptom parameters.

---

# 12. END-TO-END TECHNICAL ARCHITECTURE

```
                                  PATIENT (Voice & Touch)
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │     Kiosk / Web Intake    │
                               └─────────────┬─────────────┘
                                             │
                      ┌──────────────────────┴──────────────────────┐
                      ▼                                             ▼
       ┌─────────────────────────────┐               ┌─────────────────────────────┐
       │   Speech & Dialogue Engine  │               │ Document Intelligence Engine│
       │   • Bhashini Regional ASR   │               │ • PyTesseract / TrOCR       │
       │   • Language Detection      │               │ • LayoutLM Document Parser  │
       │   • Adaptive Symptom Tree   │               │ • Medical NER & Normalizer  │
       └──────────────┬──────────────┘               └──────────────┬──────────────┘
                      │                                             │
                      └──────────────────────┬──────────────────────┘
                                             ▼
                               ┌───────────────────────────┐
                               │ Clinical Intelligence Core│
                               │ • 11-Domain Completeness  │
                               │ • Conflict Detector       │
                               │ • Provenance Linker       │
                               │ • Red-Flag Triage Engine  │
                               └─────────────┬─────────────┘
                                             │
                                             ▼
                               ┌───────────────────────────┐
                               │ Physician Encounter Suite │
                               │ • 2×2 Structured Summary  │
                               │ • Source Evidence Drawer  │
                               │ • Conflict Adjudicator    │
                               │ • Prescription Generator  │
                               └─────────────┬─────────────┘
                                             │
                      ┌──────────────────────┴──────────────────────┐
                      ▼                                             ▼
       ┌─────────────────────────────┐               ┌─────────────────────────────┐
       │  Hospital EHR / HIS Bridge  │               │   ABDM Gateway & FHIR R4    │
       │  • HL7 FHIR Composition     │               │   • ABHA Link (M1)          │
       │  • OPD Consultation Queue   │               │   • Health Locker Push (M2) │
       └─────────────────────────────┘               └─────────────────────────────┘
```

---

# 13. WHAT IS ACTUALLY IMPLEMENTED (ACCURATE AUDIT)

### 13.1 Implementation Classification Matrix
* **`IMPLEMENTED`**: Fully built, interactive, type-safe, and styled in frontend codebase.
* **`PARTIAL`**: Scaffolded backend service / draft parser requiring end-to-end wiring.
* **`MOCKED`**: Realistic deterministic mock adapters for hackathon demonstration.
* **`PLANNED`**: Fully designed architecture ready for production cloud deployment.
* **`OUT OF SCOPE`**: Intentionally excluded from SIH scope (real payment gateways, autonomous prescribing, robotic document sorting).

| Subsystem | Feature | Status | Location / Implementation Details |
|---|---|---|---|
| **Frontend** | Kiosk Client (Standalone) | **IMPLEMENTED** | `src/app/kiosk/*`, port 5173, `.next-5173` cache |
| **Frontend** | Main Application Suite | **IMPLEMENTED** | `src/app/*`, port 5180, `.next-5180` cache |
| **Frontend** | Physician Encounter Console | **IMPLEMENTED** | `src/app/doctor/encounter/[id]/page.tsx` |
| **Frontend** | Today's OPD Doctor Queue | **IMPLEMENTED** | `src/app/doctor/queue/page.tsx` |
| **Frontend** | Nursing Triage Operations | **IMPLEMENTED** | `src/app/nursing/dashboard/page.tsx` |
| **Frontend** | Hospital Operations Admin | **IMPLEMENTED** | `src/app/admin/page.tsx` |
| **Frontend** | Patient Portal Dashboard | **IMPLEMENTED** | `src/app/patient/dashboard/page.tsx` |
| **Frontend** | Optical Evidence Drawer | **IMPLEMENTED** | `src/components/clinical/evidence-drawer.tsx` |
| **Frontend** | Clinical Discrepancy Card | **IMPLEMENTED** | `src/components/clinical/conflict-card.tsx` |
| **Frontend** | 11-Domain Completeness Grid | **IMPLEMENTED** | `src/components/clinical/completeness-grid.tsx`|
| **Frontend** | Longitudinal Health Timeline | **IMPLEMENTED** | `src/components/clinical/timeline.tsx` |
| **Frontend** | Prescription Modal & Print | **IMPLEMENTED** | `src/app/doctor/encounter/[id]/page.tsx` |
| **State** | Auth, Kiosk, UI Zustand Stores| **IMPLEMENTED** | `src/store/*` with local persistence |
| **Backend** | FastAPI Service Scaffold | **IMPLEMENTED** | `medikiosk-backend/app/main.py` |
| **Backend** | Dialogue / Session Router | **PARTIAL** | `medikiosk-backend/app/dialogue/` |
| **Backend** | Document Extraction Service | **PARTIAL** | `medikiosk-backend/app/documents/` |
| **Backend** | FHIR Bundle Builder | **PARTIAL** | `medikiosk-backend/app/fhir/` |
| **AI / ML** | Bhashini Regional ASR | **MOCKED** | Deterministic Marathi speech transcript playback|
| **AI / ML** | TrOCR / PyTesseract Engine | **MOCKED / PARTIAL** | 94% OCR crop simulation in UI + draft backend |
| **AI / ML** | Red-Flag Rule Classifier | **IMPLEMENTED** | Heuristic rule-based trigger in frontend & mock |
| **ABDM** | ABHA ID QR Verification | **MOCKED** | Deterministic token generator (Dhananjay Patil) |
| **ABDM** | Milestone 1/2/3 Live Bridge | **PLANNED** | Production NHA sandbox integration |

---

# 14. CURRENT FRONTEND ROUTE STATUS TABLE

| Screen ID | Route | Screen Name | Implemented | Interactive | State Connected | Mock API |
|---|---|---|:---:|:---:|:---:|:---:|
| **P-01** | `/` & `/patient/welcome` | Homepage & Welcome | YES | YES | YES | YES |
| **P-02** | `/patient/identify` | Patient Identification | YES | YES | YES | YES |
| **P-03** | `/patient/register` | New Patient Registration | YES | YES | YES | YES |
| **P-04** | `/patient/confirm` | Confirm Returning Profile | YES | YES | YES | YES |
| **P-05** | `/patient/consent` | Digital Consent | YES | YES | YES | YES |
| **P-06** | `/patient/intake/start` | Chief Complaint Selection | YES | YES | YES | YES |
| **P-07–P-10**| `/patient/intake/interview`| Multimodal Speech Intake | YES | YES | YES | YES |
| **P-11–P-12**| `/patient/intake/ayush-*` | AYUSH Ahara-Vihara Intake | YES | YES | YES | YES |
| **P-14** | `/patient/intake/pause` | Pause / Resume Session | YES | YES | YES | YES |
| **P-15–P-19**| `/patient/documents/*` | Document Scan & Quality | YES | YES | YES | YES |
| **P-20–P-21**| `/patient/review` | Summary Review & Token Slip | YES | YES | YES | YES |
| **P-23** | `/patient/dashboard` | Patient Health Record Portal| YES | YES | YES | YES |
| **T-01–T-05**| `/nursing/dashboard` | Nursing Triage Station | YES | YES | YES | YES |
| **D-01** | `/doctor/queue` | Today's OPD Doctor Queue | YES | YES | YES | YES |
| **D-02–D-18**| `/doctor/encounter/[id]`| Doctor Clinical Encounter | YES | YES | YES | YES |
| **A-01–A-07**| `/admin` | Hospital Operations Admin | YES | YES | YES | YES |
| **K-01–K-04**| `/kiosk/*` | Multilingual Kiosk Client | YES | YES | YES | YES |

---

# 15. TECHNICAL DEBT & GAPS REQUIRING FUTURE WORK

### 15.1 Technical Debt Identified
1. **Duplicate Page Components:** Legacy screen components exist in `src/screens/*` alongside App Router pages in `src/app/*`. App Router pages in `src/app/*` serve as the active source of truth.
2. **Deterministic Mock Decoupling:** Live AI inference currently runs through deterministic mock arrays (`DEMO_ENCOUNTERS`, `DEMO_FACTS_ENC001`) to guarantee offline hackathon resilience.
3. **Dual Cache Invalidation:** Simultaneous execution of port 5173 and port 5180 requires maintaining distinct cache directories (`.next-5173` and `.next-5180`) inside `next.config.mjs`.

### 15.2 Implementation Gaps for Production Deployment
* **Backend Live Server:** Connect `medikiosk-backend` FastAPI endpoints to real PostgreSQL database with pgvector.
* **Bhashini Speech API:** Inject production API keys for live regional speech-to-text inference.
* **LayoutLM / TrOCR Pipeline:** Deploy GPU-backed container for real-time handwritten doctor prescription OCR.
* **NHA ABDM Sandbox:** Complete M1 (ABHA verification), M2 (HIP document push), and M3 (HIU document fetch) certification.

---

# 16. MASTER PRODUCT WALKTHROUGH FOR LIVE JURY DEMONSTRATION

```
STEP 1: PATIENT ARRIVAL AT MULTILINGUAL KIOSK (Port 5173)
        Patient approaches kiosk, touches 'मराठी' (Marathi), scans ABHA card (Dhananjay Patil, 67M).
        
STEP 2: VOICE-GUIDED CLINICAL INTAKE
        Patient speaks naturally about 3 months of epigastric burning pain. Bhashini ASR transcribes
        and categorizes symptoms. Patient completes AYUSH Ahara-Vihara diet/sleep questionnaire.

STEP 3: PAPER DOCUMENT DIGITIZATION
        Patient feeds physical prescriptions on scanner. High-speed OCR extracts medications
        (Metformin, Amlodipine) and allergy records with 94% confidence. Kiosk issues Token A-028.

STEP 4: PHYSICIAN OPD CONSOLE (Port 5180)
        Dr. Sunita Rao logs in (`/doctor/queue`), selects Token A-028 marked "READY FOR REVIEW".
        Reviews clean 2×2 AI-Assisted Clinical Summary in 5 seconds.

STEP 5: SOURCE PROVENANCE & DISCREPANCY ADJUDICATION
        Doctor clicks 'Inspect Crop' to view optical bounding box of 2024 prescription.
        Adjudicates allergy discrepancy (Penicillin allergy reported verbally vs none on record).

STEP 6: CONSULTATION FINALIZATION & PRESCRIPTION
        Doctor records physical exam note, signs consultation, issues electronic prescription
        (Pantoprazole 40mg + Sucralfate), and syncs FHIR bundle to hospital EHR.

STEP 7: PATIENT PORTAL ACCESS
        Patient logs into portal (`/patient/dashboard`) to view digital token status, newly prescribed
        medicines, scanned medical files, and reconstructed longitudinal health timeline.
```

---

# 17. FINAL SUMMARY STATEMENT

**VAIDYA** transforms India's outpatient healthcare by eliminating the first-mile clinical data acquisition bottleneck. By pairing accessible multilingual voice and touch intake with document intelligence, source explainability, and ABDM interoperability, VAIDYA empowers physicians to deliver safer, personalized, and unhurried clinical care without replacing the irreplaceable human judgment of the doctor.
