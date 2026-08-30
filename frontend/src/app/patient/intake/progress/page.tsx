'use client'

import { useRouter } from 'next/navigation'
import { CheckCircle2, Check, Clock, ArrowRight } from 'lucide-react'

export default function IntakeProgressPage() {
  const router = useRouter()

  const handleContinue = () => {
    router.push('/patient/documents')
  }

  const handleTakeBreak = () => {
    router.push('/patient/intake/pause')
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7] text-[#191b23] flex flex-col justify-between select-none">
      {/* Header Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-[#E4E4E7]">
        <div className="max-w-[600px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[14px] text-[#2563EB] tracking-tight uppercase">VAIDYA</span>
          </div>
          <span className="text-[11px] font-mono text-[#71717A]">~5 min remaining</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[720px] mx-auto px-4 pt-20 pb-28 flex-1 flex flex-col gap-6">
        
        {/* Header Banner */}
        <div className="flex flex-col items-center justify-center text-center mt-4">
          <div className="w-16 h-16 rounded-full bg-[#86F2E4]/40 text-[#006F66] flex items-center justify-center mb-3 shadow-md">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="text-[26px] sm:text-[32px] font-bold text-[#191b23] tracking-tight mb-1">
            Good — we&apos;ve noted your symptom history.
          </h1>
          <p className="text-[16px] text-[#71717A]">अच्छा — हमने आपके लक्षणों की जानकारी नोट कर ली है।</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-[#E1E2ED] rounded-full overflow-hidden relative shadow-inner">
          <div className="h-full bg-[#2563EB] w-[55%] rounded-full transition-all duration-1000 ease-out" />
        </div>

        {/* 2 Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Covered So Far Card */}
          <div className="bg-white p-5 rounded-xl border border-[#E4E4E7] shadow-sm flex flex-col gap-3">
            <h2 className="text-[14px] font-bold font-mono text-[#006F66] uppercase flex items-center gap-2">
              <CheckCircle2 size={18} />
              <span>Covered So Far</span>
            </h2>
            <ul className="space-y-2 text-[14px] text-[#434655]">
              <li className="flex items-start gap-2 bg-[#F9F9FA] p-2.5 rounded-lg border border-[#E4E4E7]">
                <Check size={16} className="text-[#16A34A] shrink-0 mt-0.5" />
                <span>Stomach pain (पेट दर्द)</span>
              </li>
              <li className="flex items-start gap-2 bg-[#F9F9FA] p-2.5 rounded-lg border border-[#E4E4E7]">
                <Check size={16} className="text-[#16A34A] shrink-0 mt-0.5" />
                <span>Started 3 months ago (3 महीने पहले शुरू हुआ)</span>
              </li>
              <li className="flex items-start gap-2 bg-[#F9F9FA] p-2.5 rounded-lg border border-[#E4E4E7]">
                <Check size={16} className="text-[#16A34A] shrink-0 mt-0.5" />
                <span>Worse after meals (भोजन के बाद खराब)</span>
              </li>
              <li className="flex items-start gap-2 bg-[#F9F9FA] p-2.5 rounded-lg border border-[#E4E4E7]">
                <Check size={16} className="text-[#16A34A] shrink-0 mt-0.5" />
                <span>Bloating present (सूजन मौजूद है)</span>
              </li>
            </ul>
          </div>

          {/* Next Questions Card */}
          <div className="bg-[#F9F9FA] p-5 rounded-xl border border-[#E4E4E7] shadow-sm flex flex-col gap-3">
            <h2 className="text-[14px] font-bold font-mono text-[#2563EB] uppercase flex items-center gap-2">
              <Clock size={18} />
              <span>Next — A Few More Questions</span>
            </h2>
            <ul className="space-y-2 text-[14px] text-[#71717A]">
              <li className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-[#E4E4E7]">
                <Clock size={16} className="text-[#71717A] shrink-0 mt-0.5" />
                <span>Past medical conditions (पिछली चिकित्सा स्थितियाँ)</span>
              </li>
              <li className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-[#E4E4E7]">
                <Clock size={16} className="text-[#71717A] shrink-0 mt-0.5" />
                <span>Current medicines (वर्तमान दवाएं)</span>
              </li>
              <li className="flex items-start gap-2 bg-white p-2.5 rounded-lg border border-[#E4E4E7]">
                <Clock size={16} className="text-[#71717A] shrink-0 mt-0.5" />
                <span>Allergies (एलर्जी)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 mt-4">
          <div className="inline-flex items-center gap-2 bg-[#DBE1FF] text-[#003EA8] px-4 py-1.5 rounded-full font-mono text-[12px] font-semibold">
            <Clock size={16} />
            <span>About 5 more minutes (लगभग 5 मिनट और)</span>
          </div>

          <button
            onClick={handleContinue}
            className="w-full h-[52px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-semibold text-[16px] shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span>Continue</span>
            <ArrowRight size={20} />
          </button>

          <button
            onClick={handleTakeBreak}
            className="text-[14px] text-[#2563EB] hover:underline cursor-pointer py-1"
          >
            Take a break — I&apos;ll continue later (ब्रेक लें - मैं बाद में जारी रखूंगा)
          </button>
        </div>
      </main>
    </div>
  )
}
