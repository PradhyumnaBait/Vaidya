'use client'

import { useRouter } from 'next/navigation'
import { Pause, Cloud, Clock, ArrowRight, HelpCircle } from 'lucide-react'
import { useIntakeStore } from '@/store'

export default function IntakePausePage() {
  const router = useRouter()
  const { reset } = useIntakeStore()

  const handleContinue = () => {
    router.push('/patient/intake/progress')
  }

  const handleStartOver = () => {
    reset()
    router.push('/patient/welcome')
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7] text-[#191b23] flex flex-col justify-between select-none">
      {/* Header Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-[#E4E4E7]">
        <div className="max-w-[600px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[14px] text-[#2563EB] tracking-tight uppercase">VAIDYA</span>
          </div>
          <span className="text-[11px] font-mono text-[#71717A] flex items-center gap-1">
            <Pause size={12} /> PAUSED
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[480px] mx-auto px-4 pt-20 pb-28 flex-1 flex flex-col items-center justify-center text-center">
        
        {/* Progress Bar Header */}
        <div className="w-full mb-6 text-left">
          <div className="w-full h-2 bg-[#E1E2ED] rounded-full overflow-hidden mb-2">
            <div className="h-full bg-[#71717A] w-[55%]" />
          </div>
          <div className="flex justify-between items-center text-mono text-[11px] text-[#71717A] uppercase">
            <span>55% COMPLETE</span>
            <span className="flex items-center gap-1"><Pause size={12} /> Paused</span>
          </div>
        </div>

        {/* Pause Icon */}
        <div className="w-20 h-20 rounded-full bg-[#E7E7F3] text-[#434655] flex items-center justify-center mb-6 shadow-sm">
          <Pause size={38} />
        </div>

        {/* Headings */}
        <h1 className="text-[28px] font-bold text-[#191b23] leading-tight mb-1">
          Your session is paused.
        </h1>
        <h2 className="text-[18px] text-[#434655] font-normal mb-6">
          आपका सत्र रोक दिया गया है।
        </h2>

        {/* Status Card */}
        <div className="w-full bg-white rounded-xl p-5 border border-[#E4E4E7] shadow-sm text-left flex flex-col gap-2 mb-6 border-l-4 border-l-[#0D9488]">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F0FDFA] text-[#0F766E] font-mono text-[11px] font-bold self-start">
            <Cloud size={14} />
            <span>PROGRESS SAVED</span>
          </div>
          <p className="text-[14px] text-[#434655] mt-1 leading-relaxed">
            You&apos;ve completed about <strong className="text-[#191b23]">55%</strong> of the intake. Your answers have been securely saved.
          </p>
          <div className="flex items-center gap-1.5 pt-2 border-t border-[#F4F4F5] font-mono text-[11px] text-[#71717A]">
            <Clock size={14} />
            <span>This session will remain active for 24 hours.</span>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleContinue}
            className="w-full h-[52px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-[0.98]"
          >
            <span>Continue where I left off</span>
            <ArrowRight size={20} />
          </button>

          <button
            onClick={handleStartOver}
            className="w-full h-[44px] bg-[#E7E7F3] hover:bg-[#D9D9E5] text-[#191b23] rounded-xl font-medium text-[14px] cursor-pointer"
          >
            Start over (clear my answers)
          </button>
        </div>

        {/* Footer Link */}
        <div className="mt-8">
          <button
            onClick={() => alert("Please inform any front desk receptionist for immediate assistance.")}
            className="inline-flex items-center gap-2 text-[14px] text-[#2563EB] font-medium hover:underline cursor-pointer"
          >
            <HelpCircle size={18} />
            <span>Ask staff for help</span>
          </button>
        </div>
      </main>
    </div>
  )
}
