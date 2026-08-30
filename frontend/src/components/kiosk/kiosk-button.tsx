'use client'
/**
 * KioskButton — Touch-optimized button for the kiosk surface.
 *
 * Designed for large-finger, standing-distance interaction on a hospital touchscreen.
 * Minimum touch target: 64px height (WCAG 2.5.5 AAA = 44px; we exceed this deliberately).
 *
 * Reuses the existing design token system. Does NOT duplicate the app-wide Button component.
 * The kiosk variant is intentionally larger, bolder, and has stronger visual weight.
 */

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const kioskButtonVariants = cva(
  [
    // Base — always applied
    'relative inline-flex items-center justify-center gap-3',
    'font-semibold tracking-tight select-none',
    'transition-all duration-[150ms] ease-out',
    // Touch feedback
    'active:scale-[0.97]',
    // Focus — visible for keyboard users
    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-border-focus)]/40 focus-visible:ring-offset-2',
    // Disabled
    'disabled:opacity-40 disabled:pointer-events-none',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-[#004ac6] text-white',
          'hover:bg-[#003ea8]',
          'shadow-[0_2px_12px_rgba(0,74,198,0.25)]',
        ].join(' '),
        secondary: [
          'bg-white border-2 border-[#004ac6] text-[#004ac6]',
          'hover:bg-[#f3f3fe]',
        ].join(' '),
        ghost: [
          'bg-[#ededf9] text-[#434655]',
          'hover:bg-[#e1e2ed]',
        ].join(' '),
        danger: [
          'bg-white border-2 border-[var(--color-critical)] text-[var(--color-critical)]',
          'hover:bg-[var(--color-critical-subtle)]',
        ].join(' '),
      },
      size: {
        /** Standard kiosk action — min 64px touch target */
        md: 'h-16 px-8 text-[17px] rounded-xl',
        /** Large kiosk action — primary screen CTAs */
        lg: 'h-[72px] px-10 text-[19px] rounded-2xl',
        /** Full-width kiosk action */
        full: 'h-16 w-full px-8 text-[17px] rounded-xl',
        /** Full-width large — primary screen-level CTAs */
        fullLg: 'h-[72px] w-full px-10 text-[19px] rounded-2xl',
      },
    },
    defaultVariants: { variant: 'primary', size: 'lg' },
  }
)

interface KioskButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof kioskButtonVariants> {
  isLoading?: boolean
}

export const KioskButton = forwardRef<HTMLButtonElement, KioskButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(kioskButtonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="h-5 w-5 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeDasharray="40"
            strokeDashoffset="15"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        children
      )}
    </button>
  )
)
KioskButton.displayName = 'KioskButton'
