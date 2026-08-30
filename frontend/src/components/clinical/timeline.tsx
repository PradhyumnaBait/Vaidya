'use client'
import { TimelineEvent, SourceType } from '@/types'
import { formatIndianDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface TimelineProps {
  events: TimelineEvent[]
  onEventClick?: (event: TimelineEvent) => void
}

const NODE_COLORS: Record<SourceType | 'conflict', string> = {
  DOCUMENT_EXTRACT: 'border-[var(--color-accent)] bg-white',
  INTERVIEW: 'border-[var(--color-text-muted)] bg-white',
  PHYSICIAN_ENTERED: 'border-[var(--color-verified)] bg-white',
  conflict: 'border-[var(--color-warning)] bg-[var(--color-warning)]',
}

export function Timeline({ events, onEventClick }: TimelineProps) {
  const sorted = [...events].sort((a, b) => {
    if (!a.eventDate) return 1
    if (!b.eventDate) return -1
    return new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
  })

  return (
    <div className="relative pl-6">
      <div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--color-border)]" />
      <div className="space-y-4">
        {sorted.map((event, i) => (
          <div key={event.id} className="stagger-in relative" style={{ animationDelay: `${i * 60}ms` }}>
            <div className={cn(
              'absolute -left-[25px] top-3 w-2 h-2 rounded-full border-[1.5px]',
              event.isConflict ? NODE_COLORS.conflict : NODE_COLORS[event.sourceType]
            )} />
            <div
              className={cn(
                'ml-4 bg-white border border-[var(--color-border)] rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow',
                event.isConflict && 'border-l-2 border-l-[var(--color-warning)]'
              )}
              onClick={() => onEventClick?.(event)}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[14px] font-medium text-[var(--color-text-primary)]">{event.title}</p>
                <span className="font-mono text-[12px] text-[var(--color-text-muted)] shrink-0">
                  {event.datePrecision === 'EXACT' ? '' : '~'}{event.eventDate ? formatIndianDate(event.eventDate) : 'Unknown date'}
                </span>
              </div>
              {event.detail && <p className="text-[13px] text-[var(--color-text-secondary)] mt-1">{event.detail}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
