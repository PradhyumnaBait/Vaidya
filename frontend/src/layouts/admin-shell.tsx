'use client'
import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart2, FileText, Activity, ScrollText, GitBranch, Users, Home, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store'
import { ToastContainer } from '@/components/ui'
import { cn } from '@/lib/utils'

const ADMIN_NAV = [
  { href: '/admin', label: 'Overview', icon: Home, exact: true },
  { href: '/admin/analytics/intake', label: 'Intake Analytics', icon: BarChart2 },
  { href: '/admin/analytics/documents', label: 'Document Analytics', icon: FileText },
  { href: '/admin/integrations', label: 'Integration Health', icon: Activity },
  { href: '/admin/audit', label: 'Audit Log', icon: ScrollText },
  { href: '/admin/config/pathways', label: 'Clinical Pathways', icon: GitBranch },
  { href: '/admin/users', label: 'Users & Roles', icon: Users },
]

export function AdminShell({ children }: { children: ReactNode }) {
  const { logout } = useAuthStore()
  const pathname = usePathname()

  return (
    <div className="h-screen flex bg-[var(--color-canvas)] overflow-hidden">
      <aside className="w-[240px] bg-white border-r border-[var(--color-border)] flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-[var(--color-border)]">
          <p className="text-[18px] font-semibold">Vaidya</p>
          <p className="text-[11px] text-[var(--color-text-muted)]">Administration</p>
        </div>
        <nav className="flex-1 py-3">
          {ADMIN_NAV.map(item => {
            const Icon = item.icon
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 mx-2 px-3 h-9 rounded text-[14px] transition-colors duration-fast',
                  active ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-medium' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]'
                )}
              >
                <Icon size={16} strokeWidth={1.5} /> {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="px-5 py-4 border-t border-[var(--color-border)]">
          <button onClick={logout} className="flex items-center gap-2 text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[52px] bg-white border-b border-[var(--color-border)] flex items-center px-6">
          <span className="font-mono text-[12px] text-[var(--color-text-muted)] ml-auto">
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </header>
        <main className="flex-1 overflow-y-auto p-0 bg-[#FAF8FF]">{children}</main>
      </div>
      <ToastContainer />
    </div>
  )
}
