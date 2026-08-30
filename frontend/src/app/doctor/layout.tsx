'use client'
import { ReactNode } from 'react'
import { ClinicalShell } from '@/layouts/clinical-shell'

export default function DoctorLayout({ children }: { children: ReactNode }) {
  return <ClinicalShell>{children}</ClinicalShell>
}
