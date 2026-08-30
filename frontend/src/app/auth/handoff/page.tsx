'use client'
import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
import { VaidyaWordmark } from '@/components/ui'

function HandoffContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role') ?? 'doctor'

  useEffect(() => {
    const timer = setTimeout(() => {
      if (role === 'doctor') {
        router.push('/doctor/queue')
      } else if (role === 'nursing') {
        router.push('/nursing/dashboard')
      } else if (role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/patient/welcome')
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [role, router])

  const messages: Record<string, string> = {
    doctor: 'Preparing your clinical workspace.',
    nursing: 'Preparing triage and patient operations.',
    admin: 'Preparing hospital operations.',
  }

  return (
    <div className="w-full max-w-sm mx-auto my-auto text-center">
      <div className="bg-white border border-[#E4E4E7] rounded-xl p-8 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={26} />
        </div>
        <h1 className="text-[20px] font-semibold text-[#18181B]">
          You&apos;re signed in.
        </h1>
        <p className="text-[14px] text-[#71717A] mt-1 mb-6">
          Opening your workspace…
        </p>

        <div className="flex items-center justify-center gap-2 text-[13px] text-[#2563EB] font-medium bg-[#EFF6FF] py-2 px-3 rounded-lg border border-[#BFDBFE]">
          <svg className="processing-arc h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="40" strokeDashoffset="15" strokeLinecap="round"/>
          </svg>
          <span>{messages[role] ?? 'Preparing workspace...'}</span>
        </div>
      </div>
    </div>
  )
}

export default function AuthHandoffPage() {
  return (
    <div className="min-h-screen bg-[#F6F6F7] flex flex-col justify-between p-4 sm:p-6 lg:p-10 select-none">
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <VaidyaWordmark size="sm" showDescriptor={false} />
      </div>

      <Suspense fallback={
        <div className="w-full max-w-sm mx-auto my-auto text-center p-8 bg-white rounded-xl border border-[#E4E4E7]">
          <p className="text-[14px] text-[#71717A]">Opening workspace...</p>
        </div>
      }>
        <HandoffContent />
      </Suspense>

      <div />
    </div>
  )
}
