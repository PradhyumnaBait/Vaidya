'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  AlertTriangle,
  Edit3,
  Search,
  ExternalLink,
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
  const [physicianNotes, setPhysicianNotes] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [verifiedFacts, setVerifiedFacts] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Load encounter & patient
    const foundEnc = DEMO_ENCOUNTERS.find((e) => e.id === encounterId) || DEMO_ENCOUNTERS[0]
    setEncounter(foundEnc)
    const foundPat = foundEnc.patient || DEMO_PATIENTS.find((p) => p.id === foundEnc.patientId) || DEMO_PATIENTS[0]
    setPatient(foundPat)

    // Load clinical facts & conflicts
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
    await new Promise((r) => setTimeout(r, 400))
    addToast({
      type: 'success',
      title: 'Conflict Decision Recorded',
      body: `Resolution: ${resolution}${note ? ` • Note: "${note}"` : ''}`,
    })
  }

  const handleToggleFactVerification = (factId: string) => {
    setVerifiedFacts((prev) => ({ ...prev, [factId]: !prev[factId] }))
    addToast({
      type: 'info',
      title: verifiedFacts[factId] ? 'Fact Unmarked' : 'Fact Verified by Physician',
      body: `Fact #${factId.slice(-3)} updated in clinical brief.`,
    })
  }

  const handleStartConsultation = () => {
    setConsultationStatus('IN_PROGRESS')
    addToast({
      type: 'info',
      title: 'Consultation In Progress',
      body: `Started examination for ${patient?.name} (Token ${encounter?.tokenNumber}).`,
    })
  }

  const handleCompleteEncounter = () => {
    setConsultationStatus('COMPLETED')
    setIsVerified(true)
    addToast({
      type: 'success',
      title: 'Encounter Finalized',
      body: `Clinical summary & prescription recorded. Syncing to OPD queue.`,
    })
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF8FF] overflow-y-auto">
      {/* ─── Top Patient Header ────────────────────────────────────────── */}
      <header className="bg-white border-b border-[#E1E2ED] px-6 py-4 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/doctor/queue')}
              className="p-2 rounded-xl border border-[#E1E2ED] bg-white text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-all"
              title="Back to Patient Queue"
            >
              <ArrowLeft size={18} />
            </button>

            {/* Token Badge */}
            <div className="w-12 h-12 rounded-xl bg-[#004AC6]/10 border border-[#004AC6]/20 text-[#004AC6] flex flex-col items-center justify-center shrink-0">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#004AC6]">OPD</span>
              <span className="text-[15px] font-extrabold font-mono leading-none">{encounter?.tokenNumber || 'A-028'}</span>
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[20px] font-bold text-[#18181B]">
                  {patient?.name || 'Dhananjay Patil'}
                </h1>
                <span className="bg-[#FAF8FF] text-[#434655] px-2.5 py-0.5 rounded-full text-[12px] font-semibold border border-[#E1E2ED]">
                  {patient?.age || 67} yrs • {patient?.sex === 'M' || patient?.sex === 'male' ? 'Male' : 'Female'}
                </span>
                {patient?.preferredLanguage && (
                  <span className="bg-[#EFF6FF] text-[#004AC6] px-2 py-0.5 rounded-md text-[11px] font-bold uppercase">
                    Lang: {patient.preferredLanguage === 'mr' ? 'मराठी' : patient.preferredLanguage}
                  </span>
                )}
              </div>
              <p className="text-[12px] text-[#71717A] mt-0.5 font-mono">
                ABHA: {patient?.abhaNumber || '12-3456-7890-1234'} • Encounter ID: #{encounterId}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'px-3 py-1 rounded-full text-[12px] font-bold border flex items-center gap-1.5',
                consultationStatus === 'READY' && 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]',
                consultationStatus === 'IN_PROGRESS' && 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE] animate-pulse',
                consultationStatus === 'COMPLETED' && 'bg-[#FAF8FF] text-[#006A61] border-[#86F2E4]'
              )}
            >
              <span className="w-2 h-2 rounded-full bg-current" />
              {consultationStatus === 'READY' && 'Ready for Review'}
              {consultationStatus === 'IN_PROGRESS' && 'Consultation Active'}
              {consultationStatus === 'COMPLETED' && 'Physician Approved'}
            </span>

            {consultationStatus === 'READY' && (
              <button
                onClick={handleStartConsultation}
                className="px-4 py-2 rounded-xl bg-[#004AC6] text-white text-[13px] font-bold hover:bg-[#003EA8] transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <Stethoscope size={15} />
                <span>Start Consultation</span>
              </button>
            )}

            {consultationStatus === 'IN_PROGRESS' && (
              <button
                onClick={handleCompleteEncounter}
                className="px-4 py-2 rounded-xl bg-[#16A34A] text-white text-[13px] font-bold hover:bg-[#15803D] transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
              >
                <CheckCircle2 size={15} />
                <span>Sign &amp; Complete</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─── Main 2-Column Clinical Review Layout ───────────────────── */}
      <main className="max-w-7xl mx-auto p-6 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ─── LEFT COLUMN (8 cols): Clinical Intelligence Synthesis ─── */}
        <div className="lg:col-span-8 space-y-6">
          {/* Red Flag Alert (If applicable) */}
          {encounterId === 'enc-002' ? (
            <RedFlagBanner alert={DEMO_RED_FLAG_ENC002} />
          ) : (
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl px-5 py-3 flex items-center gap-3">
              <ShieldCheck size={18} className="text-[#16A34A] shrink-0" />
              <p className="text-[13px] font-medium text-[#166534]">
                <span className="font-bold">No urgent red flags</span> detected during patient intake.
              </p>
            </div>
          )}

          {/* AI-Assisted Clinical Summary Box */}
          <div className="bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-xs">
            {/* Header Banner */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#E1E2ED]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#004AC6]/10 text-[#004AC6] flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#18181B] flex items-center gap-2">
                    <span>AI-Assisted Clinical Summary</span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#004AC6] bg-[#EFF6FF] px-2 py-0.5 rounded-md border border-[#BFDBFE]">
                      Prepared for Review
                    </span>
                  </h2>
                  <p className="text-[12px] text-[#71717A]">
                    Synthesized from patient kiosk voice intake, touch inputs, and scanned physical records.
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-mono text-[#A1A1AA] hidden sm:block">
                Physician review required
              </span>
            </div>

            {/* Structured Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Chief Complaint */}
              <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                  Chief Complaint
                </span>
                <p className="text-[15px] font-bold text-[#18181B] mt-1">
                  Epigastric pain &amp; gastric discomfort
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <ProvenanceChip tier={3} sourceType="INTERVIEW" confidence={0.92} />
                  <span className="text-[11px] text-[#71717A]">Marathi voice input</span>
                </div>
              </div>

              {/* Onset & Duration */}
              <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                  Duration &amp; Onset
                </span>
                <p className="text-[15px] font-bold text-[#18181B] mt-1">
                  3 months (Gradual worsening)
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <ProvenanceChip tier={3} sourceType="INTERVIEW" confidence={0.89} />
                  <span className="text-[11px] text-[#71717A]">Reported continuous</span>
                </div>
              </div>

              {/* Pain Quality & Character */}
              <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A]">
                  Sensation &amp; Character
                </span>
                <p className="text-[15px] font-bold text-[#18181B] mt-1">
                  Burning &amp; sharp sensation after meals
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <ProvenanceChip tier={3} sourceType="INTERVIEW" confidence={0.92} />
                  <span className="text-[11px] text-[#71717A]">Post-prandial trigger</span>
                </div>
              </div>

              {/* AYUSH Ahara / Vihara Lifestyle */}
              <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#006A61]">
                  AYUSH Ahara &amp; Vihara Factors
                </span>
                <p className="text-[14px] font-semibold text-[#18181B] mt-1">
                  Ahara: Irregular timing, spicy/oily food • Vihara: Disturbed sleep
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <ProvenanceChip tier={3} sourceType="INTERVIEW" confidence={0.88} />
                  <span className="text-[11px] text-[#006A61] font-medium">Dietary lifestyle correlation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conflict Resolution Card (If present) */}
          {conflicts.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#D97706]">
                  <AlertTriangle size={18} />
                  <h3 className="text-[15px] font-bold text-[#18181B]">
                    Clinical Inconsistency Detection
                  </h3>
                </div>
                <span className="text-[12px] text-[#71717A]">
                  1 conflict flagged between document &amp; patient statement
                </span>
              </div>

              {conflicts.map((conflict) => (
                <ConflictCard
                  key={conflict.id}
                  conflict={conflict}
                  onResolve={handleResolveConflict}
                />
              ))}
            </div>
          )}

          {/* Extracted Clinical Facts & OCR Findings */}
          <div className="bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-[#18181B]">
                  Extracted Clinical Facts ({facts.length})
                </h3>
                <p className="text-[12px] text-[#71717A]">
                  Click any fact to inspect source evidence crops and OCR confidence.
                </p>
              </div>
              <span className="text-[12px] text-[#004AC6] font-semibold">
                {Object.values(verifiedFacts).filter(Boolean).length} of {facts.length} verified
              </span>
            </div>

            <div className="divide-y divide-[#F4F4F5] border border-[#E1E2ED] rounded-2xl overflow-hidden">
              {facts.map((fact) => {
                const isFactVerified = verifiedFacts[fact.id]
                return (
                  <div
                    key={fact.id}
                    className="p-4 bg-white hover:bg-[#FAF8FF] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div
                      onClick={() => openEvidenceDrawer(fact.id)}
                      className="flex-1 cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#71717A]">
                          {fact.domain} • {fact.fieldName.replace(/_/g, ' ')}
                        </span>
                        {fact.conflictStatus === 'IN_CONFLICT' && (
                          <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                            Conflict
                          </span>
                        )}
                      </div>
                      <p className="text-[15px] font-bold text-[#18181B] group-hover:text-[#004AC6] transition-colors">
                        {fact.rawValue}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <ProvenanceChip
                          tier={fact.confidenceTier}
                          sourceType={fact.sourceType}
                          confidence={fact.ocrConfidence || fact.confidence}
                        />
                        {fact.sourceText && (
                          <span className="text-[11px] text-[#71717A] italic font-mono truncate max-w-xs">
                            &quot;{fact.sourceText}&quot;
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Verification Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openEvidenceDrawer(fact.id)}
                        className="px-3 py-1.5 rounded-xl border border-[#E1E2ED] text-[12px] font-semibold text-[#52525B] hover:text-[#004AC6] hover:bg-[#EFF6FF] transition-all flex items-center gap-1"
                      >
                        <Search size={13} />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => handleToggleFactVerification(fact.id)}
                        className={cn(
                          'px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all flex items-center gap-1',
                          isFactVerified
                            ? 'bg-[#16A34A] text-white'
                            : 'bg-[#F4F4F5] text-[#52525B] hover:bg-[#E4E4E7]'
                        )}
                      >
                        <CheckCircle2 size={13} />
                        <span>{isFactVerified ? 'Verified' : 'Verify'}</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Completeness & Timeline Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Completeness Audit */}
            <div className="bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-xs">
              <h3 className="text-[16px] font-bold text-[#18181B] mb-1">
                Intake Completeness
              </h3>
              <p className="text-[12px] text-[#71717A] mb-4">
                Structured domain audit for clinical decision readiness.
              </p>
              <CompletenessGrid entries={DEMO_COMPLETENESS_ENC001} />
            </div>

            {/* Reconstructed Patient Timeline */}
            <div className="bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-xs">
              <h3 className="text-[16px] font-bold text-[#18181B] mb-1">
                Longitudinal Patient Timeline
              </h3>
              <p className="text-[12px] text-[#71717A] mb-4">
                Historical records merged with current intake session.
              </p>
              <Timeline events={DEMO_TIMELINE_ENC001} />
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN (4 cols): Attached Documents & Physician Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Attached Medical Documents */}
          <div className="bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[16px] font-bold text-[#18181B] flex items-center gap-2">
                <FileText size={18} className="text-[#004AC6]" />
                <span>Scanned Documents ({DEMO_DOCUMENTS_ENC001.length})</span>
              </h3>
            </div>

            <div className="space-y-3">
              {DEMO_DOCUMENTS_ENC001.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => openEvidenceDrawer(facts[1]?.id || 'fact-002')}
                  className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED] hover:border-[#004AC6] transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#004AC6] px-2 py-0.5 rounded">
                        {doc.documentType.replace(/_/g, ' ')}
                      </span>
                      <h4 className="text-[14px] font-bold text-[#18181B] group-hover:text-[#004AC6] transition-colors mt-1.5">
                        {doc.originalFilename}
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#16A34A] bg-[#F0FDF4] px-1.5 py-0.5 rounded border border-[#BBF7D0]">
                      {Math.round((doc.ocrConfidence || 0.9) * 100)}% OCR
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3 text-[12px] text-[#71717A] pt-2 border-t border-[#E1E2ED]">
                    <span>{doc.extractedFactsCount || 4} facts extracted</span>
                    <span className="text-[#004AC6] font-semibold group-hover:underline flex items-center gap-0.5">
                      <span>View Crop</span>
                      <ExternalLink size={12} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Physician Action & Decision Console */}
          <div className="bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-xs space-y-4">
            <h3 className="text-[16px] font-bold text-[#18181B] flex items-center gap-2">
              <Edit3 size={18} className="text-[#004AC6]" />
              <span>Consultation Notes &amp; Actions</span>
            </h3>

            <div>
              <label className="text-[12px] font-bold text-[#71717A] uppercase tracking-wider block mb-1.5">
                Physician Examination Notes
              </label>
              <textarea
                value={physicianNotes}
                onChange={(e) => setPhysicianNotes(e.target.value)}
                placeholder="Enter clinical examination findings, differential diagnosis, or prescription directions..."
                className="w-full h-32 text-[13px] p-3 rounded-xl border border-[#E1E2ED] bg-[#FAF8FF] focus:bg-white focus:outline-none focus:border-[#004AC6] resize-none transition-all"
              />
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setIsVerified(true)
                  addToast({
                    type: 'success',
                    title: 'Clinical Summary Verified',
                    body: 'All clinical intake items marked as physician verified.',
                  })
                }}
                className={cn(
                  'w-full py-2.5 rounded-xl border text-[13px] font-bold transition-all flex items-center justify-center gap-2 active:scale-98',
                  isVerified
                    ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#166534]'
                    : 'bg-[#FAF8FF] border-[#E1E2ED] hover:bg-[#F4F4F5] text-[#18181B]'
                )}
              >
                <CheckCircle2 size={15} className={isVerified ? 'text-[#16A34A]' : 'text-[#71717A]'} />
                <span>{isVerified ? 'Intake Verified by Physician' : 'Mark Intake Verified'}</span>
              </button>

              <button
                onClick={handleCompleteEncounter}
                className="w-full py-3 rounded-xl bg-[#004AC6] hover:bg-[#003EA8] text-white text-[14px] font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Finalize Consultation &amp; Sync EHR</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
