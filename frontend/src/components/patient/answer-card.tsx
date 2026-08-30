'use client'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnswerCardProps {
  label: string
  sublabel?: string
  selected: boolean
  onClick: () => void
}

export function AnswerCard({ label, sublabel, selected, onClick }: AnswerCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full min-h-[56px] px-4 flex items-center gap-3 rounded-lg border transition-all duration-fast text-left',
        selected
          ? 'border-2 border-[var(--color-accent)] bg-[var(--color-accent-subtle)]'
          : 'border-[1.5px] border-[var(--color-border)] bg-white hover:bg-[var(--color-surface-subtle)]'
      )}
    >
      <div className="flex-1">
        <span className={cn('text-[15px]', selected ? 'text-[var(--color-accent-text)] font-medium' : 'text-[var(--color-text-primary)]')}>
          {label}
        </span>
        {sublabel && <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5">{sublabel}</p>}
      </div>
      {selected && <Check size={18} className="shrink-0 text-[var(--color-accent)]" />}
    </button>
  )
}
