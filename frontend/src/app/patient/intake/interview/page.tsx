'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, StopCircle, RotateCcw, CheckCircle2, Info, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react'
import { useIntakeStore } from '@/store'

type InterviewState = 'listening' | 'transcribing' | 'confirming' | 'touch' | 'adaptive'

export default function PatientInterviewPage() {
  const router = useRouter()
  const { currentQuestion, submitAnswer, setVoiceTranscription, chiefComplaint } = useIntakeStore()

  // Dynamic state machine
  const [viewState, setViewState] = useState<InterviewState>('listening')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [questionIndex, setQuestionIndex] = useState(4)

  const activeComplaint = chiefComplaint || 'Stomach pain'

  const handleConfirmVoiceAnswer = async () => {
    const textAnswer = "Maaza pot khup dukhatoy, khaaskarun jevanaanantar."
    setVoiceTranscription(textAnswer)
    submitAnswer({
      questionId: currentQuestion?.id || 'q-stomach-loc',
      value: textAnswer,
      timestamp: new Date().toISOString(),
    })

    setViewState('touch')
    setQuestionIndex((prev) => prev + 1)
  }

  const handleNextTouchAnswer = async () => {
    if (!selectedOption) return

    if (selectedOption.toLowerCase().includes('chest') || selectedOption.toLowerCase().includes('severe')) {
      router.push('/patient/alert')
      return
    }

    submitAnswer({
      questionId: currentQuestion?.id || `q-${questionIndex}`,
      value: selectedOption,
      timestamp: new Date().toISOString(),
    })

    setSelectedOption(null)

    if (questionIndex >= 6) {
      router.push('/patient/intake/ayush-intro')
    } else {
      setViewState('adaptive')
      setQuestionIndex((prev) => prev + 1)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7] text-[#191b23] flex flex-col justify-between select-none">
      {/* Header Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-[#E4E4E7]">
        <div className="max-w-[600px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[14px] text-[#2563EB] tracking-tight uppercase">VAIDYA</span>
          </div>
          <span className="text-[11px] font-mono text-[#71717A]">~12 min remaining</span>
        </div>
        <div className="w-full h-1 bg-[#E1E2ED]">
          <div className="h-full bg-[#2563EB] w-[50%] transition-all duration-500" />
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[560px] mx-auto pt-20 pb-28 flex-1 flex flex-col justify-between px-4">
        
        {/* VIEW STATE 1: P-07 LISTENING */}
        {viewState === 'listening' && (
          <div className="flex flex-col flex-1 justify-between py-2">
            {/* Top Context Chip */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE]">
                <CheckCircle2 size={16} className="text-[#2563EB]" />
                <span className="font-mono text-[12px] text-[#2563EB] font-medium">Chief complaint: {activeComplaint}</span>
              </div>
            </div>

            {/* Question Zone */}
            <div className="py-4 flex flex-col items-center text-center gap-2">
              <div className="px-2 py-0.5 rounded bg-[#E1E2ED] text-[#434655] font-mono text-[10px] uppercase">मराठी / Hindi</div>
              <h2 className="text-[28px] font-semibold text-[#191b23] leading-tight">तुम्हाला हे दुखणे कुठे जास्त होते?</h2>
              <p className="text-[15px] text-[#71717A]">Where is the pain most severe?</p>
            </div>

            {/* Active Listening Zone */}
            <div className="flex flex-col items-center justify-center my-6">
              <div className="relative flex items-center justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-[#2563EB]/20 animate-ping absolute" />
                <button
                  onClick={() => setViewState('confirming')}
                  className="relative z-10 w-[72px] h-[72px] rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-lg active:scale-95 cursor-pointer"
                >
                  <Mic size={32} />
                </button>
              </div>

              <span className="text-[15px] font-medium text-[#2563EB] animate-pulse">रेकॉर्डिंग... / Speak now</span>

              {/* Waveform Visualization */}
              <div className="flex items-center gap-1 h-10 px-4 mt-3">
                {[40, 70, 90, 60, 30, 80, 50, 90, 40, 20].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#2563EB] rounded-full animate-pulse"
                    style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </div>

            {/* Actions Zone */}
            <div className="flex flex-col gap-3 mt-auto">
              <button
                onClick={() => setViewState('confirming')}
                className="w-full h-12 rounded-xl bg-[#FFDAD6] text-[#93000A] font-medium flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <StopCircle size={20} />
                <span>Stop listening &amp; Process</span>
              </button>

              <button
                onClick={() => setViewState('touch')}
                className="w-full text-center text-[14px] text-[#2563EB] font-medium underline underline-offset-4 cursor-pointer py-1"
              >
                Choose an answer instead
              </button>
            </div>
          </div>
        )}

        {/* VIEW STATE 2: P-08 CONFIRMING (WE HEARD) */}
        {viewState === 'confirming' && (
          <div className="flex flex-col flex-1 justify-between py-2">
            <div>
              <div className="flex justify-between items-baseline mb-3">
                <span className="font-mono text-[12px] text-[#71717A] uppercase">Question {questionIndex} of ~12</span>
              </div>
              <div className="flex flex-col gap-1 mb-6">
                <h2 className="text-[17px] font-semibold text-[#191b23]">तुम्हाला हे दुखणे कुठे जास्त होते?</h2>
                <p className="text-[14px] text-[#71717A]">Where is the pain most severe?</p>
              </div>

              {/* Transcription Speech Bubble */}
              <div className="flex flex-col gap-2 mb-6">
                <span className="font-mono text-[11px] text-[#71717A] uppercase tracking-wider pl-1">We heard:</span>
                <div className="relative bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-sm flex flex-col gap-3">
                  <p className="text-[18px] italic font-bold text-[#191b23]">
                    &quot;Maaza pot khup dukhatoy, khaaskarun jevanaanantar.&quot;
                  </p>
                  <div className="w-8 h-px bg-[#E4E4E7]" />
                  <p className="text-[15px] text-[#71717A]">
                    &quot;My stomach hurts a lot, especially after eating.&quot;
                  </p>

                  {/* Confidence Warning */}
                  <div className="flex items-start gap-2 bg-[#FFDBCD]/30 p-2.5 rounded-lg border border-[#FFDBCD]">
                    <Info size={18} className="text-[#BC4800] shrink-0 mt-0.5" />
                    <p className="text-[13px] text-[#7D2D00]">We&apos;re not fully sure about this transcription.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-auto">
              <button
                onClick={handleConfirmVoiceAnswer}
                className="w-full h-[52px] bg-[#2563EB] text-white rounded-xl font-semibold text-[16px] shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>हो, हे बरोबर आहे (Yes, that&apos;s right)</span>
                <ArrowRight size={20} />
              </button>

              <button
                onClick={() => setViewState('listening')}
                className="w-full h-[44px] bg-[#E7E7F3] text-[#191b23] rounded-xl font-medium text-[14px] flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw size={18} />
                <span>That&apos;s not right — let me try again</span>
              </button>

              <div className="flex justify-center gap-4 text-[13px] text-[#71717A] pt-2">
                <button onClick={() => setViewState('touch')} className="hover:underline">Type it instead</button>
                <span>•</span>
                <button onClick={() => setViewState('touch')} className="hover:underline">Skip this question</button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW STATE 3: P-09 TOUCH MODE */}
        {viewState === 'touch' && (
          <div className="flex flex-col flex-1 justify-between py-2">
            <div>
              <div className="flex flex-col gap-2 mb-4">
                <h1 className="text-[24px] font-bold text-[#191b23]">
                  आपकी दवाओं से कोई एलर्जी है?
                  <span className="block text-[15px] font-normal text-[#71717A] mt-1">Are you allergic to any medicines?</span>
                </h1>
                <button onClick={() => setViewState('listening')} className="flex items-center gap-1.5 text-[#2563EB] text-[13px] font-medium w-fit">
                  <Mic size={16} /> Speak instead
                </button>
              </div>

              {/* Radio options */}
              <div className="flex flex-col gap-3">
                {[
                  { id: 'no', title: 'नहीं, कोई एलर्जी नहीं है', subtitle: 'No known allergies' },
                  { id: 'unsure', title: 'मुझे पक्का नहीं पता', subtitle: "I'm not sure" },
                  { id: 'yes', title: 'हाँ, एक या अधिक दवाओं से', subtitle: 'Yes, to one or more medicines' },
                  { id: 'other', title: 'अन्य (बताएं)', subtitle: 'Other' },
                ].map((opt) => {
                  const isSelected = selectedOption === opt.id
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedOption(opt.id)}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#EFF6FF] border-[#2563EB] ring-2 ring-[#2563EB]/40 shadow-sm'
                          : 'bg-white border-[#E4E4E7] hover:bg-[#F9F9FA]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className={`text-[16px] font-medium ${isSelected ? 'text-[#2563EB] font-bold' : 'text-[#191b23]'}`}>
                          {opt.title}
                        </span>
                        <span className="text-[13px] text-[#71717A]">{opt.subtitle}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isSelected ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'border-[#C3C6D7]'}`}>
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-[#E4E4E7]">
              <button
                onClick={handleNextTouchAnswer}
                disabled={!selectedOption}
                className="w-full h-[52px] bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#E7E7F3] disabled:text-[#A1A1AA] disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>अगला प्रश्न (Next Question)</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* VIEW STATE 4: P-10 ADAPTIVE TRAIL */}
        {viewState === 'adaptive' && (
          <div className="flex flex-col flex-1 justify-between py-2">
            <div>
              {/* Breadcrumb Trail */}
              <div className="flex items-center gap-2 overflow-x-auto pb-3 text-[12px] font-mono whitespace-nowrap">
                <span className="px-2.5 py-1 bg-[#EFF6FF] text-[#2563EB] rounded-full flex items-center gap-1">
                  <Check size={12} /> Stomach pain
                </span>
                <span className="text-[#A1A1AA]">&rarr;</span>
                <span className="px-2.5 py-1 bg-[#EFF6FF] text-[#2563EB] rounded-full flex items-center gap-1">
                  <Check size={12} /> 3 months
                </span>
                <span className="text-[#A1A1AA]">&rarr;</span>
                <span className="px-2.5 py-1 bg-[#86F2E4]/40 text-[#006F66] rounded-full font-bold">
                  Current Question
                </span>
              </div>

              {/* Question */}
              <div className="flex flex-col gap-1 my-3">
                <p className="text-[13px] italic text-[#2563EB] flex items-center gap-1">
                  <Sparkles size={16} /> Based on what you told us...
                </p>
                <h1 className="text-[22px] font-bold text-[#191b23]">
                  यह दर्द कैसा महसूस होता है?
                  <span className="block text-[16px] font-normal text-[#71717A] mt-0.5">How would you describe the pain?</span>
                </h1>
              </div>

              {/* Adaptive Options */}
              <div className="flex flex-col gap-2.5">
                {[
                  { id: 'burning', title: 'जलन जैसा', subtitle: 'Burning' },
                  { id: 'pressure', title: 'दबाव जैसा', subtitle: 'Dull pressure' },
                  { id: 'sharp', title: 'छुरे जैसा तेज', subtitle: 'Sharp, stabbing' },
                  { id: 'cramping', title: 'ऐंठन', subtitle: 'Cramping' },
                  { id: 'something_else', title: 'अन्य', subtitle: 'Something else' },
                ].map((opt) => {
                  const isSelected = selectedOption === opt.id
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedOption(opt.id)}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#EFF6FF] border-[#2563EB] ring-2 ring-[#2563EB]/40 shadow-sm'
                          : 'bg-white border-[#E4E4E7] hover:bg-[#F9F9FA]'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className={`text-[16px] font-medium ${isSelected ? 'text-[#2563EB] font-bold' : 'text-[#191b23]'}`}>
                          {opt.title}
                        </span>
                        <span className="text-[13px] text-[#71717A]">{opt.subtitle}</span>
                      </div>
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${isSelected ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'border-[#C3C6D7]'}`}>
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-2.5 mt-6 pt-3 border-t border-[#E4E4E7]">
              <button
                onClick={handleNextTouchAnswer}
                disabled={!selectedOption}
                className="w-full h-[52px] bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#E7E7F3] disabled:text-[#A1A1AA] disabled:cursor-not-allowed text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Next</span>
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => setViewState('touch')}
                className="w-full text-center text-[#71717A] text-[14px] hover:text-[#191b23] flex items-center justify-center gap-1 cursor-pointer py-1"
              >
                <ArrowLeft size={16} /> Previous Question
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
