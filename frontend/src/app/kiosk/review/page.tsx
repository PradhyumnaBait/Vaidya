'use client'
/**
 * K-07 — Final Review, AI-Assisted Pre-Consultation Summary & OPD Token Generation (Phase 5)
 *
 * Route: /kiosk/review
 *
 * Multilingual Architecture:
 * - Powered by useKioskTranslation() for complete EN, HI, MR translations.
 * - In-session language toggle in header dynamically updates all strings without losing state.
 *
 * Flow:
 * 1. SUMMARY: Patient demographics, symptom history, attached docs, AI-assisted pre-consultation summary
 * 2. TOKEN: Prominent OPD Token display (A-028), room location, wait time, processing status checklist
 * 3. PRINT: Thermal print simulation with physical dispensing feedback
 * 4. COMPLETION: Direction to OPD Waiting Area B with automated 10-second privacy reset countdown
 *
 * Stitch references:
 * - session_review_confirmation_p_20
 * - session_completion_p_21
 */

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useKioskStore } from '@/store/kiosk.store'
import { useKioskTranslation } from '@/lib/hooks/use-kiosk-translation'
import { KioskButton } from '@/components/kiosk/kiosk-button'

type ReviewWorkflowStage = 'SUMMARY' | 'TOKEN' | 'PRINT' | 'COMPLETION'

