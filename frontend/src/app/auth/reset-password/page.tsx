'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import {
  AuthCard,
  PasswordInput,
  AuthButton,
  PasswordStrength,
  AlertBanner,
  VaidyaWordmark,
} from '@/components/ui'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [updated, setUpdated] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
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
      setUpdated(true)
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#F6F6F7] flex flex-col justify-between p-4 sm:p-6 lg:p-10 select-none">
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <button
          onClick={() => router.push('/auth/login')}
          className="inline-flex items-center gap-2 text-[13px] text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Sign In</span>
        </button>
        <VaidyaWordmark size="sm" showDescriptor={false} />
      </div>

      <div className="w-full max-w-md mx-auto my-auto py-8">
        <AuthCard>
          {!updated ? (
            <>
              <h1 className="text-[24px] font-semibold text-[#18181B] tracking-tight">
                Set a new password
              </h1>
              <p className="text-[13px] text-[#71717A] mt-1 mb-6">
                Choose a strong password for your Vaidya account.
              </p>

              {error && (
                <div className="mb-4">
                  <AlertBanner type="error" message={error} />
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <PasswordInput
                    label="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <PasswordStrength password={password} />
                </div>

                <PasswordInput
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />

                <p className="text-[12px] text-[#A1A1AA]">
                  Password requirement: At least 8 characters.
                </p>

                <div className="pt-2 space-y-2">
                  <AuthButton
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    className="w-full"
                  >
                    Update Password
                  </AuthButton>
                  <Link
                    href="/auth/login"
                    className="block text-center text-[13px] text-[#71717A] hover:text-[#18181B] py-2"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-[22px] font-semibold text-[#18181B]">
                Password updated
              </h2>
              <p className="text-[14px] text-[#71717A] mt-2 mb-6">
                You can now sign in securely with your new password.
              </p>
              <AuthButton
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => router.push('/auth/login')}
              >
                Continue to Sign In
              </AuthButton>
            </div>
          )}
        </AuthCard>
      </div>

      <div />
    </div>
  )
}
