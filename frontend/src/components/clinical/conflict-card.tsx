'use client'
import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { ClinicalConflict } from '@/types'
import { Button } from '@/components/ui'
import { ProvenanceChip } from './provenance-chip'

interface ConflictCardProps {
  conflict: ClinicalConflict
  onResolve: (resolution: 'RESOLVED_A' | 'RESOLVED_B' | 'RESOLVED_UNCERTAIN', note?: string) => Promise<void>
}

export function ConflictCard({ conflict, onResolve }: ConflictCardProps) {
  const [note, setNote] = useState('')
  const [resolving, setResolving] = useState(false)
  const [resolved, setResolved] = useState(false)

  const handleResolve = async (resolution: 'RESOLVED_A' | 'RESOLVED_B' | 'RESOLVED_UNCERTAIN') => {
    setResolving(true)
    await onResolve(resolution, note)
    setResolved(true)
    setResolving(false)
  }

  if (resolved) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-[var(--color-verified-subtle)] border border-[var(--color-verified)]/30">
        <span className="text-[14px] text-[var(--color-verified-text)]">✓ Conflict resolved</span>
      </div>
    )
  }

  return (
    <div className="border border-[var(--color-warning)]/35 border-l-4 border-l-[var(--color-warning)] rounded-lg bg-[var(--color-warning-subtle)] p-5">
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle size={16} className="text-[var(--color-warning)]" />
        <span className="text-[14px] font-semibold text-[var(--color-warning-text)]">Conflicting Information</span>
        <span className="ml-auto font-mono text-[11px] text-[var(--color-text-muted)] uppercase tracking-wide">{conflict.fieldLabel}</span>
      </div>
      <p className="text-[13px] text-[var(--color-text-secondary)] mb-4">
        Two different values have been recorded. Review both sources and accept one.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Source A */}
        <div className="bg-white rounded-lg p-3 border border-[var(--color-border)]">
          <p className="text-[11px] uppercase tracking-wide text-[var(--color-text-muted)] mb-1">Source A — Document</p>
          <p className="text-[18px] font-semibold text-[var(--color-text-primary)] mb-2">{conflict.factA.rawValue}</p>
          <ProvenanceChip tier={conflict.factA.confidenceTier} sourceType={conflict.factA.sourceType} confidence={conflict.factA.ocrConfidence} />
          <Button variant="secondary" size="sm" className="w-full mt-3" isLoading={resolving} onClick={() => handleResolve('RESOLVED_A')}>
            Accept this
          </Button>
        </div>
        {/* Source B */}
        <div className="bg-white rounded-lg p-3 border border-[var(--color-border)]">
          <p className="text-[11px] uppercase tracking-wide text-[var(--color-text-muted)] mb-1">Source B — Interview</p>
          <p className="text-[18px] font-semibold text-[var(--color-text-primary)] mb-2">{conflict.factB.rawValue}</p>
          <ProvenanceChip tier={conflict.factB.confidenceTier} sourceType={conflict.factB.sourceType} />
          <Button variant="secondary" size="sm" className="w-full mt-3" isLoading={resolving} onClick={() => handleResolve('RESOLVED_B')}>
            Accept this
          </Button>
        </div>
      </div>
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Add a note (optional)..."
        className="w-full h-16 text-[13px] px-3 py-2 rounded border border-[var(--color-border)] bg-white resize-none mb-3 focus:outline-none focus:border-[var(--color-border-focus)]"
      />
      <button
        className="text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] underline"
        onClick={() => handleResolve('RESOLVED_UNCERTAIN')}
      >
        Mark as uncertain — requires physician examination
      </button>
    </div>
  )
}
