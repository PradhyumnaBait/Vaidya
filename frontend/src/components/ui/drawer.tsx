'use client'
import { useEffect, ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  side?: 'right' | 'left'
  width?: string
}

export function Drawer({ open, onClose, title, children, side = 'right', width = 'w-[420px]' }: DrawerProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} aria-hidden />}
      <div
        className={cn(
          'fixed top-0 bottom-0 z-50 bg-white shadow-drawer flex flex-col transition-transform duration-[250ms] ease-out',
          width,
          side === 'right' ? 'right-0 rounded-l-xl' : 'left-0 rounded-r-xl',
          open ? 'translate-x-0' : side === 'right' ? 'translate-x-full' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-[52px] px-5 border-b border-[var(--color-border)] shrink-0">
          {title && <span className="text-[15px] font-semibold">{title}</span>}
          <button onClick={onClose} className="ml-auto p-1 rounded hover:bg-[var(--color-surface-subtle)]">
            <X size={18} className="text-[var(--color-text-muted)]" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  )
}
