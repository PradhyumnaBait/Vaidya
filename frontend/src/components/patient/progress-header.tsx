interface ProgressHeaderProps {
  percent: number
  minutesRemaining: number
}

export function ProgressHeader({ percent, minutesRemaining }: ProgressHeaderProps) {
  return (
    <div className="h-[52px] bg-white border-b border-[var(--color-border)] flex items-center px-4 gap-4 sticky top-0 z-10 shrink-0">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[14px] font-semibold text-[var(--color-text-primary)]">Vaidya</span>
        <span className="text-[11px] text-[var(--color-text-muted)]">AIIA OPD</span>
      </div>
      <div className="flex-1 h-0.5 bg-[var(--color-border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="shrink-0 text-[13px] text-[var(--color-text-muted)]">
        {percent >= 100 ? 'Complete' : `~${minutesRemaining} min remaining`}
      </span>
      <div className="flex items-center gap-1 shrink-0">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-text-muted)]"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        <span className="text-[11px] text-[var(--color-text-muted)]">Secure</span>
      </div>
    </div>
  )
}
