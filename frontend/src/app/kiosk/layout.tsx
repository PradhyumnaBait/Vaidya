'use client'
/**
 * /kiosk layout — Standalone kiosk application surface.
 *
 * This layout is COMPLETELY INDEPENDENT of the main application layouts.
 *
 * It:
 * - Does NOT require authentication
 * - Does NOT use useAuthStore
 * - Does NOT have access to ClinicalShell or PatientShell
 * - Does NOT redirect to /login or any staff surface
 * - Uses KioskShell as its one canonical shell
 *
 * A hospital kiosk browser window can point directly to:
 *   https://<domain>/kiosk
 * and this layout loads with zero dependency on the rest of the application.
 */

import { type ReactNode } from 'react'
import { KioskShell } from '@/layouts/kiosk-shell'

export default function KioskLayout({ children }: { children: ReactNode }) {
  return <KioskShell>{children}</KioskShell>
}
