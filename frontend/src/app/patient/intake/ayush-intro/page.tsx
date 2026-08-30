'use client'

import { useRouter } from 'next/navigation'
import { Leaf, ArrowRight } from 'lucide-react'

export default function AyushIntroPage() {
  const router = useRouter()

  const handleContinue = () => {
    router.push('/patient/documents')
  }

  const handleSkip = () => {
    router.push('/patient/documents')
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7] text-[#191b23] flex flex-col justify-between select-none">
      {/* Header Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-[#E4E4E7]">
        <div className="max-w-[600px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[14px] text-[#0D9488] tracking-tight uppercase">VAIDYA AYUSH</span>
          </div>
          <span className="text-[11px] font-mono text-[#71717A]">~12 min remaining</span>
        </div>
        <div className="w-full h-1 bg-[#E1E2ED]">
          <div className="h-full bg-[#0D9488] w-[65%] transition-all duration-500" />
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[520px] mx-auto px-4 pt-20 pb-28 flex-1 flex flex-col justify-center items-center">
        <div className="w-full flex flex-col items-center">
          
          {/* Zone 1: Leaf Icon */}
          <div className="w-14 h-14 rounded-full bg-[#F0FDFA] border-2 border-[#0D9488] text-[#0D9488] flex items-center justify-center mb-6 shadow-sm">
            <Leaf size={28} />
          </div>

          {/* Zone 2: Heading */}
          <div className="text-center mb-6">
            <h1 className="text-[26px] sm:text-[30px] font-bold text-[#191b23] leading-tight mb-2">
              A few more questions from your Ayurvedic doctor
            </h1>
            <p className="text-[16px] text-[#0D9488] font-medium">आपके आयुर्वेदिक डॉक्टर के लिए कुछ और प्रश्न</p>
          </div>

          {/* Zone 3: Explanation Card */}
          <div className="w-full bg-[#F0FDFA] p-4 rounded-xl mb-6 border-l-4 border-[#0D9488] shadow-sm">
            <p className="text-[15px] text-[#191b23] leading-relaxed">
              Our Ayurvedic doctors would like to understand your diet, sleep, and daily routine to provide a more holistic assessment.
            </p>
          </div>

          {/* Zone 4: Bullet Points */}
          <div className="w-full mb-8 px-2 space-y-3">
            <div className="flex items-start gap-3 text-[14px] text-[#191b23]">
              <div className="w-2 h-2 rounded-full bg-[#0D9488] mt-2 shrink-0" />
              <span>A few questions about what you eat and drink</span>
            </div>
            <div className="flex items-start gap-3 text-[14px] text-[#191b23]">
              <div className="w-2 h-2 rounded-full bg-[#0D9488] mt-2 shrink-0" />
              <span>Your sleep patterns and daily activity levels</span>
            </div>
            <div className="flex items-start gap-3 text-[14px] text-[#191b23]">
              <div className="w-2 h-2 rounded-full bg-[#0D9488] mt-2 shrink-0" />
              <span>How your body feels in different conditions</span>
            </div>
          </div>

          {/* Zone 5: Reassurance */}
          <div className="text-center mb-8">
            <p className="text-[14px] text-[#71717A] italic">
              There are no right or wrong answers, just what is true for you right now.
            </p>
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col gap-3">
            <button
              onClick={handleContinue}
              className="w-full h-[52px] rounded-full bg-[#0D9488] hover:bg-[#0B7A70] text-white font-semibold text-[16px] flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Continue to Ayurvedic questions</span>
              <ArrowRight size={20} />
            </button>
            <button
              onClick={handleSkip}
              className="w-full py-2.5 text-center text-[#71717A] text-[14px] hover:text-[#191b23] cursor-pointer"
            >
              Skip these questions
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}
