'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useIntakeStore } from '@/store'
import { ProgressHeader } from '@/components/patient'
import { ToastContainer } from '@/components/ui'

export function PatientShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { progressPercent, estimatedMinutesRemaining } = useIntakeStore()
  const isPortal = pathname?.startsWith('/patient/login') || pathname?.startsWith('/patient/dashboard')

  if (isPortal) {
    return (
      <div className="min-h-screen bg-[#FAF8FF] flex flex-col antialiased">
        <main className="flex-1 flex flex-col">{children}</main>
        <ToastContainer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] flex flex-col">
      <ProgressHeader percent={progressPercent} minutesRemaining={estimatedMinutesRemaining} />
      <main className="flex-1 flex flex-col">{children}</main>
      <ToastContainer />
    </div>
  )
}
