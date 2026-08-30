import { AlertTriangle } from 'lucide-react'
import { RedFlagAlert } from '@/types'
import { formatTime } from '@/lib/utils'

interface RedFlagBannerProps {
  alert: RedFlagAlert
  triageStatus?: 'pending' | 'acknowledged'
  onViewRecord?: () => void
}

export function RedFlagBanner({ alert, triageStatus = 'pending', onViewRecord }: RedFlagBannerProps) {
  return (
    <div className="border border-[var(--color-warning)]/30 border-l-4 border-l-[var(--color-warning)] rounded-lg bg-[var(--color-warning-subtle)] px-5 py-4 mb-6">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle size={18} className="text-[var(--color-warning)] shrink-0" />
        <span className="text-[15px] font-semibold text-[var(--color-warning-text)]">Physician Attention Required</span>
        <span className="ml-auto font-mono text-[11px] text-[var(--color-text-muted)]">Alert #{alert.id.slice(-4)}</span>
      </div>
      <div className="mb-3 pl-6">
        <p className="text-[11px] uppercase tracking-wide text-[var(--color-text-muted)] mb-1">Patient stated:</p>
        <div className="bg-white rounded px-3 py-2 border border-[var(--color-border)]">
          <p className="text-[14px] italic">{alert.triggerText}</p>
          {alert.triggerTextTranslated && (
            <p className="text-[13px] text-[var(--color-text-muted)] mt-1">({alert.triggerTextTranslated})</p>
          )}
        </div>
      </div>
      <div className="pl-6 flex items-center gap-2 flex-wrap">
        <span className="text-[12px] bg-[#F4F4F5] rounded px-2 py-0.5">Rule: {alert.ruleName}</span>
        <span className="text-[12px] bg-[#F4F4F5] rounded px-2 py-0.5">Triggered {formatTime(alert.alertedAt)}</span>
        {triageStatus === 'acknowledged' ? (
          <span className="text-[13px] text-[var(--color-verified-text)]">✓ Triage acknowledged</span>
        ) : (
          <span className="flex items-center gap-1 text-[13px] text-[var(--color-warning-text)]">
            <span className="w-2 h-2 rounded-full bg-[var(--color-warning)] animate-pulse" />
            Awaiting triage acknowledgment
          </span>
        )}
        {onViewRecord && (
          <button onClick={onViewRecord} className="ml-auto text-[13px] text-[var(--color-accent)] hover:underline">
            View triage record →
          </button>
        )}
      </div>
    </div>
  )
}
