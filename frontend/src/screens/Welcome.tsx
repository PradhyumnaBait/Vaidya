'use client'

import { useRouter } from 'next/navigation'
import {
  Languages,
  BadgeCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Mic,
  FileText,
  Activity,
  AlertTriangle,
  Layers,
  HeartPulse,
  Building2,
  Lock,
  Search,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import VaidyaWordmark from '@/components/VaidyaWordmark'
import ClinicalVisual from '@/components/ClinicalVisual'
import type { Screen } from '@/types'

interface WelcomeProps {
  onNavigate: (screen: Screen) => void
}

export default function Welcome({ onNavigate }: WelcomeProps) {
  const router = useRouter()

  const handleLaunchKiosk = () => {
    router.push('/kiosk')
  }

  return (
    <div className="bg-[#FAF8FF] min-h-screen w-full flex flex-col text-[#191B23] antialiased selection:bg-[#2563EB] selection:text-white">
      {/* Background Soft Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-[#2563EB]/5 rounded-full blur-[140px]" />
        <div className="absolute top-[35%] left-[-10%] w-[600px] h-[600px] bg-[#006A61]/5 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-[#2563EB]/4 rounded-full blur-[160px]" />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          1. STICKY PRODUCT HEADER & NAVIGATION
      ───────────────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#E4E4E7]/80 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left Wordmark */}
          <div className="flex items-center gap-3">
            <VaidyaWordmark size="md" showDescriptor={false} />
            <div className="h-4 w-px bg-[#C3C6D7]/60 hidden sm:block" />
            <span className="hidden sm:inline-block font-mono text-[11px] tracking-widest text-[#2563EB] font-bold uppercase">
              Clinical Intelligence
            </span>
          </div>

          {/* Center Navigation Anchors */}
          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-[#52525B]">
            <a href="#how-it-works" className="hover:text-[#2563EB] transition-colors">
              How It Works
            </a>
            <a href="#differentiators" className="hover:text-[#2563EB] transition-colors">
              Differentiators
            </a>
            <a href="#clinical-intelligence" className="hover:text-[#2563EB] transition-colors">
              Clinical Intelligence
            </a>
            <a href="#ecosystem" className="hover:text-[#2563EB] transition-colors">
              ABHA Ecosystem
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('staff-role')}
              className="px-3.5 py-1.5 rounded-xl text-[13px] font-bold text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-all flex items-center gap-1.5"
            >
              <ShieldCheck size={16} className="text-[#2563EB]" />
              <span>Staff Login</span>
            </button>

            <button
              onClick={handleLaunchKiosk}
              className="px-4 py-2 rounded-xl text-[13px] font-bold bg-[#004AC6] text-white hover:bg-[#003EA8] shadow-sm hover:shadow transition-all flex items-center gap-1.5 active:scale-98"
            >
              <span>Launch Kiosk</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* ─────────────────────────────────────────────────────────────────────────────
            2. HERO SECTION
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="w-full max-w-[1280px] mx-auto px-5 md:px-8 pt-10 pb-16 lg:py-20 flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Product Value & Direct CTAs */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-7">
              {/* Context Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] text-[12px] font-semibold tracking-wide w-fit">
                <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                <span>Smart India Hackathon • SIH26047</span>
                <span className="text-[#93C5FD]">|</span>
                <span className="text-[#2563EB] font-bold">OPD Pre-Consultation Synthesis</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <h1 className="text-[44px] sm:text-[56px] lg:text-[60px] font-bold text-[#18181B] tracking-tight leading-[1.08]">
                  Your clinical information, <br className="hidden sm:inline" />
                  <span className="text-[#004AC6]">prepared before</span> the consultation.
                </h1>
                <p className="text-[17px] sm:text-[19px] text-[#52525B] max-w-xl leading-relaxed">
                  VAIDYA captures patient symptoms, past prescriptions, and dietary patterns at the kiosk—synthesizing a structured clinical brief for the OPD physician before the patient steps in.
                </p>
              </div>

              {/* Action Cards (Direct entry) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl pt-2">
                {/* Primary Card: Begin Patient Intake -> /kiosk */}
                <div
                  onClick={handleLaunchKiosk}
                  className="bg-white/95 backdrop-blur-xl border-2 border-[#004AC6]/30 hover:border-[#004AC6] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group active:scale-98"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#004AC6] text-white flex items-center justify-center font-bold text-lg shadow-sm shadow-blue-500/20">
                      +
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#004AC6] bg-[#EFF6FF] px-2 py-0.5 rounded-md">
                      Interactive Kiosk
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-[#18181B] group-hover:text-[#004AC6] transition-colors flex items-center gap-1.5">
                      <span>Begin Patient Intake</span>
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </h3>
                    <p className="text-[13px] text-[#71717A] mt-1 leading-snug">
                      Touch, speak, or scan records in 6 Indian languages.
                    </p>
                  </div>
                </div>

                {/* Secondary Card: Staff & Clinical Access */}
                <div
                  onClick={() => onNavigate('staff-role')}
                  className="bg-white/90 backdrop-blur-xl border border-[#E4E4E7] hover:border-[#C3C6D7] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group active:scale-98"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F4F4F5] text-[#52525B] flex items-center justify-center border border-[#E4E4E7]">
                      <ShieldCheck size={20} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] bg-[#F4F4F5] px-2 py-0.5 rounded-md">
                      Clinician Portal
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-[#18181B] group-hover:text-[#004AC6] transition-colors flex items-center gap-1.5">
                      <span>Staff &amp; Clinical Access</span>
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </h3>
                    <p className="text-[13px] text-[#71717A] mt-1 leading-snug">
                      For OPD doctors, triage nursing, and hospital admins.
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-1 text-[13px] text-[#71717A]">
                <div className="flex items-center gap-1.5">
                  <Languages size={15} className="text-[#004AC6]" />
                  <span className="font-semibold text-[#18181B]">6 Languages:</span>
                  <span>EN • हिन्दी • मराठी • ગુજરાતી • বাংলা • தமிழ்</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BadgeCheck size={15} className="text-[#16A34A]" />
                  <span className="font-medium">Physician-Verified AI</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Visual Anchor */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <ClinicalVisual />
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            3. PROBLEM & SOLUTION (SIH Problem Context)
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="w-full bg-white border-y border-[#E4E4E7] py-16">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[12px] font-bold uppercase tracking-widest text-[#004AC6] font-mono">
                The Outpatient Challenge
              </span>
              <h2 className="text-[30px] sm:text-[36px] font-bold text-[#18181B] tracking-tight mt-1.5">
                Bridging the Gap Between Patient Recall and Clinical Decision
              </h2>
              <p className="text-[15px] text-[#52525B] mt-2 leading-relaxed">
                High patient load in Indian hospital OPDs leaves doctors with only 3–5 minutes per consultation, much of which is spent extracting scattered medical history.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Problem Box */}
              <div className="bg-[#FEF2F2]/60 rounded-3xl p-7 border border-[#FCA5A5]/40 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#DC2626] text-white flex items-center justify-center font-bold">
                    ✕
                  </div>
                  <h3 className="text-[18px] font-bold text-[#991B1B]">
                    Current OPD Bottleneck
                  </h3>
                </div>
                <ul className="space-y-2.5 text-[14px] text-[#7F1D1D]/90">
                  <li className="flex items-start gap-2">
                    <span className="text-[#DC2626] font-bold shrink-0">•</span>
                    <span>Patients struggle to recall onset, dosage, or prior medication names accurately under stress.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#DC2626] font-bold shrink-0">•</span>
                    <span>Physical paper prescriptions and laboratory reports remain unindexed and unorganized.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#DC2626] font-bold shrink-0">•</span>
                    <span>Valuable doctor consultation time is consumed by routine data transcription instead of clinical examination.</span>
                  </li>
                </ul>
              </div>

              {/* Solution Box */}
              <div className="bg-[#F0FDF4]/60 rounded-3xl p-7 border border-[#86EFAC]/50 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <h3 className="text-[18px] font-bold text-[#14532D]">
                    The VAIDYA Solution
                  </h3>
                </div>
                <ul className="space-y-2.5 text-[14px] text-[#166534]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#16A34A] font-bold shrink-0">•</span>
                    <span>Patients complete self-guided multimodal intake (voice &amp; touch) in their native language in the waiting area.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#16A34A] font-bold shrink-0">•</span>
                    <span>Previous prescriptions and lab reports are optically scanned and converted into structured medical facts.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#16A34A] font-bold shrink-0">•</span>
                    <span>Doctors receive a synthesized, verified pre-consultation brief with provenance tags before the visit starts.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            4. WHAT VAIDYA DOES (4 Core Pillars)
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-20 bg-[#FAF8FF]">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[12px] font-bold uppercase tracking-widest text-[#004AC6] font-mono">
                System Overview
              </span>
              <h2 className="text-[32px] sm:text-[38px] font-bold text-[#18181B] tracking-tight mt-1.5">
                How VAIDYA Prepares the Consultation
              </h2>
              <p className="text-[15px] text-[#52525B] mt-2">
                A seamless handover from patient waiting room self-service to doctor examination room.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Patient at Kiosk',
                  desc: 'Patient interacts in native language via touch or voice to log chief complaints and onset details.',
                  icon: Mic,
                  color: 'text-[#004AC6]',
                  bg: 'bg-[#004AC6]/10',
                },
                {
                  step: '02',
                  title: 'Document Digitization',
                  desc: 'Optical camera scans physical paper prescriptions and reports with real-time blur and lighting checks.',
                  icon: FileText,
                  color: 'text-[#006A61]',
                  bg: 'bg-[#86F2E4]/30',
                },
                {
                  step: '03',
                  title: 'Clinical Structuring',
                  desc: 'Extracts symptoms, medications, allergens, and dietary triggers into structured, auditable medical facts.',
                  icon: Layers,
                  color: 'text-[#2563EB]',
                  bg: 'bg-[#EFF6FF]',
                },
                {
                  step: '04',
                  title: 'Prepared Clinician View',
                  desc: 'Physician receives synthesized summary, conflict alerts, and document evidence on their OPD console.',
                  icon: Activity,
                  color: 'text-[#16A34A]',
                  bg: 'bg-[#F0FDF4]',
                },
              ].map((pillar) => {
                const Icon = pillar.icon
                return (
                  <div
                    key={pillar.step}
                    className="bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className={`w-12 h-12 rounded-2xl ${pillar.bg} ${pillar.color} flex items-center justify-center`}>
                          <Icon size={24} />
                        </div>
                        <span className="font-mono text-[14px] font-bold text-[#A1A1AA]">
                          {pillar.step}
                        </span>
                      </div>
                      <h3 className="text-[18px] font-bold text-[#18181B] mb-2">
                        {pillar.title}
                      </h3>
                      <p className="text-[13px] text-[#71717A] leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            5. HOW IT WORKS (Visual Workflow Pipeline)
        ───────────────────────────────────────────────────────────────────────────── */}
        <section id="how-it-works" className="w-full bg-white border-y border-[#E4E4E7] py-16 md:py-20 scroll-mt-20">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[12px] font-bold uppercase tracking-widest text-[#004AC6] font-mono">
                End-to-End Pipeline
              </span>
              <h2 className="text-[32px] sm:text-[38px] font-bold text-[#18181B] tracking-tight mt-1.5">
                The Clinical Handoff Journey
              </h2>
              <p className="text-[15px] text-[#52525B] mt-2">
                From OPD entrance to consultation completion in 6 clear stages.
              </p>
            </div>

            {/* Workflow Timeline Track */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 relative">
              {[
                { title: '1. Patient Kiosk', sub: 'ABHA QR / Mobile ID identification & registration' },
                { title: '2. Voice & Touch', sub: 'Multilingual symptom capture & audio guidance' },
                { title: '3. Document OCR', sub: 'Capture prescriptions & lab reports with quality retry' },
                { title: '4. AI Summary', sub: 'Clinical entity synthesis & contradiction analysis' },
                { title: '5. Doctor Review', sub: 'Provenance checks & one-click fact verification' },
                { title: '6. Consultation', sub: 'Focused doctor-patient diagnosis and prescription' },
              ].map((item, idx) => (
                <div
                  key={item.title}
                  className="bg-[#FAF8FF] rounded-2xl p-4 border border-[#E1E2ED] shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <span className="w-6 h-6 rounded-full bg-[#004AC6] text-white text-[11px] font-bold flex items-center justify-center mb-3">
                      {idx + 1}
                    </span>
                    <h4 className="text-[15px] font-bold text-[#18181B] mb-1">
                      {item.title}
                    </h4>
                    <p className="text-[12px] text-[#71717A] leading-snug">
                      {item.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Live Demo CTA */}
            <div className="mt-10 bg-[#EFF6FF] rounded-3xl p-6 border border-[#BFDBFE] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#004AC6] text-white flex items-center justify-center shrink-0">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="text-[16px] font-bold text-[#1E40AF]">
                    Experience the complete patient flow
                  </h4>
                  <p className="text-[13px] text-[#1E40AF]/80">
                    Test the 6-language kiosk with simulated voice input, document scanning, and token issuance.
                  </p>
                </div>
              </div>
              <button
                onClick={handleLaunchKiosk}
                className="px-5 py-2.5 rounded-xl bg-[#004AC6] text-white text-[13px] font-bold hover:bg-[#003EA8] transition-all shrink-0 active:scale-98"
              >
                Launch Kiosk Demo →
              </button>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            6. KEY DIFFERENTIATORS (5 Implemented Strengths)
        ───────────────────────────────────────────────────────────────────────────── */}
        <section id="differentiators" className="w-full py-16 md:py-20 bg-[#FAF8FF] scroll-mt-20">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[12px] font-bold uppercase tracking-widest text-[#004AC6] font-mono">
                Core Innovations
              </span>
              <h2 className="text-[32px] sm:text-[38px] font-bold text-[#18181B] tracking-tight mt-1.5">
                Built Specifically for Public Health Realities
              </h2>
              <p className="text-[15px] text-[#52525B] mt-2">
                Designed for high OPD volumes, linguistic diversity, and low digital literacy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Diff 1 */}
              <div className="bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#004AC6]/10 text-[#004AC6] flex items-center justify-center mb-4">
                    <Languages size={24} />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#18181B] mb-2">
                    Multilingual Across India
                  </h3>
                  <p className="text-[13px] text-[#71717A] leading-relaxed mb-4">
                    True client-side translation across 6 languages: English, हिन्दी, मराठी, ગુજરાતી, বাংলা, and தமிழ். In-session language switching preserves all entered answers.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#EDEDF9]">
                  {['English', 'हिन्दी', 'मराठी', 'ગુજરાતી', 'বাংলা', 'தமிழ்'].map((l) => (
                    <span key={l} className="text-[11px] font-semibold bg-[#F3F3FE] text-[#004AC6] px-2 py-0.5 rounded-md">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              {/* Diff 2 */}
              <div className="bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#006A61]/10 text-[#006A61] flex items-center justify-center mb-4">
                    <Mic size={24} />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#18181B] mb-2">
                    Multimodal Voice + Touch
                  </h3>
                  <p className="text-[13px] text-[#71717A] leading-relaxed mb-4">
                    Voice is a first-class citizen alongside touch. Patients can speak complaints naturally or tap large, clear icons with audio playback for all questions.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#006A61] pt-2 border-t border-[#EDEDF9]">
                  <CheckCircle2 size={15} />
                  <span>Senior-friendly 88px+ touch targets</span>
                </div>
              </div>

              {/* Diff 3 */}
              <div className="bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center mb-4">
                    <FileText size={24} />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#18181B] mb-2">
                    Document-Aware OCR
                  </h3>
                  <p className="text-[13px] text-[#71717A] leading-relaxed mb-4">
                    Built-in optical camera scanner extracts medications, past diagnoses, and lab trends from paper records with real-time blur and lighting guidance.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#2563EB] pt-2 border-t border-[#EDEDF9]">
                  <CheckCircle2 size={15} />
                  <span>Quality retry &amp; multi-doc support</span>
                </div>
              </div>

              {/* Diff 4 */}
              <div className="bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mb-4">
                    <HeartPulse size={24} />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#18181B] mb-2">
                    Clinician-First Verification
                  </h3>
                  <p className="text-[13px] text-[#71717A] leading-relaxed mb-4">
                    AI never makes final diagnostic decisions. It structures the data and highlights confidence provenance so the physician remains in total control.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#16A34A] pt-2 border-t border-[#EDEDF9]">
                  <BadgeCheck size={15} />
                  <span>Tier 1–5 confidence badges</span>
                </div>
              </div>

              {/* Diff 5 */}
              <div className="bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#D97706]/10 text-[#D97706] flex items-center justify-center mb-4">
                    <Building2 size={24} />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#18181B] mb-2">
                    AYUSH &amp; Allopathy Harmony
                  </h3>
                  <p className="text-[13px] text-[#71717A] leading-relaxed mb-4">
                    Supports Ahara (dietary patterns) and Vihara (lifestyle triggers) alongside conventional allopathic Chief Complaint categories for holistic OPDs like AIIA.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#D97706] pt-2 border-t border-[#EDEDF9]">
                  <CheckCircle2 size={15} />
                  <span>Dietary trigger tracking</span>
                </div>
              </div>

              {/* Diff 6 */}
              <div className="bg-white rounded-3xl p-6 border border-[#E1E2ED] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#64748B]/10 text-[#64748B] flex items-center justify-center mb-4">
                    <Lock size={24} />
                  </div>
                  <h3 className="text-[18px] font-bold text-[#18181B] mb-2">
                    Zero-PHI Ephemeral Privacy
                  </h3>
                  <p className="text-[13px] text-[#71717A] leading-relaxed mb-4">
                    Kiosk sessions operate purely in-memory. Personal health data is never stored in browser localStorage and automatically resets after 10 seconds of completion.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#64748B] pt-2 border-t border-[#EDEDF9]">
                  <ShieldCheck size={15} />
                  <span>Automatic idle privacy purge</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            7. CLINICAL INTELLIGENCE SECTION (Surfacing What Matters to Doctors)
        ───────────────────────────────────────────────────────────────────────────── */}
        <section id="clinical-intelligence" className="w-full bg-white border-y border-[#E4E4E7] py-16 md:py-20 scroll-mt-20">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[12px] font-bold uppercase tracking-widest text-[#004AC6] font-mono">
                Doctor-Facing Intelligence
              </span>
              <h2 className="text-[32px] sm:text-[38px] font-bold text-[#18181B] tracking-tight mt-1.5">
                Surfacing What Matters in the First 30 Seconds
              </h2>
              <p className="text-[15px] text-[#52525B] mt-2">
                VAIDYA structures intake records into intuitive, decision-ready clinical modules.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Feature 1: Conflict Resolution */}
              <div className="bg-[#FAF8FF] rounded-3xl p-6 border border-[#E1E2ED] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#D97706] mb-3">
                    <AlertTriangle size={18} />
                    <span className="text-[13px] font-bold uppercase tracking-wider">Contradiction Detection</span>
                  </div>
                  <h4 className="text-[17px] font-bold text-[#18181B] mb-2">
                    Allergy &amp; Drug Mismatches
                  </h4>
                  <p className="text-[13px] text-[#71717A] leading-relaxed mb-4">
                    Automatically compares patient verbal statements against uploaded physical records to flag contradictions before prescription.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E1E2ED] text-[12px] text-[#434655]">
                  <span className="font-bold text-[#D97706]">Example:</span> Document says <em>&quot;No allergy&quot;</em> vs. Patient says <em>&quot;Penicillin reaction&quot;</em>.
                </div>
              </div>

              {/* Feature 2: Provenance Tracking */}
              <div className="bg-[#FAF8FF] rounded-3xl p-6 border border-[#E1E2ED] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#004AC6] mb-3">
                    <Search size={18} />
                    <span className="text-[13px] font-bold uppercase tracking-wider">Traceable Provenance</span>
                  </div>
                  <h4 className="text-[17px] font-bold text-[#18181B] mb-2">
                    Evidence Drawer Inspection
                  </h4>
                  <p className="text-[13px] text-[#71717A] leading-relaxed mb-4">
                    Every extracted clinical entity links directly to its source document snippet, page number, and confidence percentage.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E1E2ED] text-[12px] text-[#434655]">
                  <span className="font-bold text-[#004AC6]">Audit:</span> Click any fact to view the exact optical crop from the prescription.
                </div>
              </div>

              {/* Feature 3: Longitudinal Timeline */}
              <div className="bg-[#FAF8FF] rounded-3xl p-6 border border-[#E1E2ED] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#16A34A] mb-3">
                    <Clock size={18} />
                    <span className="text-[13px] font-bold uppercase tracking-wider">Patient Timeline</span>
                  </div>
                  <h4 className="text-[17px] font-bold text-[#18181B] mb-2">
                    Reconstructed History
                  </h4>
                  <p className="text-[13px] text-[#71717A] leading-relaxed mb-4">
                    Organizes years of disjointed visits, surgeries, and chronic diagnoses into a single chronological timeline.
                  </p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#E1E2ED] text-[12px] text-[#434655]">
                  <span className="font-bold text-[#16A34A]">Timeline:</span> 2010 Appendectomy → 2018 Smoking Cessation → 2026 Gastric Pain.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            8. ABHA / ECOSYSTEM SECTION
        ───────────────────────────────────────────────────────────────────────────── */}
        <section id="ecosystem" className="w-full py-16 md:py-20 bg-[#FAF8FF] scroll-mt-20">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8">
            <div className="bg-gradient-to-br from-[#004AC6] to-[#002D7A] rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[12px] font-semibold text-blue-100 border border-white/20">
                  <span>Ayushman Bharat Digital Mission Alignment</span>
                </div>
                <h2 className="text-[30px] sm:text-[36px] font-bold leading-tight">
                  Designed for Integration with India&apos;s Digital Health Ecosystem
                </h2>
                <p className="text-[15px] text-blue-100/90 leading-relaxed">
                  VAIDYA aligns with ABDM standards—facilitating ABHA QR-based patient identification, FHIR R4 clinical fact serialization, and seamless interoperability with hospital HMIS systems.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <span className="text-[12px] font-bold block">ABHA Paperless</span>
                    <span className="text-[11px] text-blue-200">14-digit Health ID QR</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <span className="text-[12px] font-bold block">FHIR R4 Schema</span>
                    <span className="text-[11px] text-blue-200">Standardized records</span>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                    <span className="text-[12px] font-bold block">HMIS Ready</span>
                    <span className="text-[11px] text-blue-200">OPD Queue Sync</span>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-auto flex flex-col gap-3 shrink-0">
                <button
                  onClick={handleLaunchKiosk}
                  className="px-6 py-3.5 rounded-2xl bg-white text-[#004AC6] text-[14px] font-bold hover:bg-blue-50 transition-all shadow-md active:scale-98 text-center"
                >
                  Test ABHA Kiosk Check-In →
                </button>
                <button
                  onClick={() => onNavigate('staff-role')}
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-[14px] font-bold border border-white/20 transition-all active:scale-98 text-center"
                >
                  Clinician Authentication
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            9. FINAL CTA SECTION
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="w-full py-16 md:py-20 bg-white border-t border-[#E4E4E7] text-center">
          <div className="max-w-[720px] mx-auto px-5">
            <h2 className="text-[34px] sm:text-[42px] font-bold text-[#18181B] tracking-tight">
              Prepare the visit before the consultation.
            </h2>
            <p className="text-[16px] text-[#52525B] mt-3 leading-relaxed">
              Experience how VAIDYA transforms busy hospital waiting halls into structured, multilingual clinical intake hubs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <button
                onClick={handleLaunchKiosk}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#004AC6] text-white text-[15px] font-bold hover:bg-[#003EA8] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <span>Try Patient Kiosk</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => onNavigate('staff-role')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#F4F4F5] text-[#18181B] text-[15px] font-bold hover:bg-[#E4E4E7] transition-all border border-[#E4E4E7] flex items-center justify-center gap-2 active:scale-98"
              >
                <ShieldCheck size={18} className="text-[#004AC6]" />
                <span>Staff &amp; Clinical Access</span>
              </button>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            10. FOOTER
        ───────────────────────────────────────────────────────────────────────────── */}
        <footer className="w-full bg-[#FAF8FF] border-t border-[#E4E4E7] py-10 text-[13px] text-[#71717A]">
          <div className="max-w-[1280px] mx-auto px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <VaidyaWordmark size="sm" showDescriptor={false} />
              <div className="h-4 w-px bg-[#C3C6D7]/60" />
              <span>All India Institute of Ayurveda (AIIA) OPD</span>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-6">
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#006A61] font-semibold">
                Ministry of Ayush • SIH26047
              </span>
              <div className="flex items-center gap-1.5 text-[#16A34A] font-semibold text-[11px] uppercase tracking-wider">
                <BadgeCheck size={14} />
                <span>Physician Verified</span>
              </div>
            </div>

            <div className="text-[12px] text-[#A1A1AA]">
              © 2026 VAIDYA Clinical Intelligence
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
