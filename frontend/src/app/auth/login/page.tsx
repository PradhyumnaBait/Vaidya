'use client'

import { useRouter } from 'next/navigation'
import {
  Stethoscope,
  Activity,
  Building2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Users,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'
import { VaidyaWordmark } from '@/components/ui'

export default function StaffRoleSelectionPage() {
  const router = useRouter()

  const handleSelectRole = (rolePath: string) => {
    router.push(rolePath)
  }

  return (
    <div className="min-h-screen bg-[#FAF8FF] flex flex-col justify-between p-5 sm:p-8 lg:p-12 select-none antialiased">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#004AC6]/5 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#006A61]/5 rounded-full blur-[130px]" />
      </div>

      {/* Top Bar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between relative z-10">
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-[13px] font-bold text-[#52525B] hover:text-[#18181B] bg-white px-3.5 py-1.5 rounded-xl border border-[#E1E2ED] shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft size={15} />
          <span>Back to Homepage</span>
        </button>

        <div className="flex items-center gap-2">
          <VaidyaWordmark size="sm" showDescriptor={false} />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#004AC6] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE] hidden sm:inline-block">
            Clinical Console
          </span>
        </div>
      </header>

      {/* Main Content Card */}
      <main className="w-full max-w-5xl mx-auto my-auto py-10 relative z-10 space-y-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] text-[12px] font-bold tracking-wide">
            <ShieldCheck size={14} className="text-[#004AC6]" />
            <span>Hospital Staff &amp; Clinician Workspaces</span>
          </div>

          <h1 className="text-[32px] sm:text-[40px] font-bold text-[#18181B] tracking-tight">
            Select Your Clinical Workspace
          </h1>

          <p className="text-[15px] text-[#52525B] leading-relaxed">
            Access your department&apos;s pre-consultation queue, triage monitoring station, or hospital infrastructure console.
          </p>

          {/* Floating Mini KPI Previews */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-[#E1E2ED] shadow-xs flex items-center gap-2 text-[12px] text-[#52525B]">
              <Users size={14} className="text-[#004AC6]" />
              <span><strong>5</strong> Patients Waiting</span>
            </div>
            <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-[#FECACA] shadow-xs flex items-center gap-2 text-[12px] text-[#991B1B]">
              <AlertTriangle size={14} className="text-[#DC2626]" />
              <span><strong>1</strong> Priority Triage</span>
            </div>
            <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-[#BBF7D0] shadow-xs flex items-center gap-2 text-[12px] text-[#166534]">
              <CheckCircle2 size={14} className="text-[#16A34A]" />
              <span><strong>24</strong> Completed Today</span>
            </div>
          </div>
        </div>

        {/* 3 Premium Workspace Selection Surfaces */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Doctor / Physician Workspace */}
          <button
            onClick={() => handleSelectRole('/auth/login/doctor')}
            className="group w-full text-left bg-white border border-[#E1E2ED] hover:border-[#004AC6] hover:shadow-lg rounded-3xl p-7 transition-all duration-200 flex flex-col justify-between cursor-pointer active:scale-[0.98] relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#004AC6]/10 text-[#004AC6] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Stethoscope size={28} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#004AC6] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                  OPD &amp; Inpatient
                </span>
                <h2 className="text-[20px] font-bold text-[#18181B] group-hover:text-[#004AC6] transition-colors mt-1">
                  Physician Workspace
                </h2>
                <p className="text-[13px] text-[#52525B] leading-relaxed mt-2">
                  Review prepared patient cases, AI-assisted clinical summaries, optical evidence crops, and confirm intake findings.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#F4F4F5] text-[13px] font-bold text-[#004AC6] flex items-center justify-between">
              <span>Enter Doctor Queue</span>
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          </button>

          {/* Nursing / Triage Station */}
          <button
            onClick={() => handleSelectRole('/auth/login/nursing')}
            className="group w-full text-left bg-white border border-[#E1E2ED] hover:border-[#006A61] hover:shadow-lg rounded-3xl p-7 transition-all duration-200 flex flex-col justify-between cursor-pointer active:scale-[0.98] relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#006A61]/10 text-[#006A61] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Activity size={28} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#006A61] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                  Triage &amp; Intake Flow
                </span>
                <h2 className="text-[20px] font-bold text-[#18181B] group-hover:text-[#006A61] transition-colors mt-1">
                  Nursing Station
                </h2>
                <p className="text-[13px] text-[#52525B] leading-relaxed mt-2">
                  Monitor waiting hall kiosk progress, acknowledge acute red-flag cardiac alerts, and record patient vitals.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#F4F4F5] text-[13px] font-bold text-[#006A61] flex items-center justify-between">
              <span>Enter Triage Station</span>
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          </button>

          {/* Hospital Administrator */}
          <button
            onClick={() => handleSelectRole('/auth/login/admin')}
            className="group w-full text-left bg-white border border-[#E1E2ED] hover:border-[#2563EB] hover:shadow-lg rounded-3xl p-7 transition-all duration-200 flex flex-col justify-between cursor-pointer active:scale-[0.98] relative overflow-hidden"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Building2 size={28} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                  Infrastructure &amp; Audit
                </span>
                <h2 className="text-[20px] font-bold text-[#18181B] group-hover:text-[#2563EB] transition-colors mt-1">
                  Hospital Admin
                </h2>
                <p className="text-[13px] text-[#52525B] leading-relaxed mt-2">
                  Track hospital-wide OPD intake metrics, monitor external Bhashini &amp; ABDM integration health, and audit access trails.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-[#F4F4F5] text-[13px] font-bold text-[#2563EB] flex items-center justify-between">
              <span>Enter Admin Console</span>
              <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform" />
            </div>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl mx-auto text-center text-[12px] text-[#71717A] relative z-10">
        <p>VAIDYA Clinical Intelligence Platform • Smart India Hackathon • SIH26047</p>
      </footer>
    </div>
  )
}
