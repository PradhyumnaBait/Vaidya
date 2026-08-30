'use client'
import { useRouter } from 'next/navigation'
import { ArrowRight, ShieldCheck, Globe } from 'lucide-react'
import { VaidyaWordmark } from '@/components/ui'
import { ClinicalVisual } from '@/components/clinical'

export default function WelcomePage() {
  const router = useRouter()

  const handlePatientStart = () => {
    router.push('/patient/identify')
  }

  const handleStaffAccess = () => {
    router.push('/auth/login')
  }

  return (
    <div className="min-h-[calc(100vh-52px)] bg-[#F6F6F7] flex flex-col justify-between p-4 sm:p-6 lg:p-10 select-none">
      {/* Top Bar / Branding */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between mb-8 sm:mb-12">
        <VaidyaWordmark size="md" showDescriptor={true} />
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#E4E4E7] text-[12px] text-[#71717A] shadow-sm">
          <Globe size={14} className="text-[#2563EB]" />
          <span>Available in 12 Indian Languages</span>
        </div>
      </div>

      {/* Main Content Split Composition */}
      <div className="w-full max-w-7xl mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
        {/* Primary Region - Left Side */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#EFF6FF] text-[#1E40AF] text-[12px] font-medium mb-4 border border-[#BFDBFE]">
              SIH 2026 · Problem Statement SIH26047
            </div>
            <h1 className="text-[32px] sm:text-[40px] font-semibold text-[#18181B] tracking-[-0.02em] leading-[1.15]">
              Welcome to Vaidya
            </h1>
            <p className="text-[15px] sm:text-[16px] text-[#52525B] leading-relaxed mt-2 max-w-lg">
              Your clinical information, prepared before the consultation.
            </p>
          </div>

          {/* Patient Primary Action Card */}
          <div className="bg-white border border-[#E4E4E7] rounded-xl p-5 sm:p-6 shadow-sm hover:border-[#D4D4D8] transition-all">
            <button
              onClick={handlePatientStart}
              className="w-full min-h-[52px] px-6 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.99] text-white text-[16px] font-medium rounded-lg flex items-center justify-between transition-all shadow-sm group cursor-pointer"
            >
              <span>Begin Patient Intake</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-[13px] text-[#71717A] mt-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
              Speak, tap, or scan your previous records.
            </p>
          </div>

          {/* Secondary Action - Staff & Clinical Access */}
          <div className="pt-2 border-t border-[#E4E4E7]">
            <button
              onClick={handleStaffAccess}
              className="w-full text-left p-4 rounded-lg bg-white border border-[#E4E4E7] hover:bg-[#F9F9FA] hover:border-[#D4D4D8] transition-all flex items-center justify-between group cursor-pointer"
            >
              <div>
                <div className="text-[15px] font-medium text-[#18181B] group-hover:text-[#2563EB] transition-colors">
                  Staff &amp; Clinical Access
                </div>
                <div className="text-[13px] text-[#71717A] mt-0.5">
                  For doctors, nursing staff, and administrators.
                </div>
              </div>
              <span className="text-[13px] font-medium text-[#2563EB] group-hover:underline shrink-0 ml-4">
                Sign in &rarr;
              </span>
            </button>
          </div>

          <div className="sm:hidden flex items-center gap-2 text-[12px] text-[#71717A]">
            <Globe size={14} className="text-[#2563EB]" />
            <span>Available in 12 Indian Languages</span>
          </div>
        </div>

        {/* Secondary Region - Right Side 3D Visual Anchor */}
        <div className="lg:col-span-6 min-h-[380px] sm:min-h-[440px] flex items-center justify-center relative">
          <ClinicalVisual />
        </div>
      </div>

      {/* Bottom System Note */}
      <div className="w-full max-w-7xl mx-auto pt-6 border-t border-[#E4E4E7] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#A1A1AA]">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#16A34A]" />
          <span>Secure clinical intake • Physician verified</span>
        </div>
        <div className="font-mono">
          All India Institute of Ayurveda (AIIA) OPD Platform
        </div>
      </div>
    </div>
  )
}
