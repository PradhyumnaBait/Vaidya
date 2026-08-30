'use client'
import { useRouter } from 'next/navigation'
import { ShieldAlert } from 'lucide-react'
import { AuthCard, AuthButton, VaidyaWordmark } from '@/components/ui'

export default function AccessDeniedPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F6F6F7] flex flex-col justify-between p-4 sm:p-6 lg:p-10 select-none">
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <VaidyaWordmark size="sm" showDescriptor={false} />
      </div>

      <div className="w-full max-w-md mx-auto my-auto py-8">
        <AuthCard className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center mx-auto mb-4 border border-[#FECACA]">
            <ShieldAlert size={24} />
          </div>

          <h1 className="text-[22px] font-semibold text-[#18181B]">
            Access unavailable
          </h1>
          <p className="text-[14px] text-[#71717A] mt-1 mb-6">
            We couldn&apos;t complete your sign-in.
          </p>

          <div className="bg-[#F9F9FA] border border-[#E4E4E7] rounded-lg p-4 text-left text-[13px] text-[#52525B] space-y-2 mb-6">
            <p className="font-medium text-[#18181B]">Possible reasons may include:</p>
            <ul className="list-disc pl-4 space-y-1 text-[#71717A]">
              <li>Your credentials could not be verified.</li>
              <li>Your account may require institutional approval.</li>
              <li>Your session may have expired.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <AuthButton
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => router.push('/auth/login')}
            >
              Try Again
            </AuthButton>
            <AuthButton
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => router.push('/patient/welcome')}
            >
              Return to Vaidya
            </AuthButton>
          </div>
        </AuthCard>
      </div>

      <div />
    </div>
  )
}
