'use client'

import { useRouter } from 'next/navigation'
import { AlertTriangle, Camera, ArrowRight, Trash2, Lightbulb } from 'lucide-react'

export default function DocumentQualityPage() {
  const router = useRouter()

  const handleRetake = () => {
    router.push('/patient/documents/scan')
  }

  const handleUseAnyway = () => {
    router.push('/patient/documents')
  }

  const handleDiscard = () => {
    router.push('/patient/documents')
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7] text-[#191b23] flex flex-col justify-between select-none">
      {/* Header Warning Strip */}
      <div className="w-full bg-[#FFDBCD] px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-2 text-[#7D2D00]">
          <AlertTriangle size={20} className="shrink-0" />
          <span className="font-bold text-[14px]">Document Issue Detected</span>
        </div>
        <span className="font-mono text-[11px] text-[#7D2D00] font-bold">STEP 4/5</span>
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-[560px] mx-auto px-4 pt-6 pb-28 flex flex-col gap-5 flex-1">
        {/* Title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-[26px] font-bold text-[#191b23] leading-tight">
            We had trouble reading this document.
          </h1>
          <p className="text-[14px] text-[#71717A]">
            The AI scanner flagged issues that might cause rejection later.
          </p>
        </div>

        {/* Document Preview & Chips */}
        <div className="bg-white rounded-2xl p-4 border border-[#E4E4E7] shadow-sm flex flex-col gap-3">
          <span className="font-semibold text-[15px] text-[#191b23]">Medical History Form (Page 1)</span>
          
          <div className="relative w-full rounded-xl overflow-hidden bg-[#E1E2ED] aspect-[3/4] border-2 border-[#BC4800] flex items-center justify-center">
            {/* Simulated Blurred Preview Canvas */}
            <div className="absolute inset-0 bg-[#F4F4F5] p-6 blur-[1.5px] flex flex-col justify-between opacity-80">
              <div className="h-4 bg-[#D4D4D8] rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-3 bg-[#E4E4E7] rounded w-full" />
                <div className="h-3 bg-[#E4E4E7] rounded w-5/6" />
                <div className="h-3 bg-[#E4E4E7] rounded w-4/6" />
              </div>
              <div className="h-10 bg-[#E4E4E7] rounded w-full" />
            </div>

            {/* Scanning Warning Overlay */}
            <div className="absolute inset-0 bg-[#BC4800]/10 pointer-events-none" />

            {/* Floating Issue Chips */}
            <div className="absolute bottom-3 left-3 right-3 flex gap-2 flex-wrap">
              <div className="bg-[#BC4800] text-white px-3 py-1 rounded-full font-mono text-[11px] font-bold shadow-md">
                LOW SHARPNESS
              </div>
              <div className="bg-[#BC4800] text-white px-3 py-1 rounded-full font-mono text-[11px] font-bold shadow-md">
                SKEW &gt; 15°
              </div>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-[#FFDBCD]/30 rounded-xl p-4 border-l-4 border-l-[#BC4800] border border-[#FFDBCD] flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[#7D2D00] font-semibold text-[14px]">
            <Lightbulb size={18} />
            <span>Tips for a better scan</span>
          </div>
          <ul className="space-y-1.5 text-[13px] text-[#191b23]">
            <li><strong>Hold steady:</strong> Ensure your phone is perfectly still when capturing.</li>
            <li><strong>Good lighting:</strong> Avoid shadows or glare over the text.</li>
            <li><strong>Align edges:</strong> Keep the document flat and parallel to the screen.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 mt-2">
          <button
            onClick={handleRetake}
            className="w-full h-[52px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-[16px] rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-[0.98]"
          >
            <Camera size={20} />
            <span>Retake Photo</span>
          </button>

          <button
            onClick={handleUseAnyway}
            className="w-full h-[48px] bg-[#E7E7F3] hover:bg-[#D9D9E5] text-[#191b23] font-semibold text-[15px] rounded-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowRight size={18} />
            <span>Use Anyway</span>
          </button>

          <button
            onClick={handleDiscard}
            className="py-2 text-center text-[#DC2626] font-medium text-[14px] hover:underline flex items-center justify-center gap-1 cursor-pointer"
          >
            <Trash2 size={16} />
            <span>Discard Document</span>
          </button>
        </div>
      </main>
    </div>
  )
}
