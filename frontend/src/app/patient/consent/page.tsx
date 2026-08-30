'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Volume2, Play, FileText, Scan, Share2, Lock, Check, ArrowRight } from 'lucide-react'
import { useIntakeStore } from '@/store'

export default function PatientConsentPage() {
  const router = useRouter()
  const { setConsented } = useIntakeStore()
  const [agreed, setAgreed] = useState(false)

  const handleContinue = () => {
    if (!agreed) return
    setConsented()
    router.push('/patient/intake/start')
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7] text-[#191b23] flex flex-col justify-between select-none">
      {/* Header Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-[#E4E4E7]">
        <div className="max-w-[600px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[14px] text-[#2563EB] tracking-tight uppercase">VAIDYA</span>
            <span className="px-1.5 py-0.5 bg-[#E7E7F3] rounded text-[10px] font-mono text-[#434655] uppercase">
              AIIA OPD
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#71717A]">~12 min remaining</span>
        </div>
        <div className="w-full h-1 bg-[#E1E2ED]">
          <div className="h-full bg-[#2563EB] w-[35%] transition-all duration-500" />
        </div>
      </header>

      {/* Main Form Content Area */}
      <main className="w-full max-w-[520px] mx-auto px-4 pt-20 pb-36 flex flex-col gap-5 flex-1">
        {/* Title */}
        <div>
          <h1 className="text-[24px] font-semibold text-[#2563EB] mb-0.5">Before we begin</h1>
          <h2 className="text-[18px] font-semibold text-[#71717A] mb-2">शुरू करने से पहले</h2>
          <p className="text-[15px] text-[#191b23]">
            Please read or listen to the following information about how Vaidya will assist you today.
          </p>
        </div>

        {/* Audio Assistance Player Box */}
        <div
          onClick={() => {
            if ('speechSynthesis' in window) {
              const text = 'कृपया समझें कि आपकी जानकारी सुरक्षित रूप से आपके डॉक्टर के साथ साझा की जाएगी।'
              const utterance = new SpeechSynthesisUtterance(text)
              utterance.lang = 'hi-IN'
              window.speechSynthesis.speak(utterance)
            }
          }}
          className="bg-white rounded-xl p-4 border border-[#E4E4E7] shadow-sm flex items-center justify-between cursor-pointer hover:border-[#2563EB] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
              <Volume2 size={20} />
            </div>
            <div>
              <p className="font-medium text-[15px] text-[#191b23]">Listen to consent in Hindi</p>
              <div className="flex gap-2 text-[12px] font-mono text-[#71717A] mt-0.5">
                <span>2 min</span>
                <span>•</span>
                <span className="text-[#2563EB]">English</span>
                <span>•</span>
                <span className="text-[#2563EB]">Marathi</span>
              </div>
            </div>
          </div>
          <Play size={20} className="text-[#71717A]" />
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-xl p-5 border border-[#E4E4E7] shadow-sm flex flex-col gap-4">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-[#86f2e4]/30 text-[#006f66] flex items-center justify-center shrink-0 mt-0.5">
              <FileText size={18} />
            </div>
            <div>
              <p className="font-medium text-[15px] text-[#191b23]">Record Health History</p>
              <p className="text-[13px] text-[#71717A] mt-0.5">We will collect your symptoms using voice or touch.</p>
            </div>
          </div>

          <div className="w-full h-px bg-[#F4F4F5]" />

          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-[#86f2e4]/30 text-[#006f66] flex items-center justify-center shrink-0 mt-0.5">
              <Scan size={18} />
            </div>
            <div>
              <p className="font-medium text-[15px] text-[#191b23]">Process Medical Reports</p>
              <p className="text-[13px] text-[#71717A] mt-0.5">We may scan or read previous prescriptions and reports.</p>
            </div>
          </div>

          <div className="w-full h-px bg-[#F4F4F5]" />

          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-[#86f2e4]/30 text-[#006f66] flex items-center justify-center shrink-0 mt-0.5">
              <Share2 size={18} />
            </div>
            <div>
              <p className="font-medium text-[15px] text-[#191b23]">Share with your Doctor</p>
              <p className="text-[13px] text-[#71717A] mt-0.5">A summary will be securely sent to your consulting physician.</p>
            </div>
          </div>

          <div className="w-full h-px bg-[#F4F4F5]" />

          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-[#86f2e4]/30 text-[#006f66] flex items-center justify-center shrink-0 mt-0.5">
              <Lock size={18} />
            </div>
            <div>
              <p className="font-medium text-[15px] text-[#191b23]">Secure Storage</p>
              <p className="text-[13px] text-[#71717A] mt-0.5">Your data is encrypted and stored according to national health standards.</p>
            </div>
          </div>
        </div>

        {/* Consent Checkbox */}
        <label
          onClick={() => setAgreed(!agreed)}
          className="flex items-start gap-3 p-4 rounded-xl hover:bg-white/60 cursor-pointer transition-colors border border-transparent hover:border-[#E4E4E7]"
        >
          <div className="relative flex items-center justify-center mt-0.5">
            <div
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                agreed ? 'bg-[#2563EB] border-[#2563EB]' : 'bg-white border-[#737686]'
              }`}
            >
              {agreed && <Check size={16} className="text-white stroke-[3]" />}
            </div>
          </div>
          <div className="flex-1">
            <p className="font-medium text-[15px] text-[#191b23]">I understand and agree to proceed.</p>
            <p className="text-[13px] text-[#71717A] mt-0.5">मैं समझता/समझती हूँ और आगे बढ़ने के लिए सहमत हूँ।</p>
          </div>
        </label>
      </main>

      {/* Sticky Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-[#E4E4E7] flex justify-center z-50 max-w-[600px] mx-auto">
        <button
          onClick={handleContinue}
          disabled={!agreed}
          className="w-full h-[52px] rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#E7E7F3] disabled:text-[#A1A1AA] disabled:cursor-not-allowed text-white font-semibold text-[16px] flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          <span>I Agree — Continue</span>
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}
