'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Stethoscope } from 'lucide-react'
import {
  AuthCard,
  AuthInput,
  PasswordInput,
  Checkbox,
  AuthButton,
  Divider,
  AlertBanner,
  VaidyaWordmark,
} from '@/components/ui'
import { useAuthStore, DEMO_USERS } from '@/store'

export default function DoctorLoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()

  const [email, setEmail] = useState('dr.mehta@aiia.gov.in')
  const [password, setPassword] = useState('password123')
  const [remember, setRemember] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in both email/staff ID and password.')
      return
    }

    setLoading(true)
    setError('')

    setTimeout(() => {
      login(DEMO_USERS.doctor)
      router.push('/auth/handoff?role=doctor')
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7] flex flex-col justify-between p-4 sm:p-6 lg:p-10 select-none">
      {/* Top Header */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <button
          onClick={() => router.push('/auth/login')}
          className="inline-flex items-center gap-2 text-[13px] text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Change Role</span>
        </button>
        <VaidyaWordmark size="sm" showDescriptor={false} />
      </div>

      {/* Main Login Form Container */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <AuthCard>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded bg-[#EFF6FF] text-[#2563EB]">
              <Stethoscope size={20} />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#2563EB] uppercase tracking-wider">
                Doctor Workspace
              </span>
              <p className="text-[12px] text-[#71717A]">Clinical Intelligence</p>
            </div>
          </div>

          <h1 className="text-[24px] font-semibold text-[#18181B] tracking-tight">
            Welcome back
          </h1>
          <p className="text-[13px] text-[#71717A] mt-1 mb-6">
            Sign in to continue to your clinical workspace.
          </p>

          {error && (
            <div className="mb-4">
              <AlertBanner type="error" message={error} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              label="Work Email or Staff ID"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. dr.mehta@aiia.gov.in"
              required
            />

            <PasswordInput
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-between pt-1">
              <Checkbox
                label="Remember this device"
                checked={remember}
                onChange={setRemember}
              />
              <Link
                href="/auth/forgot-password"
                className="text-[13px] font-medium text-[#2563EB] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <AuthButton
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              Sign In
            </AuthButton>
          </form>

          <div className="my-6">
            <Divider label="OR" />
          </div>

          <div className="text-center text-[13px] text-[#71717A]">
            <span>New to Vaidya? </span>
            <Link
              href="/auth/request-access/doctor"
              className="font-medium text-[#2563EB] hover:underline"
            >
              Request access
            </Link>
          </div>
        </AuthCard>

        <p className="text-center text-[12px] text-[#A1A1AA] mt-4">
          For authorized hospital staff only • AIIA OPD System
        </p>
      </div>

      <div />
    </div>
  )
}
