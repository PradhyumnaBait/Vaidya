import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focus)] focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none select-none',
  {
    variants: {
      variant: {
        primary:   'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]',
        secondary: 'bg-white border border-[var(--color-border-strong)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-subtle)]',
        ghost:     'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-subtle)]',
        destructive: 'bg-[var(--color-critical)] text-white hover:opacity-90',
        ayush:     'bg-[var(--color-ayush)] text-white hover:opacity-90',
      },
      size: {
        sm:     'h-8 px-3 text-sm rounded',
        md:     'h-9 px-4 text-sm rounded',
        lg:     'h-11 px-5 text-base rounded',
        patient:'h-[52px] px-6 text-base rounded-lg',
        full:   'h-[52px] w-full px-6 text-base rounded-lg',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, loading, children, disabled, ...props }, ref) => {
    const isSpinning = isLoading || loading
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isSpinning}
        {...props}
      >
        {isSpinning ? (
          <svg className="processing-arc h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="40" strokeDashoffset="15" strokeLinecap="round"/>
          </svg>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'
