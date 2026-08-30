'use client'
import { useRouter } from 'next/navigation'
import { useAuthStore, DEMO_USERS } from '@/store'
import type { Role } from '@/types'

const ROLES: Array<{ role: Role; label: string; description: string; href: string }> = [
  { role: 'patient', label: 'Patient', description: 'Begin your health intake', href: '/patient/welcome' },
  { role: 'doctor', label: 'Physician', description: 'Review your patient queue', href: '/doctor/queue' },
  { role: 'nursing', label: 'Triage Nurse', description: 'Monitor alerts and queue', href: '/nursing/dashboard' },
  { role: 'admin', label: 'Administrator', description: 'System analytics and config', href: '/admin' },
]

export default function HomePage() {
  const { login } = useAuthStore()
  const router = useRouter()

  const handleSelect = (role: Role, href: string) => {
    login(DEMO_USERS[role])
    router.push(href)
  }

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-[32px] font-semibold text-[var(--color-text-primary)] tracking-tight">Vaidya</h1>
          <p className="text-[14px] text-[var(--color-text-muted)] mt-1">All India Institute of Ayurveda · OPD</p>
          <p className="text-[12px] text-[var(--color-text-muted)] mt-3 font-mono bg-[var(--color-warning-subtle)] text-[var(--color-warning-text)] px-3 py-1 rounded inline-block">
            Demo Mode — Select a role to continue
          </p>
        </div>
        <div className="space-y-3">
          {ROLES.map(({ role, label, description, href }) => (
            <button
              key={role}
              onClick={() => handleSelect(role, href)}
              className="w-full text-left px-5 py-4 bg-white border border-[var(--color-border)] rounded-lg hover:border-[var(--color-border-strong)] hover:shadow-sm transition-all duration-fast"
            >
              <p className="text-[15px] font-medium text-[var(--color-text-primary)]">{label}</p>
              <p className="text-[13px] text-[var(--color-text-muted)] mt-0.5">{description}</p>
            </button>
          ))}
        </div>
        <p className="text-center text-[12px] text-[var(--color-text-muted)] mt-6">SIH26047 · Ministry of Ayush</p>
      </div>
    </div>
  )
}
