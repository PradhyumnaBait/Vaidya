'use client'

import { useRouter } from 'next/navigation'
import { Languages, BadgeCheck, ShieldCheck } from 'lucide-react'
import VaidyaWordmark from '@/components/VaidyaWordmark'
import ClinicalVisual from '@/components/ClinicalVisual'
import type { Screen } from '@/types'

interface WelcomeProps {
  onNavigate: (screen: Screen) => void
}

export default function Welcome({ onNavigate }: WelcomeProps) {
  const router = useRouter()

  const handleBeginPatientIntake = () => {
    router.push('/patient/welcome')
  }

  return (
    <div className="bg-radial-gradient min-h-screen w-full flex flex-col justify-between p-6 md:p-10 lg:p-12 text-[#191b23] select-none">
      {/* Background Soft Glow Effects */}
      <div className="noise-overlay" />
      <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="w-full max-w-[1360px] mx-auto flex-1 flex flex-col justify-between relative z-10">
        
        {/* Top Header */}
        <header className="flex items-center gap-4 mb-8">
          <VaidyaWordmark size="md" showDescriptor={false} />
          <div className="h-5 w-px bg-[#C3C6D7]/60" />
          <span className="font-mono text-xs tracking-widest text-[#2563EB] font-semibold uppercase">
            Clinical Intelligence
          </span>
        </header>

        {/* Main Content Split Composition */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center my-auto py-6">
          
          {/* Left Region - Title & Cards */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
            
            {/* Title & Subtitle */}
            <div>
              <h1 className="text-[44px] sm:text-[56px] font-semibold text-[#18181B] tracking-tight leading-[1.1]">
                Welcome to Vaidya
              </h1>
              <p className="text-[17px] sm:text-[19px] text-[#52525B] mt-3 leading-relaxed">
                Your clinical information, prepared before the consultation.
              </p>
            </div>

            {/* Action Cards */}
            <div className="space-y-4 max-w-lg">
              
              {/* Primary Card: Begin Patient Intake -> Routes to P-01 (/patient/welcome) */}
              <div
                onClick={handleBeginPatientIntake}
                className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-6 shadow-sm hover:shadow-md hover:translate-y-[-2px] active:scale-[0.99] transition-all cursor-pointer flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-sm shadow-blue-500/30">
                  +
                </div>
                <div>
                  <h3 className="text-[19px] font-bold text-[#18181B] group-hover:text-[#2563EB] transition-colors">
                    Begin Patient Intake
                  </h3>
                  <p className="text-[14px] text-[#71717A] mt-1">
                    Speak, tap, or scan your previous records.
                  </p>
                </div>
              </div>

              {/* Secondary Card: Staff & Clinical Access */}
              <div
                onClick={() => onNavigate('staff-role')}
                className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:translate-y-[-2px] active:scale-[0.99] transition-all cursor-pointer flex items-start gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F4F4F5] text-[#52525B] flex items-center justify-center shrink-0 border border-[#E4E4E7]">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="text-[19px] font-bold text-[#18181B] group-hover:text-[#2563EB] transition-colors">
                    Staff &amp; Clinical Access
                  </h3>
                  <p className="text-[14px] text-[#71717A] mt-1">
                    For doctors, nursing staff, and administrators.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Region - 3D Visual Anchor Stack */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <ClinicalVisual />
          </div>
        </main>

        {/* Bottom Footer */}
        <footer className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[13px] text-[#71717A]">
          <div className="flex items-center gap-2">
            <Languages size={16} className="text-[#2563EB]" />
            <span>Available in multiple Indian languages</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px bg-[#C3C6D7]/40 w-12 hidden sm:block" />
            <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-[#71717A]">
              <BadgeCheck size={14} className="text-[#16A34A]" />
              <span>SECURE CLINICAL INTAKE • PHYSICIAN VERIFIED</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  )
}
