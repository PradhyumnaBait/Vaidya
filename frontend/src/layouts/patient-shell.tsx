'use client'
import { ReactNode } from 'react'
import { useIntakeStore } from '@/store'
import { ProgressHeader } from '@/components/patient'
import { ToastContainer } from '@/components/ui'

export function PatientShell({ children }: { children: ReactNode }) {
  const { progressPercent, estimatedMinutesRemaining } = useIntakeStore()
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] flex flex-col">
      <ProgressHeader percent={progressPercent} minutesRemaining={estimatedMinutesRemaining} />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      <ToastContainer />
    </div>
  )
}
