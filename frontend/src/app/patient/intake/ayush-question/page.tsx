'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Leaf, Info, CheckCircle2, Mic, ArrowRight, ArrowLeft } from 'lucide-react'
import { useIntakeStore } from '@/store'

const AHARA_OPTIONS = [
  { id: '2_meals', label: '2 Main Meals (Traditional)' },
  { id: '3_meals', label: '3 Regular Meals' },
  { id: 'irregular', label: 'Irregular / Snacking often' },
  { id: '1_meal', label: '1 Meal a day' },
  { id: 'other', label: 'Other' },
]

export default function AyushQuestionPage() {
  const router = useRouter()
  const { submitAnswer } = useIntakeStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleNext = () => {
    if (!selectedId) return

    const selectedOpt = AHARA_OPTIONS.find((o) => o.id === selectedId)
    submitAnswer({
      questionId: 'q-ayush-ahara',
      questionText: 'आप आमतौर पर कब और कितनी बार खाना खाते हैं?',
      value: selectedOpt?.label || selectedId,
      timestamp: new Date().toISOString(),
    })

    router.push('/patient/intake/progress')
  }

  const handlePrevious = () => {
    router.push('/patient/intake/ayush-intro')
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7] text-[#191b23] flex flex-col justify-between select-none">
      {/* Header Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-[#E4E4E7]">
        <div className="max-w-[600px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0D9488] flex items-center justify-center text-white">
              <Leaf size={20} />
            </div>
            <span className="font-bold text-[16px] text-[#0D9488] tracking-tight">VAIDYA AYUSH</span>
          </div>
          <span className="text-[11px] font-mono text-[#71717A]">~10 min remaining</span>
        </div>
        <div className="w-full h-1 bg-[#E1E2ED] flex">
          <div className="h-full bg-[#0D9488] w-[70%]" />
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[560px] mx-auto px-4 pt-20 pb-36 flex flex-col gap-5 flex-1">
        {/* Header Badge & Title */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0FDFA] rounded-full w-fit border border-[#CCFBF1]">
            <Leaf size={16} className="text-[#0D9488]" />
            <span className="font-mono text-[11px] text-[#0D9488] uppercase font-bold">Ayurvedic intake</span>
          </div>
          <h1 className="text-[24px] sm:text-[28px] font-semibold text-[#191b23] leading-tight">
            आप आमतौर पर कब और कितनी बार खाना खाते हैं?
          </h1>
          <p className="text-[15px] text-[#71717A]">How often do you eat, and at what times?</p>
        </div>

        {/* Info Note */}
        <div className="flex items-start gap-2 p-3 bg-[#F0FDFA] rounded-lg border border-[#CCFBF1]">
          <Info size={18} className="text-[#0D9488] shrink-0 mt-0.5" />
          <p className="text-[13px] italic text-[#0F766E]">
            Your doctor will use this to understand your digestion (Agni).
          </p>
        </div>

        {/* Options List */}
        <div className="flex flex-col gap-3">
          {AHARA_OPTIONS.map((opt) => {
            const isSelected = selectedId === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedId(opt.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? 'bg-[#F0FDFA] border-[#0D9488] shadow-md ring-2 ring-[#0D9488]/30'
                    : 'bg-white border-[#E4E4E7] shadow-sm hover:bg-[#F9F9FA]'
                }`}
              >
                <span className={`text-[16px] font-medium ${isSelected ? 'text-[#0F766E] font-bold' : 'text-[#191b23]'}`}>
                  {opt.label}
                </span>
                <CheckCircle2
                  size={20}
                  className={`text-[#0D9488] transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                />
              </button>
            )
          })}
        </div>

        {/* Voice Secondary */}
        <div className="flex justify-center mt-2">
          <button
            onClick={() => {
              if ('speechSynthesis' in window) {
                const text = 'कृपया अपनी खान-पान की आदतों के बारे में बोलकर बताएं'
                const utterance = new SpeechSynthesisUtterance(text)
                utterance.lang = 'hi-IN'
                window.speechSynthesis.speak(utterance)
              }
            }}
            className="flex items-center gap-2 text-[#0D9488] hover:text-[#0F766E] text-[14px] font-medium cursor-pointer"
          >
            <Mic size={18} />
            <span>Speak your answer</span>
          </button>
        </div>
      </main>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#E4E4E7] flex flex-col gap-2 z-50 max-w-[600px] mx-auto">
        <button
          onClick={handleNext}
          disabled={!selectedId}
          className="w-full h-[52px] bg-[#0D9488] hover:bg-[#0B7A70] disabled:bg-[#E7E7F3] disabled:text-[#A1A1AA] disabled:cursor-not-allowed text-white font-semibold rounded-full flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          <span>Next</span>
          <ArrowRight size={20} />
        </button>
        <button
          onClick={handlePrevious}
          className="w-full h-10 text-[#71717A] hover:text-[#191b23] font-medium text-[14px] flex items-center justify-center gap-1 cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>Previous question</span>
        </button>
      </div>
    </div>
  )
}
