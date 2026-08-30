'use client'

export default function ClinicalVisual() {
  return (
    <div className="relative w-full max-w-[480px] flex flex-col items-center justify-center select-none py-4">
      {/* 3D Stack Canvas Container */}
      <div className="relative w-full bg-white/40 backdrop-blur-xl border border-white/60 rounded-[28px] p-6 shadow-xl shadow-blue-500/5">
        
        {/* Top Floating Badge */}
        <div className="absolute -top-4 right-8 z-30">
          <div className="px-5 py-2 rounded-full bg-[#2563EB] text-white text-[12px] font-bold uppercase tracking-wider shadow-md shadow-blue-500/20">
            Physician Verified
          </div>
        </div>

        {/* Vertical Dotted Guide Line */}
        <div className="absolute left-[54%] top-12 bottom-12 w-px border-r-2 border-dashed border-[#2563EB]/40 z-0" />

        {/* Stack Items Container */}
        <div className="relative z-10 flex flex-col gap-6 pt-2">
          
          {/* Layer 1: Clinical Intelligence */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#71717A] pl-2">
              Clinical Intelligence
            </span>
            <div className="bg-white/90 backdrop-blur-md border border-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-2.5 w-10 bg-[#2563EB] rounded-full" />
                <div className="h-2.5 w-14 bg-[#16A34A] rounded-full" />
              </div>
              <div className="space-y-1.5">
                <div className="h-2 bg-[#E4E4E7] rounded-full w-full" />
                <div className="h-2 bg-[#F4F4F5] rounded-full w-3/4" />
              </div>
            </div>
          </div>

          {/* Layer 2: Document Scanning */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#71717A] pl-2">
              Document Scanning
            </span>
            <div className="bg-white/90 backdrop-blur-md border border-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#16A34A] shrink-0">
                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                  <path d="M1.5 5L5 8.5L12.5 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="h-2 bg-[#E4E4E7] rounded-full w-4/5" />
                <div className="h-2 bg-[#F4F4F5] rounded-full w-1/2" />
              </div>
            </div>
          </div>

          {/* Layer 3: Patient Input */}
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#71717A] pl-2">
              Patient Input
            </span>
            <div className="bg-white/90 backdrop-blur-md border border-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
              <div className="space-y-1.5 flex-1 pr-4">
                <div className="h-2 bg-[#E4E4E7] rounded-full w-3/4" />
                <div className="h-2 bg-[#F4F4F5] rounded-full w-1/2" />
              </div>
              <div className="w-7 h-7 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center font-bold text-sm shrink-0">
                +
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
