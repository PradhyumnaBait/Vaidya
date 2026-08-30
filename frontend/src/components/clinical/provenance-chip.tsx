import { ConfidenceTier, SourceType } from '@/types'
import { Badge } from '@/components/ui'
import { cn } from '@/lib/utils'

interface ProvenanceChipProps {
  tier: ConfidenceTier
  sourceType: SourceType
  confidence?: number
  onClick?: () => void
  className?: string
}

const TIER_CONFIG: Record<ConfidenceTier, { variant: 'tier1'|'tier2'|'tier3'|'tier4'|'tier5'; label: (c?: number) => string }> = {
  1: { variant: 'tier1', label: () => '✓ Verified' },
  2: { variant: 'tier2', label: (c) => `Doc · ${c ? Math.round(c * 100) : 94}%` },
  3: { variant: 'tier3', label: () => 'Interview' },
  4: { variant: 'tier4', label: (c) => `⚠ Doc · ${c ? Math.round(c * 100) : 61}%` },
  5: { variant: 'tier5', label: () => '~ Estimated' },
}

export function ProvenanceChip({ tier, confidence, onClick, className }: ProvenanceChipProps) {
  const config = TIER_CONFIG[tier]
  return (
    <Badge
      variant={config.variant}
      className={cn('h-5 cursor-pointer hover:opacity-80 transition-opacity', onClick && 'cursor-pointer', className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {config.label(confidence)}
    </Badge>
  )
}
