import { create } from 'zustand'

interface UIStore {
  // Evidence drawer
  evidenceDrawerOpen: boolean
  evidenceFactId: string | null
  openEvidenceDrawer: (factId: string) => void
  closeEvidenceDrawer: () => void

  // Toast
  toasts: Array<{ id: string; type: 'info' | 'success' | 'warning' | 'error'; title: string; body?: string }>
  addToast: (toast: Omit<UIStore['toasts'][0], 'id'>) => void
  removeToast: (id: string) => void

  // Active section in case brief
  activeCaseSection: string
  setActiveCaseSection: (section: string) => void
}

export const useUIStore = create<UIStore>((set) => ({
  evidenceDrawerOpen: false,
  evidenceFactId: null,
  openEvidenceDrawer: (factId) => set({ evidenceDrawerOpen: true, evidenceFactId: factId }),
  closeEvidenceDrawer: () => set({ evidenceDrawerOpen: false, evidenceFactId: null }),

  toasts: [],
  addToast: (toast) => set(s => ({ toasts: [...s.toasts, { ...toast, id: `toast-${Date.now()}` }] })),
  removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

  activeCaseSection: 'overview',
  setActiveCaseSection: (section) => set({ activeCaseSection: section }),
}))
