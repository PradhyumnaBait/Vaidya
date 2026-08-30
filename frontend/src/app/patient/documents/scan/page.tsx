'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, Crop, Sun, FileText, Camera } from 'lucide-react'

export default function DocumentScanPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [flash, setFlash] = useState(false)
  const [scanning, setScanning] = useState(false)

  const handleCaptureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    } else {
      triggerSimulatedScan()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      triggerSimulatedScan()
    }
  }

  const triggerSimulatedScan = () => {
    setScanning(true)
    setTimeout(() => {
      router.push('/patient/documents/quality')
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between select-none relative overflow-hidden">
      {/* Hidden Native File Input with Camera Capture */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-4 bg-black/60 backdrop-blur-sm z-20">
        <button
          onClick={() => router.push('/patient/documents')}
          className="text-white text-[15px] hover:text-[#BFDBFE] transition-colors p-1 cursor-pointer"
        >
          Cancel
        </button>
        <div className="flex flex-col items-center">
          <span className="font-semibold text-[17px]">Scan Document</span>
          <span className="text-[12px] text-gray-400">दस्तावेज़ स्कैन करें</span>
        </div>
        <button
          onClick={() => setFlash(!flash)}
          className={`p-2 rounded-full transition-colors cursor-pointer ${flash ? 'bg-yellow-400 text-black' : 'text-white'}`}
        >
          <Zap size={20} />
        </button>
      </div>

      {/* Camera Viewport Simulation */}
      <div className="flex-1 relative flex items-center justify-center p-6">
        {/* Background Overlay */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black pointer-events-none" />

        {/* Alignment Frame */}
        <div
          className={`relative w-full max-w-[420px] h-[65%] max-h-[560px] border-2 rounded-2xl flex items-center justify-center z-10 transition-all duration-300 ${
            scanning ? 'border-[#2563EB] bg-[#2563EB]/10' : 'border-white/40'
          }`}
        >
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-2xl -mt-1 -ml-1" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-2xl -mt-1 -mr-1" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-2xl -mb-1 -ml-1" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-2xl -mb-1 -mr-1" />

          {/* Guidance Box */}
          <div className="flex flex-col items-center gap-1 text-center px-6 bg-black/60 p-4 rounded-xl backdrop-blur-md">
            <span className="text-[15px] font-medium text-white">Align document here</span>
            <span className="text-[13px] text-gray-300">दस्तावेज़ को यहाँ रखें</span>
          </div>

          {/* Scanning Animation Line */}
          {scanning && (
            <div className="absolute top-0 left-0 w-full h-1 bg-[#2563EB] shadow-[0_0_15px_#2563EB] animate-pulse" />
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col items-center pb-8 pt-4 bg-gradient-to-t from-black via-black/90 to-transparent z-20 gap-4">
        {/* Guidance Chips */}
        <div className="flex gap-2 px-4 overflow-x-auto w-full justify-center no-scrollbar">
          <div className="flex items-center gap-1.5 bg-gray-800/90 px-3.5 py-1.5 rounded-full text-[13px] text-white whitespace-nowrap">
            <Crop size={14} /> Place flat
          </div>
          <div className="flex items-center gap-1.5 bg-gray-800/90 px-3.5 py-1.5 rounded-full text-[13px] text-white whitespace-nowrap">
            <Sun size={14} /> Good light
          </div>
          <div className="flex items-center gap-1.5 bg-gray-800/90 px-3.5 py-1.5 rounded-full text-[13px] text-white whitespace-nowrap">
            <FileText size={14} /> Full page
          </div>
        </div>

        {/* Big Capture Button */}
        <button
          onClick={handleCaptureClick}
          className="w-20 h-20 rounded-full bg-white/20 p-2 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-transform active:scale-95 group cursor-pointer"
        >
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-lg group-hover:bg-gray-100 transition-colors">
            <Camera size={32} className="text-black" />
          </div>
        </button>
      </div>
    </div>
  )
}
