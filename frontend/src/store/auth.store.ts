import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser, Role } from '@/types'

interface AuthStore {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (user: AuthUser) => void
  logout: () => void
}

// Demo users — replace with real auth backend later
export const DEMO_USERS: Record<Role, AuthUser> = {
  patient: { id: 'u-patient', name: 'Patient User', role: 'patient', languagePreferences: ['en', 'hi'] },
  doctor: { id: 'u-dr-mehta', name: 'Dr. R. Mehta', role: 'doctor', department: 'Internal Medicine', languagePreferences: ['en', 'hi'] },
  nursing: { id: 'u-nurse-kumar', name: 'Nurse S. Kumar', role: 'nursing', department: 'OPD', languagePreferences: ['en', 'hi'] },
  admin: { id: 'u-admin-singh', name: 'Admin A. Singh', role: 'admin', languagePreferences: ['en'] },
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'vaidya-auth' }
  )
)