export default function KioskReviewPage() {
  const router = useRouter()
  const { t } = useKioskTranslation()
  const { patientData, intakeAnswers, documents, advanceStep, resetSession, updateActivity } = useKioskStore()

  const [stage, setStage] = useState<ReviewWorkflowStage>('SUMMARY')
  const [printStatus, setPrintStatus] = useState<'IDLE' | 'PRINTING' | 'DONE'>('IDLE')
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    advanceStep('REVIEW')
  }, [advanceStep])

  // ── Privacy Reset Countdown on Completion ───────────────────────────────────

  useEffect(() => {
    if (stage === 'COMPLETION') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            resetSession()
            router.replace('/kiosk')
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [stage, resetSession, router])

  // ── Print Simulation ────────────────────────────────────────────────────────

  const handleStartPrint = useCallback(() => {
    updateActivity()
    setStage('PRINT')
    setPrintStatus('PRINTING')

    setTimeout(() => {
      setPrintStatus('DONE')
      setTimeout(() => {
        setStage('COMPLETION')
      }, 1800)
    }, 1800)
  }, [updateActivity])

  const handleManualReset = useCallback(() => {
    resetSession()
    router.replace('/kiosk')
  }, [resetSession, router])

  // Default patient values for presentation if accessed directly in dev
  const patientName = patientData?.name ?? 'Dhananjay Patil'
  const patientAge = patientData?.age ?? 67
  const patientSex = patientData?.sex ?? 'Male'
  const chiefComplaint = intakeAnswers['chief_complaint'] ?? 'Stomach Pain (Gastric / Digestion)'
  const duration = intakeAnswers['duration'] ?? '1 to 2 weeks'
  const quality = intakeAnswers['character'] ?? 'Burning sensation / Acidity'
  const lifestyle = intakeAnswers['lifestyle_ahara'] ?? 'Worse after spicy, oily, or heavy meals'

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#191b23]">
      {/* Spacer for header */}
      <div className="h-14 shrink-0" />

      <div className="flex-1 w-full max-w-[620px] mx-auto px-5 py-6 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* ════════════════════════════════════════════════════════════════════
              STATE 1: FINAL REVIEW & AI-ASSISTED SUMMARY (Stitch p_20)
          ════════════════════════════════════════════════════════════════════ */}
          {stage === 'SUMMARY' && (
            <motion.div
              key="stage-summary"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4"
            >
              {/* Header */}
              <div className="text-center space-y-1">
                <h1 className="text-[26px] font-bold text-[#191b23] leading-tight">
                  {t.review.title}
                </h1>
                <p className="text-[14px] text-[#737686]">
                  {t.review.titleSub}
                </p>
              </div>

              {/* Review Card 1: Patient Demographics */}
              <div className="bg-white rounded-2xl p-4 border border-[#e1e2ed] shadow-sm flex items-center justify-between text-[14px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center font-bold text-[14px]">
                    {patientName.charAt(0)}
                  </div>
                  <div>
                    <span className="text-[15px] font-bold text-[#191b23] block leading-tight">
                      {patientName}
                    </span>
                    <span className="text-[12px] text-[#737686]">
                      {patientAge} yrs · {patientSex}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#006a61] bg-[#86f2e4]/30 px-2.5 py-1 rounded-md uppercase">
                  Verified ID
                </span>
              </div>

              {/* Review Card 2: Recorded Clinical Intake */}
              <div className="bg-white rounded-2xl p-4 border border-[#e1e2ed] shadow-sm flex flex-col gap-2.5 text-[13px]">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#ededf9]">
                  <span className="font-bold text-[#191b23] text-[14px]">
                    {t.review.healthSummaryTitle}
                  </span>
                  <button
                    onClick={() => router.push('/kiosk/intake')}
                    className="text-[12px] font-bold text-[#004ac6] hover:underline"
                  >
                    {t.common.edit} ✎
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-left">
                  <div>
                    <span className="text-[11px] text-[#737686] block">Complaint:</span>
                    <span className="font-bold text-[#191b23]">{chiefComplaint}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#737686] block">Duration:</span>
                    <span className="font-semibold text-[#191b23]">{duration}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#737686] block">Sensation:</span>
                    <span className="font-semibold text-[#191b23]">{quality}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#737686] block">Diet Factor:</span>
                    <span className="font-semibold text-[#006a61]">{lifestyle}</span>
                  </div>
                </div>
              </div>

              {/* Review Card 3: Documents Attached */}
              <div className="bg-white rounded-2xl p-4 border border-[#e1e2ed] shadow-sm flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#ededf9] text-[#434655] flex items-center justify-center font-bold">
                    📄
                  </div>
                  <div>
                    <span className="font-bold text-[#191b23] block">
                      {documents.length > 0
                        ? `${documents.length} Medical Document(s) Attached`
                        : 'No New Paper Documents (Existing Records Linked)'}
                    </span>
                    <span className="text-[11px] text-[#737686]">
                      {documents.length > 0
                        ? documents.map((d) => d.name).join(', ')
                        : 'Previous hospital visit records will be referenced'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/kiosk/documents')}
                  className="text-[12px] font-bold text-[#004ac6] hover:underline"
                >
                  {t.common.edit} ✎
                </button>
              </div>

              {/* Review Card 4: AI-Assisted Pre-Consultation Summary */}
              <div className="bg-[#f0fdf4] rounded-2xl p-4 border border-[#bbf7d0] shadow-sm flex flex-col gap-2 text-left text-[13px]">
                <div className="flex items-center gap-2">
                  <span className="text-[16px]">✨</span>
                  <span className="font-bold text-[#15803d] text-[14px]">
                    {t.review.aiSummaryTitle}
                  </span>
                </div>
                <p className="text-[12px] text-[#166534] leading-relaxed">
                  {t.review.aiSummaryDisclaimer}
                </p>
                <div className="bg-white/80 p-2.5 rounded-xl border border-[#bbf7d0] text-[12px] text-[#14532d] space-y-1">
                  <p>• <strong>Clinical synthesis:</strong> Sub-acute gastric discomfort with meal correlation.</p>
                  <p>• <strong>Pre-triage:</strong> Routine General Medicine / Ayush OPD Consultation.</p>
                </div>
              </div>

              {/* Final Confirmation Buttons */}
              <div className="flex flex-col gap-2.5 pt-2">
                <KioskButton
                  variant="primary"
                  size="fullLg"
                  onClick={() => {
                    setStage('TOKEN')
                    updateActivity()
                  }}
                >
                  {t.review.confirmAndGenerateToken}
                </KioskButton>

                <div className="flex gap-2">
                  <KioskButton
                    variant="secondary"
                    size="md"
                    className="flex-1"
                    onClick={() => router.push('/kiosk/intake')}
                  >
                    {t.review.editHealthAnswers}
                  </KioskButton>
                  <KioskButton
                    variant="ghost"
                    size="md"
                    className="flex-1"
                    onClick={() => router.push('/kiosk/documents')}
                  >
                    {t.review.reviewDocuments}
                  </KioskButton>
                </div>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STATE 2: OPD TOKEN ISSUANCE SCREEN (Stitch p_21)
          ════════════════════════════════════════════════════════════════════ */}
          {stage === 'TOKEN' && (
            <motion.div
              key="stage-token"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4 text-center"
            >
              {/* Header */}
              <div className="space-y-0.5">
                <span className="text-[12px] font-bold text-[#006a61] uppercase tracking-wider">
                  Registration Complete
                </span>
                <h1 className="text-[26px] font-bold text-[#191b23]">
                  {t.token.title}
                </h1>
                <p className="text-[13px] text-[#737686]">
                  {t.token.titleSub}
                </p>
              </div>

              {/* Large Dominant OPD Token Card */}
              <div className="relative w-full rounded-3xl bg-[#004ac6] text-white shadow-xl overflow-hidden p-6 flex flex-col items-center justify-center">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-28 h-28 bg-[#86f2e4]/20 rounded-full blur-xl pointer-events-none" />

                <span className="text-[12px] font-bold tracking-widest text-[#dbe1ff] uppercase">
                  {t.token.tokenNumberLabel}
                </span>

                {/* Dominant Token Typography */}
                <span className="text-[72px] font-extrabold tracking-tight leading-none my-2 font-mono drop-shadow-md">
                  {t.token.tokenNumber}
                </span>

                <span className="text-[13px] text-[#dbe1ff]">
                  Patient: <strong>{patientName}</strong>
                </span>
              </div>

              {/* Location & Wait Time Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="bg-white p-3.5 rounded-2xl border border-[#e1e2ed] shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center text-[18px]">
                    ⏱️
                  </div>
                  <div>
                    <span className="text-[11px] text-[#737686] block uppercase font-bold">
                      {t.token.estimatedWaitLabel}
                    </span>
                    <span className="text-[13px] font-bold text-[#191b23]">
                      {t.token.estimatedWait}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-[#e1e2ed] shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#86f2e4]/30 text-[#006a61] flex items-center justify-center text-[18px]">
                    🚪
                  </div>
                  <div>
                    <span className="text-[11px] text-[#737686] block uppercase font-bold">
                      {t.token.locationLabel}
                    </span>
                    <span className="text-[13px] font-bold text-[#191b23]">
                      {t.token.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Checklist */}
              <div className="bg-[#ededf9]/60 p-3 rounded-2xl border border-[#c3c6d7]/50 text-left text-[12px] text-[#434655] space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[#006a61] font-bold">✓</span>
                  <span>{t.token.status1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#006a61] font-bold">✓</span>
                  <span>{t.token.status2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#006a61] font-bold">✓</span>
                  <span>{t.token.status3}</span>
                </div>
              </div>

              {/* Primary Actions */}
              <div className="flex flex-col gap-2.5 pt-1">
                <KioskButton
                  variant="primary"
                  size="fullLg"
                  onClick={handleStartPrint}
                >
                  {t.token.printButton}
                </KioskButton>

                <KioskButton
                  variant="secondary"
                  size="full"
                  onClick={() => setStage('COMPLETION')}
                >
                  {t.token.proceedWaiting} →
                </KioskButton>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STATE 3: PRINT SIMULATION SCREEN
          ════════════════════════════════════════════════════════════════════ */}
          {stage === 'PRINT' && (
            <motion.div
              key="stage-print"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-6 py-10 text-center"
            >
              {printStatus === 'PRINTING' && (
                <>
                  <div className="w-20 h-20 rounded-3xl bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center animate-bounce">
                    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 6 2 18 2 18 9" />
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                      <rect x="6" y="14" width="12" height="8" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-[24px] font-bold text-[#191b23]">
                      {t.token.printing}
                    </h2>
                    <p className="text-[14px] text-[#737686] mt-1">
                      Dispensing token slip for #{t.token.tokenNumber}
                    </p>
                  </div>
                </>
              )}

              {printStatus === 'DONE' && (
                <>
                  <div className="w-20 h-20 rounded-full bg-[#006a61] text-white flex items-center justify-center shadow-lg">
                    <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-[24px] font-bold text-[#191b23]">
                      {t.token.printSuccess}
                    </h2>
                    <p className="text-[14px] text-[#737686] mt-1">
                      Proceeding to next steps…
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STATE 4: COMPLETION & PRIVACY RESET COUNTDOWN (Stitch p_22)
          ════════════════════════════════════════════════════════════════════ */}
          {stage === 'COMPLETION' && (
            <motion.div
              key="stage-completion"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5 text-center"
            >
              {/* Success Badge */}
              <div className="w-20 h-20 rounded-full bg-[#006a61] text-white flex items-center justify-center mx-auto shadow-md">
                <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <div className="space-y-1">
                <h1 className="text-[28px] font-bold text-[#191b23]">
                  {t.token.proceedWaiting}
                </h1>
                <p className="text-[15px] text-[#434655] max-w-[480px] mx-auto leading-relaxed">
                  {t.token.nextStepsDesc}
                </p>
              </div>

              {/* Consultation Details Card */}
              <div className="bg-white p-5 rounded-3xl border border-[#e1e2ed] shadow-sm flex flex-col gap-3 text-left text-[14px]">
                <div className="flex justify-between items-center pb-2 border-b border-[#ededf9]">
                  <span className="text-[#737686]">Token Number:</span>
                  <span className="text-[22px] font-bold font-mono text-[#004ac6]">{t.token.tokenNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#737686]">OPD Department:</span>
                  <span className="font-bold text-[#191b23]">General Medicine &amp; Ayush OPD</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#737686]">Assigned Room:</span>
                  <span className="font-semibold text-[#191b23]">Room 104 (First Floor)</span>
                </div>
              </div>

              {/* Automatic Privacy Reset Countdown Alert */}
              <div className="p-3.5 bg-[#ededf9] rounded-2xl border border-[#c3c6d7] flex items-center justify-center gap-2 text-[13px] text-[#434655]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#004ac6] animate-ping" />
                <span>
                  {t.token.resetCountdown} <strong>{countdown}s</strong>
                </span>
              </div>

              {/* Manual Reset Action */}
              <div className="pt-2">
                <KioskButton
                  variant="primary"
                  size="fullLg"
                  onClick={handleManualReset}
                >
                  {t.token.resetNow}
                </KioskButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
