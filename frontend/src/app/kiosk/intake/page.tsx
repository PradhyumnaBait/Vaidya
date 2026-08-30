'use client'
/**
 * K-05 — Clinical Intake Interview (Phase 3 + Multimodal + Multilingual)
 *
 * Route: /kiosk/intake
 *
 * Multilingual Architecture:
 * - Powered by useKioskTranslation() for complete EN, HI, MR translations.
 */

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useKioskStore } from '@/store/kiosk.store'
import { useKioskTranslation } from '@/lib/hooks/use-kiosk-translation'
import { KioskButton } from '@/components/kiosk/kiosk-button'

type IntakeStage =
  | 'INTRO'
  | 'CHIEF_COMPLAINT'
  | 'DURATION'
  | 'CHARACTER'
  | 'AYUSH_LIFESTYLE'
  | 'SUMMARY'

type VoiceModalState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'CONFIRMING'

export default function KioskIntakePage() {
  const router = useRouter()
  const { t } = useKioskTranslation()
  const { language, patientData, advanceStep, setIntakeAnswer, resetSession, updateActivity } = useKioskStore()

  const [stage, setStage] = useState<IntakeStage>('INTRO')
  const [voiceModal, setVoiceModal] = useState<VoiceModalState>('IDLE')
  const [activeVoiceQuestion, setActiveVoiceQuestion] = useState<string>('')
  const [recognizedText, setRecognizedText] = useState<{ native: string; english: string }>({ native: '', english: '' })
  const [matchedOption, setMatchedOption] = useState<string>('')
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false)

  // Answers State
  const [selectedComplaint, setSelectedComplaint] = useState<string>(t.intake.catStomach)
  const [selectedDuration, setSelectedDuration] = useState<string>(t.intake.durWeeks)
  const [selectedCharacter, setSelectedCharacter] = useState<string>(t.intake.qualBurning)
  const [selectedLifestyle, setSelectedLifestyle] = useState<string>(t.intake.lifeSpicy)

  useEffect(() => {
    advanceStep('INTAKE')
  }, [advanceStep])

  // ── TTS Question Playback Simulation ───────────────────────────────────────

  const handleHearQuestion = useCallback(() => {
    updateActivity()
    setIsSpeakingQuestion(true)
    setTimeout(() => {
      setIsSpeakingQuestion(false)
    }, 2200)
  }, [updateActivity])

  // ── Multimodal Voice Recognition for Current Question ──────────────────────

  const handleStartVoiceForQuestion = useCallback(
    (questionKey: string, sampleNative: string, sampleEnglish: string, targetOption: string) => {
      updateActivity()
      setActiveVoiceQuestion(questionKey)
      setVoiceModal('LISTENING')
      setRecognizedText({ native: sampleNative, english: sampleEnglish })
      setMatchedOption(targetOption)

      // Simulate listening
      setTimeout(() => {
        setVoiceModal('PROCESSING')
        setTimeout(() => {
          setVoiceModal('CONFIRMING')
        }, 800)
      }, 2200)
    },
    [updateActivity]
  )

  const handleConfirmVoiceAnswer = useCallback(() => {
    updateActivity()
    if (activeVoiceQuestion === 'CHIEF_COMPLAINT') {
      setSelectedComplaint(matchedOption)
      setIntakeAnswer('chief_complaint', matchedOption)
      setVoiceModal('IDLE')
      setStage('DURATION')
    } else if (activeVoiceQuestion === 'DURATION') {
      setSelectedDuration(matchedOption)
      setIntakeAnswer('duration', matchedOption)
      setVoiceModal('IDLE')
      setStage('CHARACTER')
    } else if (activeVoiceQuestion === 'CHARACTER') {
      setSelectedCharacter(matchedOption)
      setIntakeAnswer('character', matchedOption)
      setVoiceModal('IDLE')
      setStage('AYUSH_LIFESTYLE')
    } else if (activeVoiceQuestion === 'AYUSH_LIFESTYLE') {
      setSelectedLifestyle(matchedOption)
      setIntakeAnswer('lifestyle_ahara', matchedOption)
      setVoiceModal('IDLE')
      setStage('SUMMARY')
    }
  }, [activeVoiceQuestion, matchedOption, setIntakeAnswer, updateActivity])

  // ── Touch Selection Handlers ────────────────────────────────────────────────

  const handleSelectComplaint = useCallback(
    (complaint: string) => {
      updateActivity()
      setSelectedComplaint(complaint)
      setIntakeAnswer('chief_complaint', complaint)
      setStage('DURATION')
    },
    [setIntakeAnswer, updateActivity]
  )

  const handleSelectDuration = useCallback(
    (dur: string) => {
      updateActivity()
      setSelectedDuration(dur)
      setIntakeAnswer('duration', dur)
      setStage('CHARACTER')
    },
    [setIntakeAnswer, updateActivity]
  )

  const handleSelectCharacter = useCallback(
    (char: string) => {
      updateActivity()
      setSelectedCharacter(char)
      setIntakeAnswer('character', char)
      setStage('AYUSH_LIFESTYLE')
    },
    [setIntakeAnswer, updateActivity]
  )

  const handleSelectLifestyle = useCallback(
    (life: string) => {
      updateActivity()
      setSelectedLifestyle(life)
      setIntakeAnswer('lifestyle_ahara', life)
      setStage('SUMMARY')
    },
    [setIntakeAnswer, updateActivity]
  )

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#191b23]">
      {/* Spacer for fixed header */}
      <div className="h-14 shrink-0" />

      {/* Main container */}
      <div className="flex-1 w-full max-w-[620px] mx-auto px-5 py-6 flex flex-col justify-center">
        {/* Patient header chip */}
        {patientData && stage !== 'SUMMARY' && (
          <div className="flex items-center justify-between bg-white px-4 py-2 rounded-2xl border border-[#e1e2ed] shadow-sm mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center font-bold text-[12px]">
                {patientData.name.charAt(0)}
              </div>
              <span className="text-[13px] font-bold text-[#191b23]">
                {patientData.name} ({patientData.age} yrs)
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#006a61] bg-[#86f2e4]/30 px-2 py-0.5 rounded-md">
              {t.intake.title}
            </span>
          </div>
        )}

        {/* Adaptive Question Progress Timeline */}
        {stage !== 'INTRO' && stage !== 'SUMMARY' && (
          <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap pb-3 mb-2 text-[12px]">
            <div
              className={[
                'px-3 py-1 rounded-full font-semibold transition-all flex items-center gap-1',
                stage === 'CHIEF_COMPLAINT'
                  ? 'bg-[#004ac6] text-white shadow-sm'
                  : 'bg-[#ededf9] text-[#004ac6]',
              ].join(' ')}
            >
              <span>{t.intake.timelineComplaint}</span>
              {stage !== 'CHIEF_COMPLAINT' && <span>✓</span>}
            </div>
            <span className="text-[#a1a1aa]">→</span>

            <div
              className={[
                'px-3 py-1 rounded-full font-semibold transition-all flex items-center gap-1',
                stage === 'DURATION'
                  ? 'bg-[#004ac6] text-white shadow-sm'
                  : stage === 'CHARACTER' || stage === 'AYUSH_LIFESTYLE'
                  ? 'bg-[#ededf9] text-[#004ac6]'
                  : 'bg-[#f3f3fe] text-[#a1a1aa]',
              ].join(' ')}
            >
              <span>{t.intake.timelineDuration}</span>
              {(stage === 'CHARACTER' || stage === 'AYUSH_LIFESTYLE') && <span>✓</span>}
            </div>
            <span className="text-[#a1a1aa]">→</span>

            <div
              className={[
                'px-3 py-1 rounded-full font-semibold transition-all flex items-center gap-1',
                stage === 'CHARACTER'
                  ? 'bg-[#004ac6] text-white shadow-sm'
                  : stage === 'AYUSH_LIFESTYLE'
                  ? 'bg-[#ededf9] text-[#004ac6]'
                  : 'bg-[#f3f3fe] text-[#a1a1aa]',
              ].join(' ')}
            >
              <span>{t.intake.timelineQuality}</span>
              {stage === 'AYUSH_LIFESTYLE' && <span>✓</span>}
            </div>
            <span className="text-[#a1a1aa]">→</span>

            <div
              className={[
                'px-3 py-1 rounded-full font-semibold transition-all',
                stage === 'AYUSH_LIFESTYLE'
                  ? 'bg-[#004ac6] text-white shadow-sm'
                  : 'bg-[#f3f3fe] text-[#a1a1aa]',
              ].join(' ')}
            >
              <span>{t.intake.timelineLifestyle}</span>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ════════════════════════════════════════════════════════════════════
              STAGE 1: INTAKE INTRO
          ════════════════════════════════════════════════════════════════════ */}
          {stage === 'INTRO' && (
            <motion.div
              key="stage-intro"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6 text-center"
            >
              <div className="space-y-1.5">
                <span className="text-[13px] font-bold text-[#004ac6] tracking-wider uppercase">
                  Vaidya Clinical Intake
                </span>
                <h1 className="text-[30px] font-bold text-[#191b23] leading-tight">
                  {t.intake.title}
                </h1>
                <p className="text-[14px] text-[#737686] max-w-[480px] mx-auto leading-relaxed">
                  {t.intake.introDesc}
                </p>
              </div>

              {/* Multimodal Feature Cards */}
              <div className="bg-white rounded-3xl p-6 border border-[#e1e2ed] shadow-sm flex flex-col gap-4 text-left">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="22" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#191b23]">{t.intake.voiceFeatureTitle}</h3>
                    <p className="text-[13px] text-[#737686]">{t.intake.voiceFeatureDesc}</p>
                  </div>
                </div>

                <div className="h-[1px] bg-[#ededf9]" />

                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#86f2e4]/30 text-[#006a61] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M9 9h6M9 13h6M9 17h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-[#191b23]">{t.intake.touchFeatureTitle}</h3>
                    <p className="text-[13px] text-[#737686]">{t.intake.touchFeatureDesc}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <KioskButton
                  variant="primary"
                  size="fullLg"
                  onClick={() => {
                    setStage('CHIEF_COMPLAINT')
                    updateActivity()
                  }}
                >
                  {t.intake.startIntakeButton}
                </KioskButton>

                <KioskButton
                  variant="ghost"
                  size="full"
                  onClick={() => router.push('/kiosk/consent')}
                >
                  ← {t.common.back}
                </KioskButton>
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 2: CHIEF COMPLAINT (Stitch p_06)
          ════════════════════════════════════════════════════════════════════ */}
          {stage === 'CHIEF_COMPLAINT' && (
            <motion.div
              key="stage-complaint"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4"
            >
              {/* Question Header with Audio Affordance */}
              <div className="text-center space-y-1">
                <div className="flex justify-center items-center gap-2">
                  <h1 className="text-[25px] font-bold text-[#191b23] leading-tight">
                    {t.intake.complaintTitle}
                  </h1>
                  <button
                    onClick={() => handleHearQuestion()}
                    className="p-1.5 rounded-full bg-[#ededf9] text-[#004ac6] hover:bg-[#dbe1ff] transition-colors"
                    aria-label="Hear question audio"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  </button>
                </div>
                <p className="text-[14px] text-[#737686]">
                  {t.intake.complaintSub}
                </p>
                {isSpeakingQuestion && (
                  <span className="text-[11px] font-semibold text-[#004ac6] bg-[#f3f3fe] px-2.5 py-0.5 rounded-full animate-pulse">
                    {t.intake.playingAudio}
                  </span>
                )}
              </div>

              {/* Voice Primary Widget */}
              <div className="bg-white rounded-3xl p-4 border border-[#e1e2ed] shadow-sm flex flex-col items-center gap-2 text-center">
                <button
                  onClick={() => {
                    const samples: Record<string, string> = {
                      mr: 'माझं पोट खूप दुखतंय, विशेषतः जेवल्यानंतर.',
                      hi: 'मेरे पेट में बहुत दर्द हो रहा है, खासकर खाने के बाद।',
                      gu: 'મને પેટમાં ખૂબ દુખાવો થાય છે, ખાસ કરીને જમ્યા પછી.',
                      bn: 'আমার পেটে খুব ব্যথা হচ্ছে, বিশেষ করে খাওয়ার পরে।',
                      ta: 'எனக்கு வயிறு மிகவும் வலிக்கிறது, குறிப்பாக சாப்பிட்ட பிறகு.',
                      en: 'My stomach hurts a lot, especially after eating.',
                    }
                    handleStartVoiceForQuestion(
                      'CHIEF_COMPLAINT',
                      samples[language ?? 'en'] ?? samples.en,
                      'My stomach hurts a lot, especially after eating.',
                      t.intake.catStomach
                    )
                  }}
                  className="w-16 h-16 rounded-full bg-[#004ac6] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(0,74,198,0.25)] hover:scale-105 active:scale-95 transition-transform"
                  aria-label="Speak symptoms"
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="22" />
                  </svg>
                </button>
                <span className="text-[13px] font-bold text-[#004ac6]">
                  {t.intake.complaintVoicePrompt}
                </span>
              </div>


              <div className="flex items-center gap-2">
                <div className="h-[1px] flex-1 bg-[#e1e2ed]" />
                <span className="text-[10px] font-bold text-[#737686] uppercase tracking-wider">
                  {t.intake.orSelectCat}
                </span>
                <div className="h-[1px] flex-1 bg-[#e1e2ed]" />
              </div>

              {/* Touch Category Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { name: t.intake.catStomach, icon: '🥣' },
                  { name: t.intake.catChest, icon: '🫀' },
                  { name: t.intake.catHead, icon: '🧠' },
                  { name: t.intake.catJoints, icon: '🦴' },
                  { name: t.intake.catFever, icon: '🌡️' },
                  { name: t.intake.catOther, icon: '➕' },
                ].map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleSelectComplaint(cat.name)}
                    className="p-3 bg-white rounded-2xl border-2 border-[#e1e2ed] hover:border-[#004ac6] hover:bg-[#faf8ff] shadow-sm flex items-center gap-2.5 text-left transition-all active:scale-98"
                  >
                    <span className="text-[20px] shrink-0">{cat.icon}</span>
                    <span className="text-[13px] font-bold text-[#191b23] block truncate">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 3: DURATION & ONSET
          ════════════════════════════════════════════════════════════════════ */}
          {stage === 'DURATION' && (
            <motion.div
              key="stage-duration"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4"
            >
              <div className="space-y-1 text-center">
                <div className="flex justify-center items-center gap-2">
                  <h1 className="text-[24px] font-bold text-[#191b23] leading-tight">
                    {t.intake.durationTitle}
                  </h1>
                  <button
                    onClick={() => handleHearQuestion()}
                    className="p-1.5 rounded-full bg-[#ededf9] text-[#004ac6] hover:bg-[#dbe1ff]"
                    aria-label="Hear question audio"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  </button>
                </div>
                <p className="text-[14px] text-[#737686]">
                  {t.intake.durationSub}
                </p>
                {isSpeakingQuestion && (
                  <span className="text-[11px] font-semibold text-[#004ac6] bg-[#f3f3fe] px-2.5 py-0.5 rounded-full animate-pulse">
                    {t.intake.playingAudio}
                  </span>
                )}
              </div>

              {/* Multimodal Speak Action Bar */}
              <div className="bg-[#f3f3fe] p-3 rounded-2xl border border-[#dbe1ff] flex items-center justify-between">
                <span className="text-[13px] text-[#434655]">
                  {t.intake.durationRegarding} <strong className="text-[#004ac6]">{selectedComplaint}</strong>
                </span>
                <button
                  onClick={() => {
                    const samples: Record<string, string> = {
                      mr: 'जवळपास १ ते २ आठवड्यांपासून आहे.',
                      hi: 'लगभग 1 से 2 हफ़्ते से यह समस्या है।',
                      gu: 'લગભગ ૧ થી ૨ અઠવાડિયાથી આ તકલીફ છે.',
                      bn: 'প্রায় ১ থেকে ২ সপ্তাহ ধরে এই সমস্যা হচ্ছে।',
                      ta: 'சுமார் 1 முதல் 2 வாரங்களாக இந்த பிரச்சனை உள்ளது.',
                      en: 'It has been about 1 to 2 weeks.',
                    }
                    handleStartVoiceForQuestion(
                      'DURATION',
                      samples[language ?? 'en'] ?? samples.en,
                      'It has been about 1 to 2 weeks.',
                      t.intake.durWeeks
                    )
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#004ac6] text-white rounded-xl text-[12px] font-bold hover:bg-[#003ea8]"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  </svg>
                  {t.intake.speakAnswer}
                </button>
              </div>

              {/* Touch Options */}
              <div className="flex flex-col gap-2.5">
                {[
                  t.intake.durAcute,
                  t.intake.durWeeks,
                  t.intake.durChronic,
                  t.intake.durIntermittent,
                ].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelectDuration(opt)}
                    className="p-3.5 bg-white rounded-2xl border-2 border-[#e1e2ed] hover:border-[#004ac6] hover:bg-[#faf8ff] shadow-sm flex items-center justify-between text-left transition-all active:scale-98"
                  >
                    <span className="text-[15px] font-bold text-[#191b23] block">
                      {opt}
                    </span>
                    <span className="text-[16px] text-[#004ac6]">→</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStage('CHIEF_COMPLAINT')}
                className="text-[13px] font-semibold text-[#737686] hover:text-[#191b23] py-1 text-left"
              >
                ← {t.common.back}
              </button>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 4: CHARACTER & QUALITY
          ════════════════════════════════════════════════════════════════════ */}
          {stage === 'CHARACTER' && (
            <motion.div
              key="stage-character"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4"
            >
              <div className="space-y-1 text-center">
                <div className="flex justify-center items-center gap-2">
                  <h1 className="text-[24px] font-bold text-[#191b23] leading-tight">
                    {t.intake.qualityTitle}
                  </h1>
                  <button
                    onClick={() => handleHearQuestion()}
                    className="p-1.5 rounded-full bg-[#ededf9] text-[#004ac6] hover:bg-[#dbe1ff]"
                    aria-label="Hear question audio"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  </button>
                </div>
                <p className="text-[14px] text-[#737686]">
                  {t.intake.qualitySub}
                </p>
                {isSpeakingQuestion && (
                  <span className="text-[11px] font-semibold text-[#004ac6] bg-[#f3f3fe] px-2.5 py-0.5 rounded-full animate-pulse">
                    {t.intake.playingAudio}
                  </span>
                )}
              </div>

              {/* Multimodal Speak Action Bar */}
              <div className="bg-[#f3f3fe] p-3 rounded-2xl border border-[#dbe1ff] flex items-center justify-between">
                <span className="text-[13px] text-[#434655]">
                  {t.intake.qualityRegarding}
                </span>
                <button
                  onClick={() => {
                    const samples: Record<string, string> = {
                      mr: 'पोटात खूप जळजळ होते आणि ॲसिडिटी वाटते.',
                      hi: 'पेट में जलन और एसिडिटी जैसा दर्द है।',
                      gu: 'પેટમાં ખૂબ બળતરા થાય છે અને એસિડિટી લાગે છે.',
                      bn: 'পেটে খুব জ্বালাপোড়া ও অ্যাসিডিটি ভাব হচ্ছে।',
                      ta: 'வயிற்றில் மிகுந்த எரிச்சலும் அசிடிட்டியும் உணரப்படுகிறது.',
                      en: 'It feels like burning sensation and acidity.',
                    }
                    handleStartVoiceForQuestion(
                      'CHARACTER',
                      samples[language ?? 'en'] ?? samples.en,
                      'It feels like burning sensation and acidity.',
                      t.intake.qualBurning
                    )
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#004ac6] text-white rounded-xl text-[12px] font-bold hover:bg-[#003ea8]"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  </svg>
                  {t.intake.speakAnswer}
                </button>
              </div>

              {/* Touch Options */}
              <div className="flex flex-col gap-2.5">
                {[
                  t.intake.qualBurning,
                  t.intake.qualDull,
                  t.intake.qualSharp,
                  t.intake.qualCramp,
                  t.intake.qualNotSure,
                ].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelectCharacter(opt)}
                    className="p-3.5 bg-white rounded-2xl border-2 border-[#e1e2ed] hover:border-[#004ac6] hover:bg-[#faf8ff] shadow-sm flex items-center justify-between text-left transition-all active:scale-98"
                  >
                    <span className="text-[15px] font-bold text-[#191b23] block">
                      {opt}
                    </span>
                    <span className="text-[16px] text-[#004ac6]">→</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStage('DURATION')}
                className="text-[13px] font-semibold text-[#737686] hover:text-[#191b23] py-1 text-left"
              >
                ← {t.common.back}
              </button>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 5: AYUSH & LIFESTYLE
          ════════════════════════════════════════════════════════════════════ */}
          {stage === 'AYUSH_LIFESTYLE' && (
            <motion.div
              key="stage-lifestyle"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4"
            >
              <div className="space-y-1 text-center">
                <div className="flex justify-center items-center gap-2">
                  <h1 className="text-[24px] font-bold text-[#191b23] leading-tight">
                    {t.intake.lifestyleTitle}
                  </h1>
                  <button
                    onClick={() => handleHearQuestion()}
                    className="p-1.5 rounded-full bg-[#ededf9] text-[#006a61] hover:bg-[#dbe1ff]"
                    aria-label="Hear question audio"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  </button>
                </div>
                <p className="text-[14px] text-[#737686]">
                  {t.intake.lifestyleSub}
                </p>
                {isSpeakingQuestion && (
                  <span className="text-[11px] font-semibold text-[#006a61] bg-[#f0fdfa] px-2.5 py-0.5 rounded-full animate-pulse">
                    {t.intake.playingAudio}
                  </span>
                )}
              </div>

              {/* Multimodal Speak Action Bar */}
              <div className="bg-[#f0fdfa] p-3 rounded-2xl border border-[#99f6e4] flex items-center justify-between">
                <span className="text-[13px] text-[#006a61] font-medium">
                  {t.intake.lifestyleTag}
                </span>
                <button
                  onClick={() => {
                    const samples: Record<string, string> = {
                      mr: 'तिखट आणि तेलकट जेवल्यानंतर पोटात जास्त त्रास होतो.',
                      hi: 'मसालेदार और तला हुआ खाना खाने के बाद दर्द बढ़ता है।',
                      gu: 'તીખું અને તળેલું જમ્યા પછી પેટમાં વધુ તકલીફ થાય છે.',
                      bn: 'ঝাল ও তৈলাক্ত খাবার খাওয়ার পর পেটের কষ্ট বাড়ে।',
                      ta: 'காரமான மற்றும் எண்ணெய்ப் பொருட்கள் சாப்பிட்ட பின் வலி அதிகமாகிறது.',
                      en: 'Hurts more after spicy and oily food.',
                    }
                    handleStartVoiceForQuestion(
                      'AYUSH_LIFESTYLE',
                      samples[language ?? 'en'] ?? samples.en,
                      'Hurts more after spicy and oily food.',
                      t.intake.lifeSpicy
                    )
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#006a61] text-white rounded-xl text-[12px] font-bold hover:bg-[#005049]"
                >
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  </svg>
                  {t.intake.speakAnswer}
                </button>
              </div>

              {/* Touch Options */}
              <div className="flex flex-col gap-2.5">
                {[
                  t.intake.lifeSpicy,
                  t.intake.lifeFasting,
                  t.intake.lifeStress,
                  t.intake.lifeNoPattern,
                ].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelectLifestyle(opt)}
                    className="p-3.5 bg-white rounded-2xl border-2 border-[#e1e2ed] hover:border-[#006a61] hover:bg-[#f0fdfa] shadow-sm flex items-center justify-between text-left transition-all active:scale-98"
                  >
                    <span className="text-[15px] font-bold text-[#191b23] block">
                      {opt}
                    </span>
                    <span className="text-[16px] text-[#006a61]">→</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStage('CHARACTER')}
                className="text-[13px] font-semibold text-[#737686] hover:text-[#191b23] py-1 text-left"
              >
                ← {t.common.back}
              </button>
            </motion.div>
          )}

          {/* ════════════════════════════════════════════════════════════════════
              STAGE 6: CLINICAL SUMMARY & PHASE 4 HANDOFF
          ════════════════════════════════════════════════════════════════════ */}
          {stage === 'SUMMARY' && (
            <motion.div
              key="stage-summary"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#006a61] text-white flex items-center justify-center mx-auto shadow-md">
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <div className="space-y-1">
                <span className="text-[13px] font-bold text-[#006a61] tracking-wider uppercase">
                  Vaidya Intake Complete
                </span>
                <h1 className="text-[28px] font-bold text-[#191b23]">
                  {t.intake.summaryTitle}
                </h1>
                <p className="text-[14px] text-[#737686]">
                  {t.intake.summarySubtitle}
                </p>
              </div>

              {/* Structured Summary Card */}
              <div className="bg-white rounded-3xl p-5 border border-[#e1e2ed] shadow-sm flex flex-col gap-3 text-left text-[14px]">
                <div className="flex justify-between items-center pb-2 border-b border-[#ededf9]">
                  <span className="font-bold text-[#191b23]">Patient:</span>
                  <span className="font-semibold text-[#004ac6]">
                    {patientData?.name ?? 'Dhananjay Patil'} ({patientData?.age ?? 67} yrs)
                  </span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-[#737686]">{t.intake.timelineComplaint}:</span>
                  <span className="font-bold text-[#191b23] text-right">{selectedComplaint}</span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-[#737686]">{t.intake.timelineDuration}:</span>
                  <span className="font-semibold text-[#191b23] text-right">{selectedDuration}</span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-[#737686]">{t.intake.timelineQuality}:</span>
                  <span className="font-semibold text-[#191b23] text-right">{selectedCharacter}</span>
                </div>

                <div className="flex justify-between items-start">
                  <span className="text-[#737686]">{t.intake.timelineLifestyle}:</span>
                  <span className="font-semibold text-[#006a61] text-right">{selectedLifestyle}</span>
                </div>

                <div className="mt-2 p-2.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl flex items-center gap-2 text-[12px] text-[#15803d]">
                  <span className="font-bold">✓</span>
                  <span>{t.intake.triageNotice}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3 pt-2">
                <KioskButton
                  variant="primary"
                  size="fullLg"
                  onClick={() => {
                    advanceStep('DOCUMENTS')
                    router.push('/kiosk/documents')
                  }}
                >
                  {t.intake.proceedToDocs}
                </KioskButton>

                <div className="flex gap-2">
                  <KioskButton
                    variant="secondary"
                    size="md"
                    className="flex-1"
                    onClick={() => setStage('CHIEF_COMPLAINT')}
                  >
                    {t.intake.editAnswers}
                  </KioskButton>
                  <KioskButton
                    variant="ghost"
                    size="md"
                    className="flex-1"
                    onClick={() => {
                      resetSession()
                      router.replace('/kiosk')
                    }}
                  >
                    {t.common.startOver}
                  </KioskButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Voice Modal Dialog */}
        <AnimatePresence>
          {voiceModal !== 'IDLE' && (
            <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-5">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-6 max-w-[480px] w-full shadow-2xl flex flex-col items-center gap-5 text-center"
              >
                {voiceModal === 'LISTENING' && (
                  <>
                    <div className="w-20 h-20 rounded-full bg-[#004ac6]/10 text-[#004ac6] flex items-center justify-center">
                      <div className="flex items-center gap-1.5 h-10">
                        {[40, 70, 100, 60, 90, 45, 80, 50].map((h, i) => (
                          <div
                            key={i}
                            className="w-1.5 bg-[#004ac6] rounded-full motion-safe:animate-pulse"
                            style={{ height: `${h}%`, animationDelay: `${i * 120}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <h2 className="text-[22px] font-bold text-[#191b23]">{t.intake.voiceModalListening}</h2>
                      <p className="text-[14px] text-[#737686] mt-1">{t.intake.voiceModalListeningDesc}</p>
                    </div>
                  </>
                )}

                {voiceModal === 'PROCESSING' && (
                  <div className="py-6 flex flex-col items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-4 border-[#004ac6] border-t-transparent animate-spin" />
                    <h2 className="text-[18px] font-bold text-[#191b23]">{t.intake.voiceModalTranscribing}</h2>
                  </div>
                )}

                {voiceModal === 'CONFIRMING' && (
                  <div className="w-full flex flex-col gap-4">
                    <span className="text-[11px] font-bold text-[#004ac6] uppercase tracking-wider">
                      {t.intake.voiceResultTitle}
                    </span>
                    <div className="bg-[#f3f3fe] p-4 rounded-2xl border border-[#dbe1ff] text-left">
                      <p className="text-[16px] font-bold text-[#191b23] italic">
                        &quot;{recognizedText.native}&quot;
                      </p>
                      <div className="w-8 h-[1px] bg-[#c3c6d7] my-2" />
                      <p className="text-[13px] text-[#434655]">
                        &quot;{recognizedText.english}&quot;
                      </p>
                    </div>
                    <div className="bg-[#f0fdf4] p-3 rounded-xl border border-[#bbf7d0] text-left text-[13px] text-[#15803d]">
                      <span>{t.intake.matchedOption} <strong>{matchedOption}</strong></span>
                    </div>

                    <div className="flex flex-col gap-2 w-full pt-1">
                      <KioskButton
                        variant="primary"
                        size="full"
                        onClick={handleConfirmVoiceAnswer}
                      >
                        {t.intake.acceptAnswer}
                      </KioskButton>
                      <KioskButton
                        variant="ghost"
                        size="full"
                        onClick={() => setVoiceModal('IDLE')}
                      >
                        {t.intake.cancelTouch}
                      </KioskButton>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
