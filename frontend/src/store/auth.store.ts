import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser, Role } from '@/types'

interface AuthStore {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (user: AuthUser) => void
  logout: () => void
}

// Demo users for seamless demonstration
export const DEMO_USERS: Record<Role, AuthUser> = {
  patient: { id: 'u-patient-patil', name: 'Dhananjay Patil', role: 'patient', languagePreferences: ['mr', 'en'] },
  doctor: { id: 'u-dr-rao', name: 'Dr. Sunita Rao', role: 'doctor', department: 'Internal Medicine', languagePreferences: ['en', 'mr', 'hi'] },
  nursing: { id: 'u-nurse-kumar', name: 'Nurse S. Kumar', role: 'nursing', department: 'OPD Triage', languagePreferences: ['en', 'hi'] },
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
