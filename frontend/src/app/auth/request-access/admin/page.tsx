'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Building2 } from 'lucide-react'
import {
  AuthCard,
  AuthInput,
  PasswordInput,
  AuthButton,
  PasswordStrength,
  AlertBanner,
  VaidyaWordmark,
} from '@/components/ui'

export default function RequestAdminAccessPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [hospital, setHospital] = useState('AIIA New Delhi')
  const [role, setRole] = useState('IT Operations Lead')
  const [employeeId, setEmployeeId] = useState('')
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
            <div className="w-12 h-12 rounded-full bg-[#F0FDFA] text-[#0D9488] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="text-[22px] font-semibold text-[#18181B]">
              Request submitted
            </h2>
            <p className="text-[14px] text-[#71717A] mt-2 mb-6">
              Your administrator access request has been sent for institutional verification.
            </p>
            <AuthButton
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => router.push('/auth/login/admin')}
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
          onClick={() => router.push('/auth/login/admin')}
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
            <div className="p-2 rounded bg-[#F0FDFA] text-[#0D9488]">
              <Building2 size={20} />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#0D9488] uppercase tracking-wider">
                Hospital Operations
              </span>
              <p className="text-[12px] text-[#71717A]">Admin Registration</p>
            </div>
          </div>

          <h1 className="text-[24px] font-semibold text-[#18181B] tracking-tight">
            Request administrator access
          </h1>
          <p className="text-[13px] text-[#71717A] mt-1 mb-6">
            Enter your professional and institutional details.
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
              placeholder="A. Singh"
              required
            />

            <AuthInput
              label="Work Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hospital.gov.in"
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
                label="Role / Designation"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AuthInput
                label="Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="EMP-882"
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
              Administrative access requires institutional verification.
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
              href="/auth/login/admin"
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
