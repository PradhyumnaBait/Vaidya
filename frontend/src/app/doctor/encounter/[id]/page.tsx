'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  Edit3,
  Search,
  ExternalLink,
  Printer,
  FileCheck2,
  RotateCcw,
  Heart,
  X,
} from 'lucide-react'
import {
  DEMO_ENCOUNTERS,
  DEMO_PATIENTS,
  DEMO_FACTS_ENC001,
  DEMO_CONFLICTS_ENC001,
  DEMO_DOCUMENTS_ENC001,
  DEMO_TIMELINE_ENC001,
  DEMO_COMPLETENESS_ENC001,
  DEMO_RED_FLAG_ENC002,
} from '@/constants/demo-data'
import {
  ConflictCard,
  CompletenessGrid,
  ProvenanceChip,
  RedFlagBanner,
  Timeline,
} from '@/components/clinical'
import { useUIStore } from '@/store'
import type { ClinicalConflict, ClinicalFact, Encounter, Patient } from '@/types'
import { cn } from '@/lib/utils'

export default function DoctorEncounterPage() {
  const params = useParams()
  const router = useRouter()
  const encounterId = (params?.id as string) || 'enc-001'
  const { openEvidenceDrawer, addToast } = useUIStore()

  const [encounter, setEncounter] = useState<Encounter | null>(null)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [facts, setFacts] = useState<ClinicalFact[]>([])
  const [conflicts, setConflicts] = useState<ClinicalConflict[]>([])
  const [consultationStatus, setConsultationStatus] = useState<'READY' | 'IN_PROGRESS' | 'COMPLETED'>('READY')
  const [physicianNotes, setPhysicianNotes] = useState('Abdomen soft, non-tender on palpation. Mild epigastric tenderness. Diagnosis: Chronic Acid Peptic Disease / Dyspepsia. Advised dietary modifications (avoid spicy food) and prescribed Pantoprazole.')
  const [isIntakeVerified, setIsIntakeVerified] = useState(false)
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false)

  useEffect(() => {
    const foundEnc = DEMO_ENCOUNTERS.find((e) => e.id === encounterId) || DEMO_ENCOUNTERS[0]
    setEncounter(foundEnc)
    const foundPat = foundEnc.patient || DEMO_PATIENTS.find((p) => p.id === foundEnc.patientId) || DEMO_PATIENTS[0]
    setPatient(foundPat)

    if (encounterId === 'enc-001' || !params?.id) {
      setFacts(DEMO_FACTS_ENC001)
      setConflicts(DEMO_CONFLICTS_ENC001)
    } else {
      setFacts([])
      setConflicts([])
    }
  }, [encounterId, params?.id])

  const handleResolveConflict = async (
    resolution: 'RESOLVED_A' | 'RESOLVED_B' | 'RESOLVED_UNCERTAIN',
    note?: string
  ) => {
    await new Promise((r) => setTimeout(r, 300))
    addToast({
      type: 'success',
      title: 'Clinical Conflict Decision Saved',
      body: `Decision: ${resolution}${note ? ` • Note: "${note}"` : ''}`,
    })
  }

  const handleStartConsultation = () => {
    setConsultationStatus('IN_PROGRESS')
    addToast({
      type: 'info',
      title: 'Consultation In Progress',
      body: `Reviewing ${patient?.name} (Token ${encounter?.tokenNumber}).`,
    })
  }

  const handleCompleteEncounter = () => {
    setConsultationStatus('COMPLETED')
    setIsIntakeVerified(true)
    addToast({
      type: 'success',
      title: 'Consultation Finalized & EHR Synced',
      body: `Prescription issued for ${patient?.name}. Records synced to ABDM Health Locker.`,
    })
  }

  const handleResetDemo = () => {
    setConsultationStatus('READY')
    setIsIntakeVerified(false)
    addToast({
      type: 'info',
      title: 'Demo State Reset',
      body: 'Encounter reset to initial state ready for presentation.',
    })
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF8FF] overflow-y-auto">
      {/* ─── 1. TOP: Patient Identity Header Bar ────────────────────────────── */}
      <header className="bg-white border-b border-[#E1E2ED] px-6 py-4 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => router.push('/doctor/queue')}
              className="p-2 rounded-xl border border-[#E1E2ED] bg-white text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-all"
              title="Back to Today's OPD"
            >
              <ArrowLeft size={16} />
            </button>

            {/* Token Badge */}
            <div className="w-12 h-12 rounded-2xl bg-[#004AC6]/10 border border-[#004AC6]/20 text-[#004AC6] flex flex-col items-center justify-center shrink-0">
              <span className="text-[8px] font-bold uppercase text-[#004AC6]">OPD</span>
              <span className="text-[16px] font-extrabold font-mono leading-none">{encounter?.tokenNumber || 'A-028'}</span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-[20px] font-bold text-[#18181B] tracking-tight">
                  {patient?.name || 'Dhananjay Patil'}
                </h1>
                <span className="text-[12px] font-semibold text-[#52525B] bg-[#FAF8FF] px-2.5 py-0.5 rounded-full border border-[#E1E2ED]">
                  {patient?.age || 67}M • Male
                </span>
                <span className="text-[11px] font-bold text-[#166534] bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-0.5 rounded-md">
                  ABHA Linked (12-3456-7890-1234)
                </span>
              </div>
              <p className="text-[11px] text-[#71717A] mt-0.5">
                Preferred Language: Marathi (मराठी) • Kiosk Session: Station 01 • Attending: Dr. Sunita Rao
              </p>
            </div>
          </div>

          {/* Right Header Status & Action */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="text-right hidden sm:block">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                Prepared by VAIDYA
              </span>
              <p className="text-[10px] text-[#71717A] mt-0.5">Last updated 10:32 AM</p>
            </div>

            {consultationStatus === 'READY' && (
              <button
                onClick={handleStartConsultation}
                className="px-4 py-2 rounded-xl bg-[#004AC6] text-white text-[13px] font-bold hover:bg-[#003EA8] transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <Stethoscope size={14} />
                <span>Start Consultation</span>
              </button>
            )}

            {consultationStatus === 'IN_PROGRESS' && (
              <button
                onClick={handleCompleteEncounter}
                className="px-4 py-2 rounded-xl bg-[#16A34A] text-white text-[13px] font-bold hover:bg-[#15803D] transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <CheckCircle2 size={14} />
                <span>Finalize Consultation</span>
              </button>
            )}

            {consultationStatus === 'COMPLETED' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPrescriptionModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#004AC6] text-white text-[12px] font-bold hover:bg-[#003EA8] transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                >
                  <Printer size={13} />
                  <span>View Prescription</span>
                </button>
                <button
                  onClick={handleResetDemo}
                  className="p-2 rounded-xl border border-[#E1E2ED] text-[#71717A] hover:text-[#18181B] bg-white transition-colors"
                  title="Reset Demo State"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── Main Content Container ────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto p-6 md:p-8 w-full flex-1 space-y-8">
        {/* COMPLETED SUCCESS BANNER & CONSULTATION RESULT (Sections 5 & 6) */}
        {consultationStatus === 'COMPLETED' && (
          <section className="bg-white border-2 border-[#16A34A] rounded-3xl p-6 sm:p-8 shadow-md space-y-5 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E1E2ED]">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] flex items-center justify-center">
                  <FileCheck2 size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[19px] font-bold text-[#18181B]">
                      Consultation Finalized &amp; Prescription Ready
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F0FDF4] text-[#166534] px-2.5 py-0.5 rounded-full border border-[#BBF7D0]">
                      EHR Synced
                    </span>
                  </div>
                  <p className="text-[12px] text-[#52525B] mt-0.5">
                    Attending: Dr. Sunita Rao • Date: Today, 10:45 AM • Token: A-028 • ABHA: 12-3456-7890-1234
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => setPrescriptionModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#004AC6] text-white text-[13px] font-bold hover:bg-[#003EA8] transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                >
                  <Printer size={14} />
                  <span>View / Print Prescription</span>
                </button>

                <button
                  onClick={() => router.push('/patient/dashboard')}
                  className="px-4 py-2.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534] text-[13px] font-bold hover:bg-[#DCFCE7] transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Heart size={14} />
                  <span>Open Patient Portal View →</span>
                </button>

                <button
                  onClick={() => router.push('/doctor/queue')}
                  className="px-4 py-2.5 rounded-xl border border-[#E1E2ED] text-[#52525B] hover:text-[#18181B] bg-white text-[13px] font-bold hover:bg-[#FAF8FF] transition-all"
                >
                  Return to Queue
                </button>
              </div>
            </div>

            {/* Structured Prescription Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
                  Active Prescriptions (2)
                </span>
                <p className="text-[14px] font-bold text-[#18181B]">
                  1. Tab. Pantoprazole 40mg (OD × 14d)
                </p>
                <p className="text-[14px] font-bold text-[#18181B]">
                  2. Syrup Sucralfate 10ml (TDS × 7d)
                </p>
              </div>

              <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
                  ABHA Health Locker Sync
                </span>
                <p className="text-[14px] font-bold text-[#166534] flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>FHIR R4 DiagnosticReport Bundled</span>
                </p>
                <p className="text-[12px] text-[#71717A]">
                  Synced to Patient ABHA Address: dpatil@abdm
                </p>
              </div>

              <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
                  Follow-up &amp; Lifestyle
                </span>
                <p className="text-[14px] font-bold text-[#18181B]">
                  Review in 2 weeks
                </p>
                <p className="text-[12px] text-[#006A61] font-medium">
                  AYUSH Ahara dietary modifications advised
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Red Flag Alert Banner (for acute triage cases) */}
        {encounterId === 'enc-002' ? (
          <RedFlagBanner alert={DEMO_RED_FLAG_ENC002} />
        ) : (
          <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl px-5 py-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3 text-[#166534]">
              <ShieldCheck size={18} className="text-[#16A34A] shrink-0" />
              <p className="text-[13px] font-medium">
                <strong className="font-bold">No acute red flags</strong> detected during multilingual patient intake.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#166534] uppercase tracking-wider bg-white px-2 py-0.5 rounded border border-[#BBF7D0]">
              Triage Clear
            </span>
          </div>
        )}

        {/* ─── 2. PRIMARY CLINICAL SUMMARY (Visual Center) ───────────── */}
        <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#E1E2ED] shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E1E2ED]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#004AC6]/10 text-[#004AC6] flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[18px] font-bold text-[#18181B] tracking-tight">
                    AI-Assisted Clinical Summary
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#004AC6] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                    Pre-Consultation Synthesis
                  </span>
                </div>
                <p className="text-[12px] font-semibold text-[#004AC6] mt-0.5">
                  Physician review required • Synthesized from Marathi voice intake &amp; 3 scanned documents
                </p>
              </div>
            </div>

            <button
              onClick={() => openEvidenceDrawer('fact-001')}
              className="px-3.5 py-1.5 rounded-xl border border-[#E1E2ED] text-[12px] font-bold text-[#004AC6] bg-[#FAF8FF] hover:bg-[#EFF6FF] transition-all flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Search size={13} />
              <span>Inspect Source Evidence</span>
            </button>
          </div>

          {/* Clean 2x2 Fact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fact 1: Chief Complaint */}
            <div className="bg-[#FAF8FF] p-5 rounded-2xl border border-[#E1E2ED] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
                  Chief Complaint
                </span>
                <ProvenanceChip tier={3} sourceType="INTERVIEW" confidence={0.92} />
              </div>
              <p className="text-[16px] font-bold text-[#18181B]">
                Epigastric burning pain &amp; indigestion
              </p>
              <p className="text-[12px] text-[#71717A]">
                Source: Patient voice intake (Bhashini Marathi ASR)
              </p>
            </div>

            {/* Fact 2: Duration */}
            <div className="bg-[#FAF8FF] p-5 rounded-2xl border border-[#E1E2ED] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
                  Duration
                </span>
                <ProvenanceChip tier={3} sourceType="INTERVIEW" confidence={0.89} />
              </div>
              <p className="text-[16px] font-bold text-[#18181B]">
                3 months (Gradual worsening)
              </p>
              <p className="text-[12px] text-[#71717A]">
                Source: Patient voice intake
              </p>
            </div>

            {/* Fact 3: Character & Aggravation */}
            <div className="bg-[#FAF8FF] p-5 rounded-2xl border border-[#E1E2ED] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#71717A]">
                  Character &amp; Aggravation
                </span>
                <ProvenanceChip tier={3} sourceType="INTERVIEW" confidence={0.92} />
              </div>
              <p className="text-[16px] font-bold text-[#18181B]">
                Burning / acidity, aggravated post-prandial
              </p>
              <p className="text-[12px] text-[#71717A]">
                Source: Patient touch &amp; voice intake
              </p>
            </div>

            {/* Fact 4: Trigger & Lifestyle */}
            <div className="bg-[#FAF8FF] p-5 rounded-2xl border border-[#E1E2ED] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#006A61]">
                  Trigger &amp; AYUSH Lifestyle Factor
                </span>
                <ProvenanceChip tier={3} sourceType="INTERVIEW" confidence={0.88} />
              </div>
              <p className="text-[16px] font-bold text-[#18181B]">
                Stress, disturbed sleep &amp; irregular spicy food
              </p>
              <p className="text-[12px] text-[#006A61] font-medium">
                Source: AYUSH Ahara &amp; Vihara questionnaire
              </p>
            </div>
          </div>
        </section>

        {/* ─── 3. SECONDARY CLINICAL INFORMATION IN STRICT ORDER ──────── */}

        {/* SECTION A: Clinical Alerts / Discrepancies */}
        {conflicts.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-[16px] font-bold text-[#18181B]">
              A. Clinical Discrepancy &amp; Verification
            </h3>
            {conflicts.map((conflict) => (
              <ConflictCard
                key={conflict.id}
                conflict={conflict}
                onResolve={handleResolveConflict}
              />
            ))}
          </section>
        )}

        {/* SECTION B: Medical Documents */}
        <section className="bg-white rounded-3xl p-6 md:p-8 border border-[#E1E2ED] shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E1E2ED]">
            <div>
              <h3 className="text-[17px] font-bold text-[#18181B]">
                B. Scanned Medical Documents ({DEMO_DOCUMENTS_ENC001.length})
              </h3>
              <p className="text-[12px] text-[#71717A]">
                Physical records scanned at kiosk with sub-second OCR extraction.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#166534] bg-[#F0FDF4] px-2.5 py-1 rounded-full border border-[#BBF7D0]">
              All Documents Processed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEMO_DOCUMENTS_ENC001.map((doc) => (
              <div
                key={doc.id}
                onClick={() => openEvidenceDrawer(facts[1]?.id || 'fact-002')}
                className="bg-[#FAF8FF] p-5 rounded-2xl border border-[#E1E2ED] hover:border-[#004AC6] transition-all cursor-pointer group flex flex-col justify-between gap-4 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#004AC6] px-2 py-0.5 rounded">
                      {doc.documentType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#166534] bg-[#F0FDF4] px-1.5 py-0.5 rounded border border-[#BBF7D0]">
                      {Math.round((doc.ocrConfidence || 0.9) * 100)}% OCR
                    </span>
                  </div>
                  <h4 className="text-[14px] font-bold text-[#18181B] group-hover:text-[#004AC6] transition-colors">
                    {doc.originalFilename}
                  </h4>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#71717A] pt-3 border-t border-[#E1E2ED]">
                  <span>{doc.extractedFactsCount || 4} facts extracted</span>
                  <span className="text-[#004AC6] font-bold flex items-center gap-1 group-hover:underline">
                    <span>Inspect Crop</span>
                    <ExternalLink size={11} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION C & D: Clinical Completeness + Longitudinal Timeline */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section C: Completeness */}
          <div className="bg-white rounded-3xl p-6 md:p-7 border border-[#E1E2ED] shadow-xs space-y-4">
            <div>
              <h3 className="text-[17px] font-bold text-[#18181B]">
                C. 11-Domain Intake Completeness
              </h3>
              <p className="text-[12px] text-[#71717A]">
                Structured domain audit for clinical decision readiness.
              </p>
            </div>
            <CompletenessGrid entries={DEMO_COMPLETENESS_ENC001} />
          </div>

          {/* Section D: Timeline */}
          <div className="bg-white rounded-3xl p-6 md:p-7 border border-[#E1E2ED] shadow-xs space-y-4">
            <div>
              <h3 className="text-[17px] font-bold text-[#18181B]">
                D. Longitudinal Health Timeline
              </h3>
              <p className="text-[12px] text-[#71717A]">
                Past hospital admissions merged with today&apos;s intake.
              </p>
            </div>
            <Timeline events={DEMO_TIMELINE_ENC001} />
          </div>
        </section>

        {/* SECTION E: Physician Decision Console */}
        <section className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#004AC6]/30 shadow-md space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E1E2ED]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#004AC6]/10 text-[#004AC6] flex items-center justify-center">
                <Edit3 size={18} />
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-[#18181B]">
                  E. Physician Decision Console
                </h3>
                <p className="text-[12px] text-[#71717A]">
                  Review complete. Enter physical examination findings and finalize the consultation.
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#004AC6] bg-[#EFF6FF] px-2.5 py-1 rounded-full border border-[#BFDBFE]">
              Physician Action
            </span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#434655] uppercase tracking-wider block mb-1.5">
              Physical Examination &amp; Clinical Notes
            </label>
            <textarea
              value={physicianNotes}
              onChange={(e) => setPhysicianNotes(e.target.value)}
              placeholder="Enter findings from abdomen palpation, differential diagnosis, or prescription instructions..."
              className="w-full h-28 text-[13px] p-3.5 rounded-2xl border border-[#E1E2ED] bg-[#FAF8FF] focus:bg-white focus:outline-none focus:border-[#004AC6] resize-none transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                setIsIntakeVerified(true)
                addToast({
                  type: 'success',
                  title: 'Intake Verified by Physician',
                  body: 'All clinical intake items marked as physician verified.',
                })
              }}
              className={cn(
                'w-full sm:w-auto px-5 py-2.5 rounded-xl border text-[13px] font-bold transition-all flex items-center justify-center gap-2 active:scale-98',
                isIntakeVerified
                  ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
                  : 'bg-[#FAF8FF] border-[#E1E2ED] hover:bg-[#F4F4F5] text-[#18181B]'
              )}
            >
              <CheckCircle2 size={15} className={isIntakeVerified ? 'text-[#16A34A]' : 'text-[#71717A]'} />
              <span>{isIntakeVerified ? 'Intake Verified by Physician ✓' : 'Mark Intake Verified'}</span>
            </button>

            <button
              onClick={handleCompleteEncounter}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#004AC6] hover:bg-[#003EA8] text-white text-[13px] font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Finalize Consultation &amp; Sync EHR</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
      </main>

      {/* ─── PRESCRIPTION VIEW / PRINT MODAL ────────────────────────── */}
      {prescriptionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-[#E1E2ED] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E1E2ED]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#004AC6] text-white flex items-center justify-center font-bold">
                  V
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[#18181B]">
                    Hospital OPD Electronic Prescription
                  </h3>
                  <p className="text-[12px] text-[#71717A]">
                    Department of Internal Medicine • Room 104 • OPD Slot A
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPrescriptionModalOpen(false)}
                className="p-2 rounded-xl text-[#71717A] hover:text-[#18181B] hover:bg-[#F4F4F5]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Patient & Physician Details */}
            <div className="grid grid-cols-2 gap-4 bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED] text-[13px]">
              <div>
                <p className="text-[#71717A] text-[11px] font-bold uppercase">Patient</p>
                <p className="font-bold text-[#18181B]">{patient?.name || 'Dhananjay Patil'}</p>
                <p className="text-[#71717A]">{patient?.age || 67}M • Token {encounter?.tokenNumber || 'A-028'}</p>
                <p className="font-mono text-[#004AC6] text-[11px]">ABHA: 12-3456-7890-1234</p>
              </div>

              <div className="text-right">
                <p className="text-[#71717A] text-[11px] font-bold uppercase">Physician</p>
                <p className="font-bold text-[#18181B]">Dr. Sunita Rao, MD</p>
                <p className="text-[#71717A]">Reg. No: MMC-2012-48291</p>
                <p className="text-[#166534] text-[11px] font-bold">Date: 31 Aug 2026</p>
              </div>
            </div>

            {/* Rx Items */}
            <div className="space-y-3">
              <h4 className="text-[14px] font-bold text-[#18181B] flex items-center gap-1.5">
                <span className="font-serif italic text-[#004AC6] text-[18px]">℞</span>
                <span>Prescribed Medications</span>
              </h4>

              <div className="space-y-2">
                <div className="p-3.5 rounded-xl border border-[#E1E2ED] bg-white flex items-center justify-between text-[13px]">
                  <div>
                    <p className="font-bold text-[#18181B]">1. Tab. Pantoprazole 40 mg</p>
                    <p className="text-[12px] text-[#71717A]">1 Tablet • Once daily before breakfast (OD) • 14 days</p>
                  </div>
                  <span className="text-[11px] font-bold bg-[#EFF6FF] text-[#004AC6] px-2 py-0.5 rounded">
                    Oral
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-[#E1E2ED] bg-white flex items-center justify-between text-[13px]">
                  <div>
                    <p className="font-bold text-[#18181B]">2. Syrup Sucralfate 10 ml</p>
                    <p className="text-[12px] text-[#71717A]">2 Teaspoons • Three times daily after meals (TDS) • 7 days</p>
                  </div>
                  <span className="text-[11px] font-bold bg-[#EFF6FF] text-[#004AC6] px-2 py-0.5 rounded">
                    Oral
                  </span>
                </div>
              </div>
            </div>

            {/* Clinical Diagnosis & Notes */}
            <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED] space-y-1 text-[13px]">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#71717A]">Diagnosis &amp; Advice</p>
              <p className="font-semibold text-[#18181B]">Chronic Acid Peptic Disease / Dyspepsia (Pre-consultation verified)</p>
              <p className="text-[12px] text-[#52525B]">Advice: Avoid oily, excessively spicy food. Sleep on elevated pillow. Follow up in 2 weeks if symptoms persist.</p>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#71717A] flex items-center gap-1">
                <ShieldCheck size={14} className="text-[#16A34A]" />
                <span>Digitally signed via ABDM Bridge</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.print()
                  }}
                  className="px-4 py-2 rounded-xl bg-[#004AC6] text-white text-[13px] font-bold hover:bg-[#003EA8] transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Printer size={14} />
                  <span>Print Prescription</span>
                </button>
                <button
                  onClick={() => setPrescriptionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E1E2ED] text-[#52525B] hover:text-[#18181B] text-[13px] font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
