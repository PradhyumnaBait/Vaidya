import { MedicalDocument } from '@/types'
import { CheckCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DocumentStatusCardProps {
  document: MedicalDocument
  onRemove?: (id: string) => void
}

export function DocumentStatusCard({ document: doc, onRemove }: DocumentStatusCardProps) {
  const typeLabels = {
    PRESCRIPTION: 'Prescription', LAB_REPORT: 'Lab Report',
    DISCHARGE_SUMMARY: 'Discharge Summary', IMAGING: 'Imaging', OTHER: 'Document'
  }

  return (
    <div className={cn(
      'flex items-center gap-3 px-4 min-h-[60px] rounded-lg border bg-white',
      doc.qualityScore < 0.75 && doc.status !== 'PROCESSING' ? 'border-l-2 border-l-[var(--color-warning)] border-[var(--color-border)]' : 'border-[var(--color-border)]'
    )}>
      <div className="w-8 h-8 rounded-full bg-[var(--color-accent-subtle)] flex items-center justify-center shrink-0">
        <span className="text-[11px] font-semibold text-[var(--color-accent-text)]">{typeLabels[doc.documentType].slice(0, 2)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-medium truncate">{doc.originalFilename}</p>
        <p className="text-[12px] text-[var(--color-text-muted)]">{typeLabels[doc.documentType]}</p>
      </div>
      <div className="shrink-0 text-right">
        {doc.status === 'PROCESSING' && (
          <div className="flex items-center gap-1">
            <svg className="processing-arc w-4 h-4 text-[var(--color-accent)]" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="40" strokeDashoffset="15" strokeLinecap="round"/>
            </svg>
            <span className="text-[12px] text-[var(--color-text-muted)]">Analyzing...</span>
          </div>
        )}
        {doc.status === 'PROCESSED' && (
          <div className="flex items-center gap-1">
            <CheckCircle size={16} className="text-[var(--color-verified)]" />
            <span className="text-[12px] text-[var(--color-verified-text)]">{doc.extractedFactsCount ?? 0} items found</span>
          </div>
        )}
        {doc.status === 'FAILED' && (
          <div className="flex items-center gap-1">
            <X size={16} className="text-[var(--color-critical)]" />
            <span className="text-[12px] text-[var(--color-critical-text)]">Could not read</span>
          </div>
        )}
      </div>
      {onRemove && doc.status !== 'PROCESSING' && (
        <button onClick={() => onRemove(doc.id)} className="shrink-0 p-1 rounded hover:bg-[var(--color-surface-subtle)]">
          <X size={16} className="text-[var(--color-text-muted)]" />
        </button>
      )}
    </div>
  )
}
