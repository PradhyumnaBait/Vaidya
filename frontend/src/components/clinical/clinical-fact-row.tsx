'use client'
import { ClinicalFact } from '@/types'
import { ProvenanceChip } from './provenance-chip'
import { useUIStore } from '@/store'
import { cn } from '@/lib/utils'

interface ClinicalFactRowProps {
  label: string
  fact: ClinicalFact
  className?: string
}

export function ClinicalFactRow({ label, fact, className }: ClinicalFactRowProps) {
  const openEvidenceDrawer = useUIStore(s => s.openEvidenceDrawer)

  const handleClick = () => openEvidenceDrawer(fact.id)

  return (
    <div
      className={cn(
        'flex items-center min-h-[36px] px-4 border-b border-[var(--color-border)] cursor-pointer hover:bg-[var(--color-surface-subtle)] transition-colors group',
        fact.conflictStatus === 'IN_CONFLICT' && 'border-l-2 border-l-[var(--color-warning)]',
        fact.verificationStatus === 'PHYSICIAN_VERIFIED' && 'border-l-2 border-l-[var(--color-verified)]',
        className
      )}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <span className="w-[140px] shrink-0 text-[12px] font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
        {label}
      </span>
      <span className="flex-1 text-[14px] text-[var(--color-text-primary)] mr-2">
        {fact.rawValue}
        {fact.valueUnit && <span className="text-[13px] text-[var(--color-text-secondary)] ml-1">{fact.valueUnit}</span>}
      </span>
      <ProvenanceChip tier={fact.confidenceTier} sourceType={fact.sourceType} confidence={fact.ocrConfidence ?? fact.confidence} />
    </div>
  )
}
