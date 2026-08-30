'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Stethoscope } from 'lucide-react'
import {
  AuthCard,
  AuthInput,
  PasswordInput,
  AuthButton,
  PasswordStrength,
  AlertBanner,
  VaidyaWordmark,
} from '@/components/ui'

export default function RequestDoctorAccessPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [hospital, setHospital] = useState('AIIA New Delhi')
  const [department, setDepartment] = useState('Internal Medicine')
  const [regNumber, setRegNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError('')

    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 700)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F6F6F7] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <AuthCard className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="text-[22px] font-semibold text-[#18181B]">
              Access request submitted
            </h2>
            <p className="text-[14px] text-[#71717A] mt-2 mb-6">
              Your request has been sent for hospital verification. You will receive an email once approved.
            </p>
            <AuthButton
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => router.push('/auth/login/doctor')}
            >
              Return to sign in
            </AuthButton>
          </AuthCard>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7] flex flex-col justify-between p-4 sm:p-6 lg:p-10 select-none">
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <button
          onClick={() => router.push('/auth/login/doctor')}
          className="inline-flex items-center gap-2 text-[13px] text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Sign In</span>
        </button>
        <VaidyaWordmark size="sm" showDescriptor={false} />
      </div>

      <div className="w-full max-w-[460px] mx-auto my-auto py-8">
        <AuthCard>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded bg-[#EFF6FF] text-[#2563EB]">
              <Stethoscope size={20} />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#2563EB] uppercase tracking-wider">
                Doctor Workspace
              </span>
              <p className="text-[12px] text-[#71717A]">Access Registration</p>
            </div>
          </div>

          <h1 className="text-[24px] font-semibold text-[#18181B] tracking-tight">
            Request access
          </h1>
          <p className="text-[13px] text-[#71717A] mt-1 mb-6">
            Enter your professional details to request access to the Vaidya clinical workspace.
          </p>

          {error && (
            <div className="mb-4">
              <AlertBanner type="error" message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Dr. Rajesh Mehta"
              required
            />

            <AuthInput
              label="Professional Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dr.mehta@hospital.gov.in"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AuthInput
                label="Hospital / Institution"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                required
              />
              <AuthInput
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AuthInput
                label="Medical Registration No."
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                placeholder="MCI-12345"
              />
              <AuthInput
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
              />
            </div>

            <div className="space-y-2">
              <PasswordInput
                label="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <PasswordStrength password={password} />
            </div>

            <PasswordInput
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <p className="text-[12px] text-[#A1A1AA] pt-1">
              Your access may require hospital administrative verification.
            </p>

            <AuthButton
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Request Access
            </AuthButton>
          </form>

          <div className="mt-6 text-center text-[13px] text-[#71717A]">
            <span>Already registered? </span>
            <Link
              href="/auth/login/doctor"
              className="font-medium text-[#2563EB] hover:underline"
            >
              Back to Sign In
            </Link>
          </div>
        </AuthCard>
      </div>

      <div />
    </div>
  )
}
