'use client'
import { useEffect } from 'react'
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react'
import { useUIStore } from '@/store'
import { cn } from '@/lib/utils'

const ICONS = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
}

const COLORS = {
  success: 'border-l-[var(--color-verified)]',
  warning: 'border-l-[var(--color-warning)]',
  error:   'border-l-[var(--color-critical)]',
  info:    'border-l-[var(--color-accent)]',
}

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[320px]">
      {toasts.map(toast => (
        <ToastItem key={toast.id} {...toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

function ToastItem({ type, title, body, onDismiss }: { type: 'info' | 'success' | 'warning' | 'error'; title: string; body?: string; onDismiss: () => void }) {
  const Icon = ICONS[type]
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000)
    return () => clearTimeout(t)
  }, [onDismiss])
  return (
    <div className={cn('bg-white border border-[var(--color-border)] border-l-4 rounded-lg px-4 py-3 shadow-md flex gap-3 items-start', COLORS[type])}>
      <Icon size={16} className="mt-0.5 shrink-0" />
      <div className="flex-1">
        <p className="text-[14px] font-medium">{title}</p>
        {body && <p className="text-[13px] text-[var(--color-text-muted)] mt-0.5">{body}</p>}
      </div>
      <button onClick={onDismiss} className="shrink-0"><X size={14} className="text-[var(--color-text-muted)]" /></button>
    </div>
  )
}
