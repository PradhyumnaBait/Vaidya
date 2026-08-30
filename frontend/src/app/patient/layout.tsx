'use client'
import { ReactNode } from 'react'
import { PatientShell } from '@/layouts/patient-shell'

export default function PatientLayout({ children }: { children: ReactNode }) {
  return <PatientShell>{children}</PatientShell>
}
