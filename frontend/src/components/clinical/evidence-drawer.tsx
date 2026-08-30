'use client'
import { useEffect, useState } from 'react'
import { useUIStore } from '@/store'
import { physicianService } from '@/services'
import { ClinicalFact } from '@/types'
import { Drawer } from '@/components/ui'
import { ProvenanceChip } from './provenance-chip'
import { SkeletonRow } from '@/components/ui/skeleton'

export function EvidenceDrawer() {
  const { evidenceDrawerOpen, evidenceFactId, closeEvidenceDrawer } = useUIStore()
  const [fact, setFact] = useState<ClinicalFact | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (evidenceFactId && evidenceDrawerOpen) {
      setLoading(true)
      // In real implementation: fetch specific fact by ID
      // For mock: find from demo data
      import('@/constants/demo-data').then(({ DEMO_FACTS_ENC001 }) => {
        const found = DEMO_FACTS_ENC001.find(f => f.id === evidenceFactId)
        setFact(found ?? null)
        setLoading(false)
      })
    }
  }, [evidenceFactId, evidenceDrawerOpen])

  return (
    <Drawer open={evidenceDrawerOpen} onClose={closeEvidenceDrawer} title="Source Evidence">
      <div className="p-5 space-y-5">
        {loading && <><SkeletonRow /><SkeletonRow /></>}
        {!loading && fact && (
          <>
            {/* The Fact */}
            <div className="bg-[var(--color-surface-subtle)] rounded-lg p-4 border border-[var(--color-border)]">
              <p className="text-[11px] uppercase tracking-wide text-[var(--color-text-muted)] mb-1">Extracted Fact</p>
              <p className="text-[12px] text-[var(--color-text-muted)]">{fact.fieldName.replace(/_/g, ' ')}</p>
              <p className="text-[32px] font-semibold font-mono text-[var(--color-text-primary)] leading-tight">
                {fact.rawValue}
                {fact.valueUnit && <span className="text-[18px] font-normal text-[var(--color-text-secondary)] ml-1">{fact.valueUnit}</span>}
              </p>
            </div>

            {/* Source Info */}
            <div>
              <p className="text-[11px] uppercase tracking-wide text-[var(--color-text-muted)] mb-2">Source</p>
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <p className="text-[14px] font-medium">
                    {fact.sourceType === 'DOCUMENT_EXTRACT' ? `Document · Page ${fact.sourcePage ?? 1}` : 'Patient interview'}
                  </p>
                  {fact.sourceDocumentId && <p className="text-[12px] text-[var(--color-text-muted)] font-mono">{fact.sourceDocumentId}</p>}
                </div>
                <ProvenanceChip tier={fact.confidenceTier} sourceType={fact.sourceType} confidence={fact.ocrConfidence ?? fact.confidence} />
              </div>
            </div>

            {/* Source Text */}
            {fact.sourceText && (
              <div>
                <p className="text-[11px] uppercase tracking-wide text-[var(--color-text-muted)] mb-2">Extracted text</p>
                <div className="bg-[var(--color-surface-subtle)] border border-[var(--color-border)] rounded p-3 font-mono text-[13px] text-[var(--color-text-primary)]">
                  {fact.sourceText}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-[var(--color-border)] space-y-2">
              <button className="w-full h-9 text-[14px] font-medium bg-[var(--color-accent)] text-white rounded hover:bg-[var(--color-accent-hover)] transition-colors">
                Mark as verified
              </button>
              <button className="w-full h-9 text-[14px] text-[var(--color-text-secondary)] border border-[var(--color-border-strong)] rounded hover:bg-[var(--color-surface-subtle)] transition-colors">
                Edit this fact
              </button>
            </div>
          </>
        )}
        {!loading && !fact && (
          <p className="text-[14px] text-[var(--color-text-muted)] text-center py-8">Source not found</p>
        )}
      </div>
    </Drawer>
  )
}
