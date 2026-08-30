'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QrCode, Hash, UserPlus, ChevronDown, ArrowRight, Lock, Clock } from 'lucide-react'
import { patientService } from '@/services'
import { useIntakeStore } from '@/store'

export default function PatientIdentifyPage() {
  const router = useRouter()
  const { setPatient } = useIntakeStore()

  const [expanded, setExpanded] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLookup = async (valueToSearch?: string) => {
    const term = valueToSearch || inputValue.trim()
    if (!term) return

    setLoading(true)
    setError('')

    try {
      let patient = null
      if (term.length === 10) {
        patient = await patientService.lookupByPhone(term)
      } else {
        patient = await patientService.lookupByABHA(term)
      }

      if (patient) {
        const encounterId = `enc-${Date.now()}`
        setPatient(patient, encounterId)
        router.push('/patient/confirm')
      } else {
        router.push('/patient/register')
      }
    } catch {
      router.push('/patient/register')
    } finally {
      setLoading(false)
    }
  }

  const handleQRScan = () => {
    handleLookup('9876543210')
  }

  const handleNewPatient = () => {
    router.push('/patient/register')
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
          <div className="h-full bg-[#2563EB] w-[8%] transition-all duration-500" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[560px] mx-auto px-4 pt-20 pb-28 flex flex-col gap-6 flex-1">
        {/* Header Text (Bilingual) */}
        <div className="flex flex-col gap-1 text-center px-4 pt-4">
          <h1 className="text-[28px] sm:text-[32px] font-semibold text-[#191b23] tracking-tight leading-tight">
            <span className="block text-[#2563EB] text-[18px] mb-1">आपका पहचान पत्र</span>
            Let&apos;s find your records
          </h1>
          <p className="text-[15px] text-[#71717A] mt-1">
            Choose one of the options below.<br />
            <span className="text-[14px] opacity-80">नीचे दिए गए विकल्पों में से एक चुनें।</span>
          </p>
        </div>

        {error && (
          <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Options Stack */}
        <div className="flex flex-col gap-4 w-full">
          {/* Option 1: Scan QR */}
          <button
            onClick={handleQRScan}
            disabled={loading}
            className="w-full bg-white p-4 rounded-xl border border-[#E4E4E7] shadow-sm hover:shadow-md hover:border-[#2563EB] transition-all flex items-center gap-4 text-left group active:scale-[0.99] cursor-pointer"
          >
            <div className="w-12 h-12 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
              <QrCode size={26} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[17px] text-[#191b23] truncate">Scan ABHA QR Code</h3>
              <p className="text-[13px] text-[#71717A] truncate">Aarogya Setu app or printed card</p>
            </div>
            <ArrowRight size={20} className="text-[#71717A] group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all" />
          </button>

          {/* Option 2: Enter ID (Expandable) */}
          <div className={`w-full bg-white rounded-xl border transition-all ${expanded ? 'border-[#2563EB] ring-1 ring-[#2563EB]' : 'border-[#E4E4E7] shadow-sm'}`}>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full p-4 flex items-center gap-4 text-left group active:scale-[0.99] cursor-pointer"
            >
              <div className="w-12 h-12 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                <Hash size={26} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[17px] text-[#191b23] truncate">Enter health ID or mobile</h3>
                <p className="text-[13px] text-[#71717A] truncate">14-digit ABHA or registered number</p>
              </div>
              <ChevronDown size={20} className={`text-[#71717A] transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
            </button>

            {/* Expanded Input Area */}
            {expanded && (
              <div className="p-4 pt-0 border-t border-[#F4F4F5] bg-[#F9F9FA] rounded-b-xl flex flex-col gap-3">
                <input
                  type="text"
                  inputMode="numeric"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 9876543210 or ABHA ID"
                  className="w-full h-12 bg-white text-[#191b23] font-mono text-[15px] px-3 rounded-lg border border-[#E4E4E7] focus:border-[#2563EB] focus:outline-none"
                />
                <button
                  onClick={() => handleLookup()}
                  disabled={inputValue.length < 10 || loading}
                  className="w-full h-12 bg-[#2563EB] text-white font-semibold text-[15px] rounded-lg flex items-center justify-center gap-2 hover:bg-[#1D4ED8] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? 'Searching...' : 'Continue'}
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Option 3: New Patient */}
          <button
            onClick={handleNewPatient}
            className="w-full bg-white p-4 rounded-xl border border-[#E4E4E7] shadow-sm hover:shadow-md hover:border-[#2563EB] transition-all flex items-center gap-4 text-left group active:scale-[0.99] cursor-pointer"
          >
            <div className="w-12 h-12 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
              <UserPlus size={26} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[17px] text-[#191b23] truncate">I&apos;m a new patient</h3>
              <p className="text-[13px] text-[#71717A] truncate">First visit? We&apos;ll create your record.</p>
            </div>
            <div className="shrink-0 bg-[#E7E7F3] px-2 py-1 rounded font-mono text-[11px] text-[#434655] flex items-center gap-1">
              <Clock size={12} />
              <span>5 min</span>
            </div>
          </button>
        </div>

        {/* Privacy Footer */}
        <div className="mt-auto pt-6 flex items-center justify-center gap-1.5 font-mono text-[11px] text-[#71717A] uppercase">
          <Lock size={14} />
          <span>Your data is encrypted and securely stored.</span>
        </div>
      </main>
    </div>
  )
}
