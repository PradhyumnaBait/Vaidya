'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, Activity, Eye, Bone, Flame, Plus, HeartPulse } from 'lucide-react'
import { intakeService } from '@/services'
import { useIntakeStore } from '@/store'

const CATEGORIES = [
  { id: 'heart', title: 'दिल / साँस', subtitle: 'Heart / Breathing', icon: HeartPulse, color: 'bg-[#FFDAD6] text-[#93000A]' },
  { id: 'stomach', title: 'पेट / पाचन', subtitle: 'Stomach / Digestion', icon: Activity, color: 'bg-[#86F2E4] text-[#006F66]' },
  { id: 'head', title: 'सिर / आँखें', subtitle: 'Head / Eyes', icon: Eye, color: 'bg-[#FFDBCD] text-[#BC4800]' },
  { id: 'joints', title: 'जोड़ / पीठ', subtitle: 'Joints / Back', icon: Bone, color: 'bg-[#DBE1FF] text-[#004AC6]' },
  { id: 'fever', title: 'बुखार / थकान', subtitle: 'Fever / Fatigue', icon: Flame, color: 'bg-[#FFDAD6] text-[#93000A]' },
  { id: 'other', title: 'कुछ और', subtitle: 'Something else', icon: Plus, color: 'bg-[#E1E2ED] text-[#434655]' },
]

export default function PatientIntakeStartPage() {
  const router = useRouter()
  const { advanceState, setCurrentQuestion, setChiefComplaint } = useIntakeStore()
  const [isListening, setIsListening] = useState(false)

  const handleSelectCategory = async (category: typeof CATEGORIES[0]) => {
    try {
      const encounter = await intakeService.createEncounter('p-current', 'OPD_ALLOPATHIC')
      useIntakeStore.setState({ encounterId: encounter.id })
    } catch {
      useIntakeStore.setState({ encounterId: `enc-${Date.now()}` })
    }

    setChiefComplaint(category.subtitle)
    advanceState('INTERVIEWING')

    const firstQ = await intakeService.getNextQuestion('enc-1')
    if (firstQ) {
      setCurrentQuestion(firstQ)
    }

    router.push('/patient/intake/interview')
  }

  const toggleListening = () => {
    setIsListening(!isListening)
    if (!isListening) {
      setTimeout(() => {
        handleSelectCategory(CATEGORIES[1])
      }, 2500)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7] text-[#191b23] flex flex-col select-none">
      {/* Header Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-[#E4E4E7]">
        <div className="max-w-[600px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[14px] text-[#2563EB] tracking-tight uppercase">VAIDYA</span>
          </div>
          <span className="text-[11px] font-mono text-[#71717A]">~12 min remaining</span>
        </div>
        <div className="w-full h-1 bg-[#E1E2ED]">
          <div className="h-full bg-[#2563EB] w-[35%] transition-all duration-500" />
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-[560px] mx-auto px-4 pt-20 pb-20 flex flex-col items-center gap-6">
        {/* Zone 1: Headers */}
        <div className="flex flex-col items-center text-center space-y-2 mt-4">
          {isListening && (
            <div className="inline-flex items-center gap-1.5 bg-[#EFF6FF] px-4 py-1.5 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping" />
              <span className="font-mono text-[12px] text-[#2563EB] font-medium">Listening...</span>
            </div>
          )}

          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#191b23] tracking-tight leading-tight">
            आज आप किस समस्या के लिए आए हैं?
          </h1>
          <p className="text-[15px] text-[#71717A] max-w-[80%] mx-auto">
            What has brought you here today?
          </p>
        </div>

        {/* Zone 2: Voice Input */}
        <div className="flex flex-col items-center justify-center relative w-full my-4">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`w-28 h-28 bg-[#BFDBFE]/40 rounded-full ${isListening ? 'animate-ping' : ''}`} />
          </div>

          <button
            onClick={toggleListening}
            className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer ${
              isListening ? 'bg-[#DC2626] text-white' : 'bg-[#2563EB] text-white hover:scale-105'
            }`}
          >
            <Mic size={36} />
          </button>
          <span className="font-mono text-[12px] text-[#71717A] mt-3">
            {isListening ? 'Listening to your voice...' : 'Tap to speak'}
          </span>

          {/* Divider */}
          <div className="flex items-center justify-center w-full mt-6 gap-4">
            <div className="h-px w-1/4 bg-[#E1E2ED]" />
            <span className="font-mono text-[11px] text-[#71717A] uppercase tracking-wider">or select one</span>
            <div className="h-px w-1/4 bg-[#E1E2ED]" />
          </div>
        </div>

        {/* Zone 3: Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.icon
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat)}
                className="flex items-center gap-3 bg-white text-[#191b23] p-4 rounded-xl border border-[#E4E4E7] shadow-sm hover:border-[#2563EB] hover:bg-[#F9F9FA] transition-all active:scale-[0.98] text-left group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-full ${cat.color} flex items-center justify-center shrink-0`}>
                  <IconComponent size={22} />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[16px] text-[#191b23] group-hover:text-[#2563EB] transition-colors">
                    {cat.title}
                  </span>
                  <span className="text-[13px] text-[#71717A]">{cat.subtitle}</span>
                </div>
              </button>
            )
          })}
        </div>
      </main>
    </div>
  )
}
