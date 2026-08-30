import { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 text-[11px] font-medium px-1.5 rounded-sm select-none',
  {
    variants: {
      variant: {
        default:   'bg-[#F4F4F5] text-[var(--color-text-secondary)]',
        accent:    'bg-[var(--color-accent-subtle)] text-[var(--color-accent-text)]',
        verified:  'bg-[var(--color-verified-subtle)] text-[var(--color-verified-text)]',
        warning:   'bg-[var(--color-warning-subtle)] text-[var(--color-warning-text)]',
        critical:  'bg-[var(--color-critical-subtle)] text-[var(--color-critical-text)]',
        ayush:     'bg-[var(--color-ayush-subtle)] text-[var(--color-ayush-text)]',
        tier1:     'bg-[var(--color-verified-subtle)] text-[var(--color-verified-text)]',
        tier2:     'bg-[var(--color-accent-subtle)] text-[var(--color-accent-text)]',
        tier3:     'bg-[#F4F4F5] text-[#71717A]',
        tier4:     'bg-[var(--color-warning-subtle)] text-[var(--color-warning-text)]',
        tier5:     'bg-[#FAF5FF] text-[#7E22CE]',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
