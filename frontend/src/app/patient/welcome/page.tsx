'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Volume2, Lock, ArrowRight } from 'lucide-react'
import { useIntakeStore } from '@/store'
import type { Language } from '@/types'

const LANGUAGES: Array<{ id: Language; native: string; english: string }> = [
  { id: 'en', native: 'English', english: 'English' },
  { id: 'hi', native: 'हिंदी', english: 'Hindi' },
  { id: 'mr', native: 'मराठी', english: 'Marathi' },
  { id: 'gu', native: 'ગુજરાતી', english: 'Gujarati' },
  { id: 'bn', native: 'বাংলা', english: 'Bengali' },
  { id: 'te', native: 'తెలుగు', english: 'Telugu' },
  { id: 'ta', native: 'தமிழ்', english: 'Tamil' },
  { id: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada' },
  { id: 'ml', native: 'മലയാളം', english: 'Malayalam' },
  { id: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
  { id: 'or', native: 'ଓଡ଼ିଆ', english: 'Odia' },
  { id: 'ur', native: 'اردو', english: 'Urdu' },
]

export default function PatientWelcomeLanguagePage() {
  const router = useRouter()
  const { setLanguage } = useIntakeStore()
  const [selectedLang, setSelectedLang] = useState<Language>('hi')

  const handleSelect = (lang: Language) => {
    setSelectedLang(lang)
    setLanguage(lang)
  }

  const handleContinue = () => {
    setLanguage(selectedLang)
    router.push('/patient/identify')
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7] text-[#191b23] flex flex-col items-center select-none pb-28">
      {/* Sticky Header Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-[#E4E4E7]">
        <div className="max-w-[600px] mx-auto px-4 h-14 flex flex-col justify-center gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[14px] text-[#2563EB] tracking-tight uppercase">VAIDYA</span>
              <span className="px-1.5 py-0.5 bg-[#E7E7F3] rounded text-[10px] font-mono text-[#434655] uppercase">
                AIIA OPD
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#71717A]">Est. 4 min left</span>
          </div>
          <div className="w-full h-[3px] bg-[#E1E2ED] rounded-full overflow-hidden">
            <div className="h-full bg-[#2563EB] transition-all duration-500 w-[15%]" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[600px] px-4 pt-20 flex flex-col gap-6 items-center">
        {/* Header / Wordmark */}
        <div className="flex flex-col items-center text-center pt-4">
          <h1 className="text-[24px] font-bold text-[#2563EB] uppercase tracking-tight">VAIDYA</h1>
          <p className="text-[14px] text-[#434655]">All India Institute of Ayurveda, New Delhi</p>
        </div>

        {/* Multi-script Greeting */}
        <div className="flex flex-col items-center gap-1 text-center py-2">
          <h2 className="text-[28px] font-semibold text-[#191b23] leading-tight">Welcome</h2>
          <h2 className="text-[28px] font-semibold text-[#191b23]/80 leading-tight">स्वागत है</h2>
          <h2 className="text-[28px] font-semibold text-[#191b23]/60 leading-tight">स्वागत आहे</h2>
          <h2 className="text-[28px] font-semibold text-[#191b23]/40 leading-tight">ਸੁਆਗਤ ਹੈ</h2>
        </div>

        {/* Instruction */}
        <div className="text-center space-y-1">
          <p className="text-[15px] font-medium text-[#191b23]">Select your language to continue</p>
          <p className="text-[14px] text-[#434655]">आगे बढ़ने के लिए अपनी भाषा चुनें</p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.id
            return (
              <button
                key={lang.id}
                onClick={() => handleSelect(lang.id)}
                className={`p-4 rounded-xl flex flex-col items-center gap-1 transition-all duration-200 cursor-pointer active:scale-95 border ${
                  isSelected
                    ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-md ring-2 ring-[#2563EB]/40'
                    : 'bg-white text-[#191b23] border-[#E4E4E7] hover:bg-[#F9F9FA] hover:border-[#D4D4D8]'
                }`}
              >
                <span className={`text-[18px] font-semibold ${isSelected ? 'text-white' : 'text-[#191b23]'}`}>
                  {lang.native}
                </span>
                <span className={`text-[13px] ${isSelected ? 'text-blue-100' : 'text-[#71717A]'}`}>
                  {lang.english}
                </span>
              </button>
            )
          })}
        </div>

        {/* Audio Assistance */}
        <button
          onClick={() => {
            if ('speechSynthesis' in window) {
              const text = selectedLang === 'hi' ? 'वैद्य में आपका स्वागत है' : 'Welcome to Vaidya'
              const utterance = new SpeechSynthesisUtterance(text)
              utterance.lang = selectedLang === 'hi' ? 'hi-IN' : 'en-US'
              window.speechSynthesis.speak(utterance)
            }
          }}
          className="flex items-center gap-2 text-[#2563EB] text-[14px] font-medium px-4 py-2 rounded-full bg-[#EFF6FF] hover:bg-[#DBEAFE] transition-colors mt-2 cursor-pointer"
        >
          <Volume2 size={18} />
          <span>Hear in selected language</span>
        </button>

        {/* Help & Privacy */}
        <div className="flex flex-col items-center gap-1 mt-6 text-center text-[13px] text-[#71717A]">
          <p>Need help? Ask our staff</p>
          <div className="flex items-center gap-1 opacity-80 font-mono text-[11px] uppercase">
            <Lock size={12} />
            <span>Secure System</span>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Action Button */}
      <div className="fixed bottom-0 left-0 w-full px-4 pb-6 pt-4 bg-gradient-to-t from-[#F6F6F7] via-[#F6F6F7] to-transparent z-50 flex justify-center">
        <button
          onClick={handleContinue}
          className="w-full max-w-[600px] h-[52px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-semibold text-[16px] shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}
