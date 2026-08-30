'use client'
import { useRouter } from 'next/navigation'
import { Stethoscope, Activity, Building2, ArrowLeft } from 'lucide-react'
import { VaidyaWordmark } from '@/components/ui'

export default function StaffRoleSelectionPage() {
  const router = useRouter()

  const handleSelectRole = (rolePath: string) => {
    router.push(rolePath)
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7] flex flex-col justify-between p-4 sm:p-6 lg:p-10 select-none">
      {/* Top Bar */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
        <button
          onClick={() => router.push('/patient/welcome')}
          className="inline-flex items-center gap-2 text-[13px] text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Welcome</span>
        </button>
        <VaidyaWordmark size="sm" showDescriptor={false} />
      </div>

      {/* Main Content Card */}
      <div className="w-full max-w-3xl mx-auto my-auto py-8">
        <div className="text-center mb-8 sm:mb-10">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BFDBFE]">
            Staff &amp; Clinical Access
          </span>
          <h1 className="text-[28px] sm:text-[36px] font-semibold text-[#18181B] tracking-tight mt-3">
            Choose your workspace
          </h1>
          <p className="text-[14px] sm:text-[15px] text-[#71717A] mt-2">
            Select the workspace you use for your work at the hospital.
          </p>
        </div>

        {/* 3 Role Selection Surfaces */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Doctor Role */}
          <button
            onClick={() => handleSelectRole('/auth/login/doctor')}
            className="group w-full text-left bg-white border border-[#E4E4E7] hover:border-[#2563EB] hover:shadow-md rounded-xl p-6 transition-all duration-150 flex flex-col justify-between cursor-pointer active:scale-[0.98]"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Stethoscope size={24} strokeWidth={1.75} />
              </div>
              <h2 className="text-[18px] font-semibold text-[#18181B] group-hover:text-[#2563EB] transition-colors">
                Doctor
              </h2>
              <p className="text-[12px] font-medium text-[#2563EB] mt-0.5">
                Physician workspace
              </p>
              <p className="text-[13px] text-[#71717A] leading-relaxed mt-3">
                Review patient cases, clinical summaries and consultation information.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F4F4F5] text-[13px] font-medium text-[#2563EB] flex items-center justify-between">
              <span>Sign in as Doctor</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
          </button>

          {/* Nursing / Staff Role */}
          <button
            onClick={() => handleSelectRole('/auth/login/nursing')}
            className="group w-full text-left bg-white border border-[#E4E4E7] hover:border-[#2563EB] hover:shadow-md rounded-xl p-6 transition-all duration-150 flex flex-col justify-between cursor-pointer active:scale-[0.98]"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Activity size={24} strokeWidth={1.75} />
              </div>
              <h2 className="text-[18px] font-semibold text-[#18181B] group-hover:text-[#2563EB] transition-colors">
                Nursing / Staff
              </h2>
              <p className="text-[12px] font-medium text-[#16A34A] mt-0.5">
                Triage &amp; patient operations
              </p>
              <p className="text-[13px] text-[#71717A] leading-relaxed mt-3">
                Monitor patient status, urgent alerts and intake progress.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F4F4F5] text-[13px] font-medium text-[#2563EB] flex items-center justify-between">
              <span>Sign in as Staff</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
          </button>

          {/* Admin Role */}
          <button
            onClick={() => handleSelectRole('/auth/login/admin')}
            className="group w-full text-left bg-white border border-[#E4E4E7] hover:border-[#2563EB] hover:shadow-md rounded-xl p-6 transition-all duration-150 flex flex-col justify-between cursor-pointer active:scale-[0.98]"
          >
            <div>
              <div className="w-12 h-12 rounded-lg bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Building2 size={24} strokeWidth={1.75} />
              </div>
              <h2 className="text-[18px] font-semibold text-[#18181B] group-hover:text-[#2563EB] transition-colors">
                Admin
              </h2>
              <p className="text-[12px] font-medium text-[#0D9488] mt-0.5">
                Hospital operations
              </p>
              <p className="text-[13px] text-[#71717A] leading-relaxed mt-3">
                Monitor system activity, integrations and operational analytics.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#F4F4F5] text-[13px] font-medium text-[#2563EB] flex items-center justify-between">
              <span>Sign in as Admin</span>
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-4xl mx-auto text-center text-[12px] text-[#A1A1AA] pt-4">
        For authorized hospital personnel only • All India Institute of Ayurveda
      </div>
    </div>
  )
}
