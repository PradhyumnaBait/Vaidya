'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  ShieldCheck,
  Smartphone,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Heart,
} from 'lucide-react'
import VaidyaWordmark from '@/components/VaidyaWordmark'
import { useAuthStore, DEMO_USERS } from '@/store'

type AuthMode = 'MOBILE' | 'ABHA'

export default function PatientLoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()

  const [authMode, setAuthMode] = useState<AuthMode>('MOBILE')
  const [mobileNumber, setMobileNumber] = useState('9876543210')
  const [abhaId, setAbhaId] = useState('12-3456-7890-1234')
  const [step, setStep] = useState<'IDENTIFY' | 'OTP'>('IDENTIFY')
  const [otp, setOtp] = useState('482910')
  const [loading, setLoading] = useState(false)

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('OTP')
    }, 600)
  }

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      // Set patient user in auth store
      login(DEMO_USERS.patient)
      router.push('/patient/dashboard')
    }, 700)
  }

  return (
    <div className="min-h-screen bg-[#FAF8FF] flex flex-col justify-between p-4 sm:p-6 lg:p-8 antialiased selection:bg-[#2563EB] selection:text-white">
      {/* ─── Top Header ────────────────────────────────────────── */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#71717A] hover:text-[#18181B] transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Homepage</span>
        </Link>
        <div className="flex items-center gap-2">
          <VaidyaWordmark size="sm" showDescriptor={false} />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#006A61] bg-[#F0FDF4] px-2 py-0.5 rounded border border-[#BBF7D0]">
            Patient Portal
          </span>
        </div>
      </div>

      {/* ─── Main Login Container ────────────────────────────────── */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-white rounded-3xl p-7 sm:p-9 border border-[#E1E2ED] shadow-sm space-y-6">
          {/* Header Title */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#006A61]/10 text-[#006A61] flex items-center justify-center mx-auto mb-3">
              <Heart size={24} className="text-[#006A61]" />
            </div>
            <h1 className="text-[24px] sm:text-[26px] font-bold text-[#18181B] tracking-tight">
              Patient Portal
            </h1>
            <p className="text-[13px] sm:text-[14px] text-[#71717A]">
              Access your previous OPD visits, prescriptions, and scanned clinical records.
            </p>
          </div>

          {step === 'IDENTIFY' ? (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              {/* Method Switcher */}
              <div className="grid grid-cols-2 gap-1 bg-[#FAF8FF] p-1 rounded-2xl border border-[#E1E2ED]">
                <button
                  type="button"
                  onClick={() => setAuthMode('MOBILE')}
                  className={`py-2 text-[12px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'MOBILE'
                      ? 'bg-white text-[#004AC6] shadow-xs'
                      : 'text-[#71717A] hover:text-[#18181B]'
                  }`}
                >
                  <Smartphone size={14} />
                  <span>Mobile OTP</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('ABHA')}
                  className={`py-2 text-[12px] font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'ABHA'
                      ? 'bg-white text-[#004AC6] shadow-xs'
                      : 'text-[#71717A] hover:text-[#18181B]'
                  }`}
                >
                  <CreditCard size={14} />
                  <span>ABHA ID</span>
                </button>
              </div>

              {/* Input Fields */}
              {authMode === 'MOBILE' ? (
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold uppercase tracking-wider text-[#434655]">
                    Registered Mobile Number
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="h-11 px-3.5 rounded-xl border border-[#E1E2ED] bg-[#FAF8FF] text-[14px] font-bold text-[#18181B] flex items-center">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      required
                      className="flex-1 h-11 px-3.5 rounded-xl border border-[#E1E2ED] bg-[#FAF8FF] focus:bg-white focus:border-[#004AC6] focus:outline-none text-[14px] font-medium transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-[#71717A]">
                    Demo account: <span className="font-mono font-semibold text-[#004AC6]">9876543210</span> (Dhananjay Patil)
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold uppercase tracking-wider text-[#434655]">
                    ABHA Number / Address
                  </label>
                  <input
                    type="text"
                    value={abhaId}
                    onChange={(e) => setAbhaId(e.target.value)}
                    placeholder="e.g. 12-3456-7890-1234"
                    required
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E1E2ED] bg-[#FAF8FF] focus:bg-white focus:border-[#004AC6] focus:outline-none text-[14px] font-mono transition-all"
                  />
                  <p className="text-[11px] text-[#71717A]">
                    Demo ABHA: <span className="font-mono font-semibold text-[#004AC6]">12-3456-7890-1234</span>
                  </p>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-2xl bg-[#004AC6] hover:bg-[#003EA8] text-white text-[14px] font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Get Verification Code</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* OTP Verification Screen */
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#E1E2ED] text-center space-y-1">
                <p className="text-[12px] text-[#71717A]">
                  Enter 6-digit OTP sent to
                </p>
                <p className="text-[14px] font-bold text-[#18181B] font-mono">
                  +91 {mobileNumber}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold uppercase tracking-wider text-[#434655] block text-center">
                  One-Time Password (OTP)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                  className="w-full h-12 text-center tracking-[0.5em] font-mono font-extrabold text-[20px] rounded-xl border border-[#004AC6] bg-white focus:outline-none focus:ring-2 focus:ring-[#004AC6]/20 transition-all"
                />
                <p className="text-[11px] text-center text-[#71717A]">
                  Demo OTP code: <span className="font-mono font-bold text-[#004AC6]">482910</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-2xl bg-[#16A34A] hover:bg-[#15803D] text-white text-[14px] font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify &amp; Open My Records</span>
                    <CheckCircle2 size={16} />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('IDENTIFY')}
                className="w-full text-center text-[12px] text-[#71717A] hover:text-[#18181B] font-medium"
              >
                Change mobile number
              </button>
            </form>
          )}

          {/* Privacy Note */}
          <div className="pt-4 border-t border-[#E1E2ED] flex items-center justify-center gap-2 text-[11px] text-[#71717A]">
            <ShieldCheck size={14} className="text-[#16A34A]" />
            <span>ABDM &amp; FHIR R4 Consent Protected</span>
          </div>
        </div>
      </div>

      {/* ─── Footer ────────────────────────────────────────────── */}
      <div className="text-center text-[12px] text-[#71717A]">
        <span>Need clinical staff access? </span>
        <Link href="/auth/login" className="text-[#004AC6] font-bold hover:underline">
          Staff Login →
        </Link>
      </div>
    </div>
  )
}
