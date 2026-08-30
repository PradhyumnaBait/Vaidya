import { CompletenessEntry, DomainStatus } from '@/types'
import { CheckCircle2, MinusCircle, Circle, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CompletenessGridProps {
  entries: CompletenessEntry[]
}

const STATUS_CONFIG: Record<DomainStatus, { icon: typeof CheckCircle2; color: string; label: string }> = {
  COLLECTED:      { icon: CheckCircle2, color: 'text-[var(--color-verified)]',    label: 'Collected' },
  PARTIAL:        { icon: MinusCircle,  color: 'text-[var(--color-warning)]',     label: 'Partial' },
  NOT_COLLECTED:  { icon: Circle,       color: 'text-[var(--color-text-muted)]',  label: '—' },
  CONFLICT:       { icon: AlertTriangle,color: 'text-[var(--color-warning)]',     label: 'Conflict — resolve' },
  NOT_APPLICABLE: { icon: Circle,       color: 'text-[var(--color-text-muted)]',  label: 'N/A' },
}

export function CompletenessGrid({ entries }: CompletenessGridProps) {
  const collected = entries.filter(e => e.status === 'COLLECTED').length
  const total = entries.filter(e => e.status !== 'NOT_APPLICABLE').length

  return (
    <div>
      <p className="text-[13px] text-[var(--color-text-muted)] mb-3">
        {collected} of {total} domains have data
      </p>
      <div className="border border-[var(--color-border)] rounded-lg overflow-hidden">
        {entries.map((entry, i) => {
          const config = STATUS_CONFIG[entry.status]
          const Icon = config.icon
          return (
            <div
              key={entry.domain}
              className={cn(
                'flex items-center justify-between px-4 min-h-[36px] text-[13px]',
                i % 2 === 0 ? 'bg-white' : 'bg-[var(--color-surface-subtle)]',
                i < entries.length - 1 && 'border-b border-[var(--color-border)]'
              )}
            >
              <span className="text-[var(--color-text-primary)]">{entry.label}</span>
              <span className={cn('flex items-center gap-1', config.color)}>
                <Icon size={14} />
                {config.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
