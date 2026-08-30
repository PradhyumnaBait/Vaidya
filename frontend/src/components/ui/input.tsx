import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  size?: 'md' | 'lg' | 'patient'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, size = 'md', id, ...props }, ref) => {
    const heightClass = size === 'patient' ? 'h-[52px] text-base' : size === 'lg' ? 'h-11 text-base' : 'h-9 text-sm'
    return (
      <div className="flex flex-col gap-1.5">
        {label && <label htmlFor={id} className="text-[13px] font-medium text-[var(--color-text-secondary)]">{label}</label>}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full px-3 rounded border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
            'focus:outline-none focus:border-[var(--color-border-focus)] focus:ring-2 focus:ring-[var(--color-border-focus)]/15',
            'transition-colors duration-fast',
            error && 'border-[var(--color-critical)]',
            heightClass, className
          )}
          {...props}
        />
        {error && <p className="text-[12px] text-[var(--color-critical-text)]">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
