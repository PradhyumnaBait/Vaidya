'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MailCheck } from 'lucide-react'
import {
  AuthCard,
  AuthInput,
  AuthButton,
  VaidyaWordmark,
} from '@/components/ui'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
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
          {!submitted ? (
            <>
              <h1 className="text-[24px] font-semibold text-[#18181B] tracking-tight">
                Account recovery
              </h1>
              <p className="text-[13px] text-[#71717A] mt-1 mb-6">
                Enter your registered work email or staff ID and we&apos;ll help you regain access.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AuthInput
                  label="Work Email or Staff ID"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. dr.mehta@aiia.gov.in"
                  required
                />

                <AuthButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="w-full mt-2"
                >
                  Continue
                </AuthButton>
              </form>

              <div className="mt-6 text-center text-[13px]">
                <Link
                  href="/auth/login"
                  className="font-medium text-[#71717A] hover:text-[#18181B] underline"
                >
                  Return to sign in
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-4">
                <MailCheck size={24} />
              </div>
              <h2 className="text-[22px] font-semibold text-[#18181B]">
                Check your email
              </h2>
              <p className="text-[14px] text-[#71717A] mt-2 mb-6">
                If the account exists, recovery instructions have been sent to your registered contact.
              </p>
              <AuthButton
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => router.push('/auth/login')}
              >
                Return to sign in
              </AuthButton>
            </div>
          )}
        </AuthCard>
      </div>

      <div />
    </div>
  )
}
