'use client'
import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Users, AlertTriangle, FolderOpen, LogOut, Menu, X } from 'lucide-react'
import { useAuthStore } from '@/store'
import { ToastContainer } from '@/components/ui'
import { EvidenceDrawer } from '@/components/clinical'
import { cn } from '@/lib/utils'

interface NavItem { href: string; label: string; icon: typeof Users; badge?: number }

const DOCTOR_NAV: NavItem[] = [
  { href: '/doctor/queue', label: 'Patient Queue', icon: Users },
]

const NURSING_NAV: NavItem[] = [
  { href: '/nursing/dashboard', label: 'Patient Queue', icon: Users },
  { href: '/nursing/dashboard', label: 'Triage Alerts', icon: AlertTriangle, badge: 2 },
  { href: '/nursing/history', label: 'Resolved Alerts', icon: FolderOpen },
]

export function ClinicalShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuthStore()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = user?.role === 'doctor' ? DOCTOR_NAV : NURSING_NAV

  return (
    <div className="h-screen flex bg-[var(--color-canvas)] overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        'bg-white border-r border-[var(--color-border)] flex flex-col transition-all duration-base z-30',
        'fixed inset-y-0 left-0 md:relative md:translate-x-0',
        'w-[240px]',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}>
        <div className="px-5 py-5 border-b border-[var(--color-border)]">
          <p className="text-[18px] font-semibold text-[var(--color-text-primary)]">Vaidya</p>
          <p className="text-[11px] text-[var(--color-text-muted)]">Clinical Intelligence</p>
          {user?.department && (
            <span className="mt-2 inline-block text-[11px] bg-[var(--color-surface-subtle)] px-2 py-0.5 rounded border border-[var(--color-border)] text-[var(--color-text-muted)]">
              {user.department}
            </span>
          )}
        </div>
        <nav className="flex-1 py-3">
          {navItems.map(item => {
            const Icon = item.icon
            const active = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 mx-2 px-3 h-9 rounded text-[14px] transition-colors duration-fast',
                  active ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-medium' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]'
                )}
              >
                <Icon size={16} strokeWidth={1.5} />
                {item.label}
                {item.badge && (
                  <span className="ml-auto bg-[var(--color-critical)] text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
        <div className="px-5 py-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[var(--color-surface-subtle)] flex items-center justify-center text-[13px] font-medium">
              {user?.name?.slice(0, 2) ?? 'DR'}
            </div>
            <div>
              <p className="text-[13px] font-medium">{user?.name}</p>
              <p className="text-[11px] text-[var(--color-text-muted)] capitalize">{user?.role}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-[52px] bg-white border-b border-[var(--color-border)] flex items-center px-4 gap-3 shrink-0">
          <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1" />
          <span className="font-mono text-[12px] text-[var(--color-text-muted)]">
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </header>
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
      <EvidenceDrawer />
      <ToastContainer />
    </div>
  )
}
