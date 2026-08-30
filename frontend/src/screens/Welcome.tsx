'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Heart,
  Stethoscope,
  FileText,
  Activity,
  CheckCircle2,
  Lock,
  Layers,
  ChevronRight,
  Search,
  AlertTriangle,
  Mic,
  QrCode,
} from 'lucide-react'
import VaidyaWordmark from '@/components/VaidyaWordmark'
import type { Screen } from '@/types'

interface WelcomeProps {
  onNavigate?: (screen: Screen) => void
}

export default function Welcome({ onNavigate }: WelcomeProps) {
  const router = useRouter()
  const [activeStage, setActiveStage] = useState(0)

  const handleLaunchKiosk = () => {
    router.push('/kiosk')
  }

  const handlePatientLogin = () => {
    router.push('/patient/login')
  }

  const handleStaffLogin = () => {
    if (onNavigate) {
      onNavigate('staff-role')
    } else {
      router.push('/auth/login')
    }
  }

  const STAGES = [
    {
      num: '01',
      title: 'Patient Identification',
      icon: QrCode,
      short: 'ABHA QR or Mobile Lookup',
      desc: 'Patients scan their ABHA QR code or enter their mobile number to link past health records instantly.',
    },
    {
      num: '02',
      title: 'Voice & Touch Intake',
      icon: Mic,
      short: '6 Indian Languages',
      desc: 'Patients describe symptoms naturally in Hindi, Marathi, Gujarati, Bengali, Tamil, or English.',
    },
    {
      num: '03',
      title: 'Document Digitization',
      icon: FileText,
      short: 'Optical Camera Scanner',
      desc: 'Previous physical prescriptions, discharge summaries, and lab reports are scanned with sub-second OCR.',
    },
    {
      num: '04',
      title: 'Information Structuring',
      icon: Layers,
      short: 'Domain & Entity Extraction',
      desc: 'Raw speech and text are mapped into 11 clinical domains, extracting dosages, dates, and lifestyle factors.',
    },
    {
      num: '05',
      title: 'AI-Assisted Brief',
      icon: Sparkles,
      short: 'Contradiction Detection',
      desc: 'Synthesizes an organized pre-consultation brief, highlighting allergy discrepancies and red flag alerts.',
    },
    {
      num: '06',
      title: 'Physician Review',
      icon: Stethoscope,
      short: 'Clinician Decision',
      desc: 'The OPD doctor reviews the brief, inspects source evidence crops, and conducts an informed consultation.',
    },
  ]

  return (
    <div className="bg-[#FAF8FF] min-h-screen w-full flex flex-col text-[#191B23] antialiased selection:bg-[#2563EB] selection:text-white">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] bg-[#004AC6]/5 rounded-full blur-[140px]" />
        <div className="absolute top-[35%] left-[-10%] w-[600px] h-[600px] bg-[#006A61]/5 rounded-full blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-[#004AC6]/4 rounded-full blur-[160px]" />
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────────
          1. NAVIGATION HEADER
      ───────────────────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#E1E2ED] shadow-xs">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3">
            <VaidyaWordmark size="md" showDescriptor={false} />
            <div className="h-4 w-px bg-[#E1E2ED] hidden sm:block" />
            <span className="hidden sm:inline-block font-mono text-[11px] tracking-widest text-[#004AC6] font-bold uppercase">
              Clinical Intelligence
            </span>
          </div>

          {/* Nav Anchors */}
          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-semibold text-[#52525B]">
            <a href="#how-it-works" className="hover:text-[#004AC6] transition-colors">
              How It Works
            </a>
            <a href="#for-patients" className="hover:text-[#004AC6] transition-colors">
              For Patients
            </a>
            <a href="#for-clinicians" className="hover:text-[#004AC6] transition-colors">
              For Clinicians
            </a>
            <a href="#abha-ecosystem" className="hover:text-[#004AC6] transition-colors">
              ABHA Ecosystem
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePatientLogin}
              className="px-3.5 py-1.5 rounded-xl text-[13px] font-bold text-[#006A61] hover:bg-[#F0FDF4] transition-all flex items-center gap-1.5"
            >
              <Heart size={15} />
              <span>Patient Login</span>
            </button>

            <button
              onClick={handleStaffLogin}
              className="px-3.5 py-1.5 rounded-xl text-[13px] font-bold text-[#52525B] hover:text-[#004AC6] hover:bg-[#EFF6FF] transition-all flex items-center gap-1.5"
            >
              <ShieldCheck size={16} className="text-[#004AC6]" />
              <span>Clinical Login</span>
            </button>

            <button
              onClick={handleLaunchKiosk}
              className="px-4 py-2 rounded-xl text-[13px] font-bold bg-[#004AC6] text-white hover:bg-[#003EA8] shadow-xs hover:shadow transition-all flex items-center gap-1.5 active:scale-98"
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
        <section className="w-full max-w-7xl mx-auto px-5 md:px-8 pt-10 pb-16 lg:py-20 flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Product Value & CTAs */}
            <div className="lg:col-span-6 flex flex-col justify-center space-y-7">
              {/* Context Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] text-[12px] font-semibold tracking-wide w-fit">
                <span className="w-2 h-2 rounded-full bg-[#004AC6] animate-pulse" />
                <span>Smart India Hackathon • SIH26047</span>
                <span className="text-[#93C5FD]">|</span>
                <span className="text-[#004AC6] font-bold">OPD Pre-Consultation Synthesis</span>
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h1 className="text-[42px] sm:text-[54px] lg:text-[58px] font-bold text-[#18181B] tracking-tight leading-[1.08]">
                  Your clinical story, <br />
                  <span className="text-[#004AC6]">prepared before</span> the consultation.
                </h1>
                <p className="text-[17px] sm:text-[18px] text-[#52525B] max-w-xl leading-relaxed">
                  VAIDYA captures patient history, voice responses and medical documents through a multilingual kiosk — then prepares structured clinical context for physician review.
                </p>
              </div>

              {/* CTA Hierarchy */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleLaunchKiosk}
                  className="px-6 py-3.5 rounded-2xl bg-[#004AC6] hover:bg-[#003EA8] text-white text-[15px] font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-98"
                >
                  <span>Begin Patient Intake</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={handlePatientLogin}
                  className="px-5 py-3.5 rounded-2xl bg-white border border-[#E1E2ED] hover:border-[#006A61] text-[#006A61] text-[15px] font-bold shadow-xs hover:bg-[#F0FDF4] transition-all flex items-center gap-2 active:scale-98"
                >
                  <Heart size={16} />
                  <span>Patient Login</span>
                </button>

                <button
                  onClick={handleStaffLogin}
                  className="px-4 py-3.5 text-[14px] font-bold text-[#52525B] hover:text-[#004AC6] transition-colors flex items-center gap-1"
                >
                  <span>Clinical Login</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-[#E1E2ED] flex flex-wrap items-center gap-6 text-[12px] text-[#71717A]">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={15} className="text-[#16A34A]" />
                  <span>6 Indian Languages</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={15} className="text-[#16A34A]" />
                  <span>ABHA &amp; FHIR R4 Ready</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={15} className="text-[#16A34A]" />
                  <span>Physician Decision Centric</span>
                </div>
              </div>
            </div>

            {/* Right Column: Layered 3D Clinical Intelligence Product Mockup */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto w-full max-w-lg space-y-4">
                {/* Floating 3D Badge 1: Physician Verified */}
                <div className="absolute -top-4 -right-3 z-30 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-[#BBF7D0] shadow-md flex items-center gap-2 text-[11px] font-bold text-[#166534] animate-bounce-subtle">
                  <CheckCircle2 size={14} className="text-[#16A34A]" />
                  <span>PHYSICIAN VERIFIED</span>
                </div>

                {/* Floating 3D Badge 2: ABHA Linked */}
                <div className="absolute -bottom-3 -left-3 z-30 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-[#BFDBFE] shadow-md flex items-center gap-2 text-[11px] font-bold text-[#1E40AF]">
                  <span className="w-2 h-2 rounded-full bg-[#004AC6] animate-pulse" />
                  <span>ABHA LINKED • 12-3456-7890-1234</span>
                </div>

                {/* Top Card: Live Patient Token & Kiosk Intake */}
                <div className="bg-white rounded-3xl p-5 border border-[#E1E2ED] shadow-sm transform hover:-translate-y-1 transition-all duration-300 relative z-20">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E1E2ED]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#004AC6]/10 text-[#004AC6] flex flex-col items-center justify-center font-mono">
                        <span className="text-[8px] font-bold uppercase">OPD</span>
                        <span className="text-[14px] font-extrabold leading-none">A-028</span>
                      </div>
                      <div>
                        <h4 className="text-[15px] font-bold text-[#18181B]">Dhananjay Patil</h4>
                        <p className="text-[11px] text-[#71717A]">67 yrs • Male • Marathi (मराठी)</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0] px-2.5 py-1 rounded-full">
                      ● Kiosk Intake Complete
                    </span>
                  </div>

                  <div className="pt-3 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#71717A]">
                      <span className="flex items-center gap-1 text-[#004AC6] font-semibold">
                        <Mic size={12} />
                        <span>Marathi Voice Intake Transcript</span>
                      </span>
                      <span className="font-mono">10:28 AM</span>
                    </div>
                    <p className="text-[13px] text-[#18181B] italic bg-[#FAF8FF] p-3 rounded-2xl border border-[#E1E2ED]">
                      &quot;३ महिन्यांपासून जेवणानंतर पोटात तीव्र जळजळ आणि दुखणे जाणवते...&quot;
                    </p>
                  </div>
                </div>

                {/* Middle Card: AI-Assisted Clinical Summary Brief */}
                <div className="bg-[#FAF8FF] rounded-3xl p-5 border border-[#004AC6]/30 shadow-md transform hover:-translate-y-1 transition-all duration-300 relative z-10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#004AC6]">
                      <Sparkles size={16} />
                      <span className="text-[12px] font-bold uppercase tracking-wider">
                        AI-ASSISTED CLINICAL SUMMARY
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-[#004AC6] bg-[#EFF6FF] px-2 py-0.5 rounded border border-[#BFDBFE]">
                      Physician Review Required
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[12px]">
                    <div className="bg-white p-2.5 rounded-xl border border-[#E1E2ED]">
                      <span className="text-[10px] font-bold text-[#71717A] uppercase block">Chief Complaint</span>
                      <strong className="text-[#18181B]">Epigastric burning pain</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-[#E1E2ED]">
                      <span className="text-[10px] font-bold text-[#71717A] uppercase block">Duration</span>
                      <strong className="text-[#18181B]">3 months duration</strong>
                    </div>
                  </div>

                  {/* Optical Document Preview & Confidence */}
                  <div className="p-3 bg-white rounded-2xl border border-[#E1E2ED] flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                      <FileText size={15} className="text-[#004AC6]" />
                      <span className="font-semibold text-[#18181B]">Prescription_Jan2025.jpg</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#166534] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
                      94% OCR CONFIDENCE
                    </span>
                  </div>
                </div>

                {/* Bottom Card: Physician Examination & Decision */}
                <div className="bg-white rounded-3xl p-5 border border-[#E1E2ED] shadow-sm transform hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Stethoscope size={16} className="text-[#16A34A]" />
                      <span className="text-[13px] font-bold text-[#18181B]">Physician Verified Consultation</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#16A34A] flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      <span>EHR Sync Ready</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            3. HOW VAIDYA PREPARES THE CONSULTATION (6 STAGES)
        ───────────────────────────────────────────────────────────────────────────── */}
        <section id="how-it-works" className="w-full bg-white py-20 border-y border-[#E1E2ED]">
          <div className="max-w-7xl mx-auto px-5 md:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#004AC6] bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BFDBFE]">
                End-to-End Pipeline
              </span>
              <h2 className="text-[32px] sm:text-[38px] font-bold text-[#18181B] tracking-tight">
                How VAIDYA prepares the consultation
              </h2>
              <p className="text-[15px] text-[#71717A]">
                A 6-stage clinical intelligence workflow connecting waiting hall patients with OPD physicians.
              </p>
            </div>

            {/* Interactive Stages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {STAGES.map((stage, idx) => {
                const Icon = stage.icon
                const isSelected = activeStage === idx
                return (
                  <div
                    key={stage.num}
                    onClick={() => setActiveStage(idx)}
                    className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                      isSelected
                        ? 'bg-[#FAF8FF] border-[#004AC6] ring-2 ring-[#004AC6]/10 shadow-sm'
                        : 'bg-white border-[#E1E2ED] hover:border-[#C3C6D7]'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[13px] font-bold text-[#004AC6]">
                          Stage {stage.num}
                        </span>
                        <div className="w-10 h-10 rounded-xl bg-[#004AC6]/10 text-[#004AC6] flex items-center justify-center">
                          <Icon size={18} />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-[17px] font-bold text-[#18181B]">
                          {stage.title}
                        </h3>
                        <p className="text-[12px] font-semibold text-[#004AC6] mt-0.5">
                          {stage.short}
                        </p>
                      </div>

                      <p className="text-[13px] text-[#52525B] leading-relaxed">
                        {stage.desc}
                      </p>
                    </div>

                    <span className="text-[11px] font-bold text-[#71717A] flex items-center gap-1">
                      <span>Interactive Stage</span>
                      <ChevronRight size={12} />
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            4. PATIENT EXPERIENCE & PORTAL
        ───────────────────────────────────────────────────────────────────────────── */}
        <section id="for-patients" className="w-full py-20 max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#006A61] bg-[#F0FDF4] px-3 py-1 rounded-full border border-[#BBF7D0]">
                For Outpatients
              </span>
              <h2 className="text-[32px] sm:text-[38px] font-bold text-[#18181B] tracking-tight leading-tight">
                Your information stays with <br />
                your clinical record.
              </h2>
              <p className="text-[16px] text-[#52525B] leading-relaxed">
                Review your consultation history, active prescriptions, and digitized medical documents securely from anywhere using your ABHA ID or mobile number.
              </p>

              <div className="space-y-3 text-[14px]">
                <div className="flex items-center gap-3 text-[#18181B]">
                  <CheckCircle2 size={18} className="text-[#16A34A] shrink-0" />
                  <span>Previous hospital visit summaries and active prescriptions</span>
                </div>
                <div className="flex items-center gap-3 text-[#18181B]">
                  <CheckCircle2 size={18} className="text-[#16A34A] shrink-0" />
                  <span>Scanned optical copies of lab investigations and discharge summaries</span>
                </div>
                <div className="flex items-center gap-3 text-[#18181B]">
                  <CheckCircle2 size={18} className="text-[#16A34A] shrink-0" />
                  <span>Consent-controlled access linked to your national ABHA health ID</span>
                </div>
              </div>

              <button
                onClick={handlePatientLogin}
                className="px-6 py-3.5 rounded-2xl bg-[#006A61] hover:bg-[#00524B] text-white text-[14px] font-bold transition-all shadow-xs flex items-center gap-2 active:scale-98"
              >
                <Heart size={16} />
                <span>Open Patient Portal</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Patient Portal Preview Card */}
            <div className="lg:col-span-6 bg-white p-7 rounded-3xl border border-[#E1E2ED] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E1E2ED]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#006A61]/10 text-[#006A61] flex items-center justify-center font-bold text-sm">
                    DP
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-[#18181B]">Dhananjay Patil</h4>
                    <p className="text-[11px] font-mono text-[#71717A]">ABHA: 12-3456-7890-1234</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-[#166534] bg-[#F0FDF4] px-2.5 py-0.5 rounded border border-[#BBF7D0]">
                  ● Live Record
                </span>
              </div>

              <div className="space-y-2.5 text-[13px]">
                <div className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E1E2ED] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#004AC6]">Current OPD Visit</span>
                    <p className="font-bold text-[#18181B]">Token A-028 • Internal Medicine</p>
                  </div>
                  <span className="text-[11px] font-semibold text-[#16A34A]">In Review</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#E1E2ED] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#006A61]">Active Medication</span>
                    <p className="font-bold text-[#18181B]">Tab. Metformin 500mg BID &amp; Amlodipine 5mg</p>
                  </div>
                  <span className="text-[11px] text-[#71717A]">AIIMS Delhi</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            5. CLINICIAN EXPERIENCE
        ───────────────────────────────────────────────────────────────────────────── */}
        <section id="for-clinicians" className="w-full bg-white py-20 border-y border-[#E1E2ED]">
          <div className="max-w-7xl mx-auto px-5 md:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#004AC6] bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BFDBFE]">
                For Physicians &amp; OPD Staff
              </span>
              <h2 className="text-[32px] sm:text-[38px] font-bold text-[#18181B] tracking-tight">
                Structured clinical context before the patient enters
              </h2>
              <p className="text-[15px] text-[#71717A]">
                Empowering hospital physicians with synthesized briefs, optical document provenance, and contradiction detection.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-[#FAF8FF] border border-[#E1E2ED] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#004AC6]/10 text-[#004AC6] flex items-center justify-center">
                  <Activity size={20} />
                </div>
                <h3 className="text-[17px] font-bold text-[#18181B]">Real-Time OPD Queue</h3>
                <p className="text-[13px] text-[#52525B]">
                  Live status indicators, triage priority flags, and waiting time tracking for seamless clinical pacing.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FAF8FF] border border-[#E1E2ED] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#004AC6]/10 text-[#004AC6] flex items-center justify-center">
                  <Search size={20} />
                </div>
                <h3 className="text-[17px] font-bold text-[#18181B]">Optical Evidence Drawer</h3>
                <p className="text-[13px] text-[#52525B]">
                  Click any extracted clinical entity to instantly inspect the exact physical document crop and OCR score.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-[#FAF8FF] border border-[#E1E2ED] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#004AC6]/10 text-[#004AC6] flex items-center justify-center">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-[17px] font-bold text-[#18181B]">Contradiction Detection</h3>
                <p className="text-[13px] text-[#52525B]">
                  Surfaces discrepancies between patient verbal claims and historical prescriptions for physical examination.
                </p>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={handleStaffLogin}
                className="px-6 py-3.5 rounded-2xl bg-[#004AC6] hover:bg-[#003EA8] text-white text-[14px] font-bold transition-all shadow-xs inline-flex items-center gap-2 active:scale-98"
              >
                <Stethoscope size={16} />
                <span>Clinical Login</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            6. MULTILINGUAL & MULTIMODAL INTAKE
        ───────────────────────────────────────────────────────────────────────────── */}
        <section className="w-full py-20 max-w-7xl mx-auto px-5 md:px-8">
          <div className="bg-[#FAF8FF] rounded-3xl p-8 sm:p-12 border border-[#E1E2ED] space-y-8 text-center max-w-4xl mx-auto">
            <div className="space-y-3">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#004AC6] bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BFDBFE]">
                Accessibility
              </span>
              <h2 className="text-[30px] sm:text-[36px] font-bold text-[#18181B] tracking-tight">
                6 Indian Languages • Speech, Touch &amp; Scans
              </h2>
              <p className="text-[15px] text-[#71717A] max-w-2xl mx-auto">
                Designed for inclusive outpatient engagement across regional demographics.
              </p>
            </div>

            {/* Language Badges */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { code: 'hi', name: 'हिन्दी', label: 'Hindi' },
                { code: 'en', name: 'English', label: 'English' },
                { code: 'mr', name: 'मराठी', label: 'Marathi' },
                { code: 'gu', name: 'ગુજરાતી', label: 'Gujarati' },
                { code: 'bn', name: 'বাংলা', label: 'Bengali' },
                { code: 'ta', name: 'தமிழ்', label: 'Tamil' },
              ].map((lang) => (
                <div
                  key={lang.code}
                  className="bg-white px-4 py-2 rounded-2xl border border-[#E1E2ED] shadow-xs flex items-center gap-2"
                >
                  <span className="text-[14px] font-bold text-[#18181B]">{lang.name}</span>
                  <span className="text-[11px] font-mono text-[#71717A]">({lang.label})</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            7. CLINICAL SAFETY & ABHA ECOSYSTEM
        ───────────────────────────────────────────────────────────────────────────── */}
        <section id="abha-ecosystem" className="w-full bg-white py-20 border-t border-[#E1E2ED]">
          <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[12px] font-bold uppercase tracking-wider text-[#166534] bg-[#F0FDF4] px-3 py-1 rounded-full border border-[#BBF7D0]">
                Safety Principles
              </span>
              <h2 className="text-[32px] sm:text-[38px] font-bold text-[#18181B] tracking-tight leading-tight">
                AI assists. <br />
                Physicians decide.
              </h2>
              <p className="text-[15px] text-[#52525B] leading-relaxed">
                VAIDYA never generates autonomous clinical diagnoses. It structures raw symptoms, cross-checks previous prescription records, and provides transparent provenance so physicians make fully informed treatment decisions.
              </p>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-[#E1E2ED] bg-[#FAF8FF] space-y-2">
                <Lock size={18} className="text-[#004AC6]" />
                <h4 className="font-bold text-[#18181B] text-[15px]">ABDM &amp; ABHA Ready</h4>
                <p className="text-[12px] text-[#71717A]">
                  Built on India&apos;s Ayushman Bharat Digital Mission standards with explicit consent verification.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-[#E1E2ED] bg-[#FAF8FF] space-y-2">
                <FileText size={18} className="text-[#006A61]" />
                <h4 className="font-bold text-[#18181B] text-[15px]">FHIR R4 Bundle Export</h4>
                <p className="text-[12px] text-[#71717A]">
                  Standardized JSON exports ready for integration with existing Hospital Information Systems (HIS).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────────────────────
            8. FOOTER
        ───────────────────────────────────────────────────────────────────────────── */}
        <footer className="w-full bg-[#FAF8FF] border-t border-[#E1E2ED] py-12">
          <div className="max-w-7xl mx-auto px-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[13px] text-[#71717A]">
            <div className="flex items-center gap-3">
              <VaidyaWordmark size="sm" showDescriptor={false} />
              <div className="h-4 w-px bg-[#E1E2ED]" />
              <span>Smart India Hackathon • SIH26047</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 font-semibold">
              <button onClick={handlePatientLogin} className="hover:text-[#004AC6]">
                Patient Login
              </button>
              <button onClick={handleStaffLogin} className="hover:text-[#004AC6]">
                Clinical Login
              </button>
              <button onClick={handleLaunchKiosk} className="hover:text-[#004AC6]">
                Launch Kiosk
              </button>
              <a href="#how-it-works" className="hover:text-[#004AC6]">
                How It Works
              </a>
            </div>

            <p className="text-[12px] text-[#A1A1AA]">
              © 2026 VAIDYA Clinical Intelligence. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
