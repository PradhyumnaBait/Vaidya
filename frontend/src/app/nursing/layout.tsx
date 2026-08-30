'use client'
import { ReactNode } from 'react'
import { ClinicalShell } from '@/layouts/clinical-shell'

export default function NursingLayout({ children }: { children: ReactNode }) {
  return <ClinicalShell>{children}</ClinicalShell>
}
