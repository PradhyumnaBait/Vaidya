import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center text-center py-16 px-6', className)}>
      {Icon && <Icon size={32} className="text-[var(--color-text-muted)] mb-3" strokeWidth={1.5} />}
      <p className="text-[15px] font-medium text-[var(--color-text-primary)] mb-1">{title}</p>
      {description && <p className="text-[13px] text-[var(--color-text-muted)] max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
