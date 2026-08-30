'use client'

import { useRouter } from 'next/navigation'
import { CheckCircle2, RotateCcw, User, Calendar, Phone, Globe, History, ArrowRight } from 'lucide-react'
import { useIntakeStore } from '@/store'

export default function PatientConfirmPage() {
  const router = useRouter()
  const { patient } = useIntakeStore()

  const defaultPatient = patient || {
    id: 'p-dhananjay',
    name: 'Dhananjay Patil',
    abhaId: '12-3456-7890-1234',
    age: 67,
    gender: 'male',
    phone: '9876543210',
    preferredLanguage: 'mr',
  }

  const handleConfirm = () => {
    router.push('/patient/consent')
  }

  const handleStartOver = () => {
    router.push('/patient/identify')
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
          <span className="text-[11px] font-mono text-[#71717A]">~11 min remaining</span>
        </div>
        <div className="w-full h-1 bg-[#E1E2ED]">
          <div className="h-full bg-[#2563EB] w-[12%] transition-all duration-500" />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[560px] mx-auto px-4 pt-20 pb-36 flex flex-col gap-6 flex-1">
        {/* Heading Section */}
        <div className="flex flex-col gap-1 text-center pt-2">
          <h1 className="text-[32px] font-semibold text-[#191b23] tracking-tight leading-tight">
            Is this you?<br />
            <span className="text-[26px] text-[#434655] font-normal">क्या यह आप हैं?</span>
          </h1>
          <p className="text-[15px] text-[#71717A] mt-1">
            Please check your details below.
          </p>
        </div>

        {/* Patient Info Card */}
        <div className="bg-white rounded-2xl border border-[#E4E4E7] shadow-sm p-5 flex flex-col gap-4">
          {/* Avatar & Name */}
          <div className="flex items-center gap-4 pb-4 border-b border-[#F4F4F5]">
            <div className="w-14 h-14 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#BFDBFE]">
              <User size={28} />
            </div>
            <div className="flex flex-col">
              <span className="text-[20px] font-bold text-[#191b23]">{defaultPatient.name}</span>
              {defaultPatient.abhaId && (
                <div className="flex items-center gap-1 text-mono text-[11px] text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE] w-fit mt-1">
                  <span>ABHA: {defaultPatient.abhaId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Details List */}
          <div className="flex flex-col gap-2.5 text-[14px]">
            <div className="flex justify-between items-center py-1">
              <span className="text-[#71717A] flex items-center gap-2">
                <Calendar size={16} /> Age
              </span>
              <span className="font-mono text-[#191b23] font-medium">{defaultPatient.age} years</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-[#71717A] flex items-center gap-2">
                <User size={16} /> Sex
              </span>
              <span className="font-mono text-[#191b23] font-medium capitalize">{defaultPatient.gender}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-[#71717A] flex items-center gap-2">
                <Phone size={16} /> Mobile
              </span>
              <span className="font-mono text-[#191b23] font-medium">
                {defaultPatient.phone ? `${defaultPatient.phone.slice(0, 5)} ●●●●●` : '●●●●●●●●●●'}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-[#71717A] flex items-center gap-2">
                <Globe size={16} /> Language
              </span>
              <span className="font-mono text-[#191b23] font-medium uppercase">{defaultPatient.preferredLanguage || 'hi'}</span>
            </div>

            <div className="flex justify-between items-center py-2 mt-1 border-t border-[#F4F4F5]">
              <span className="text-[#71717A] flex items-center gap-2">
                <History size={16} /> Last visit
              </span>
              <span className="font-mono text-[#191b23] font-medium">12 Aug 2026</span>
            </div>
          </div>
        </div>

        {/* Update Link */}
        <div className="flex justify-center -mt-2">
          <button
            onClick={() => router.push('/patient/register')}
            className="text-[14px] text-[#2563EB] font-medium hover:underline flex items-center gap-1 py-1 px-3 rounded-lg hover:bg-[#EFF6FF]"
          >
            <span>Something changed? Update details</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </main>

      {/* Action Buttons (Sticky to bottom) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-[#E4E4E7] flex flex-col gap-3 z-50 max-w-[600px] mx-auto">
        <button
          onClick={handleConfirm}
          className="w-full h-[54px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-semibold text-[16px] flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          <CheckCircle2 size={20} />
          <span>Yes, that&apos;s me — continue</span>
        </button>
        <button
          onClick={handleStartOver}
          className="w-full h-[52px] bg-[#E7E7F3] hover:bg-[#D9D9E5] text-[#191b23] rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
        >
          <RotateCcw size={18} />
          <span>This isn&apos;t me — start over</span>
        </button>
      </div>
    </div>
  )
}
