'use client'
import { ReactNode } from 'react'
import { AdminShell } from '@/layouts/admin-shell'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
