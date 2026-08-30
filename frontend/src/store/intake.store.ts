import { create } from 'zustand'
import type { Language, Modality, Patient, Question } from '@/types'

interface IntakeStore {
  // Patient
  patient: Patient | null
  encounterId: string | null
  sessionId: string | null
  isNewPatient: boolean
  
  // Session
  language: Language
  modality: Modality
  progressPercent: number
  estimatedMinutesRemaining: number
  sessionState: 'IDLE' | 'IDENTIFIED' | 'CONSENTED' | 'INTERVIEWING' | 'DOCUMENTS' | 'REVIEW' | 'COMPLETE'
  
  // Interview
  currentQuestion: Question | null
  previousAnswers: Array<{ questionId: string; questionText: string; answer: string }>
  voiceTranscription: string | null
  voiceConfidence: number
  
  // Documents
  uploadedDocumentIds: string[]
  
  // Actions
  setLanguage: (lang: Language) => void
  setPatient: (patient: Patient, encounterId: string) => void
  setNewPatient: (patient: Partial<Patient>) => void
  setConsented: () => void
  setCurrentQuestion: (q: Question) => void
  setVoiceTranscription: (text: string, confidence: number) => void
  clearVoiceTranscription: () => void
  submitAnswer: (questionId: string, questionText: string, answer: string) => void
  addDocumentId: (id: string) => void
  advanceState: (state: IntakeStore['sessionState']) => void
  reset: () => void
}

const initialState = {
  patient: null, encounterId: null, sessionId: null, isNewPatient: false,
  language: 'en' as Language, modality: 'MULTIMODAL' as Modality,
  progressPercent: 0, estimatedMinutesRemaining: 12,
  sessionState: 'IDLE' as const,
  currentQuestion: null, previousAnswers: [],
  voiceTranscription: null, voiceConfidence: 0,
  uploadedDocumentIds: [],
}

export const useIntakeStore = create<IntakeStore>((set) => ({
  ...initialState,
  setLanguage: (language) => set({ language }),
  setPatient: (patient, encounterId) => set({ patient, encounterId, sessionId: `sess-${Date.now()}`, sessionState: 'IDENTIFIED' }),
  setNewPatient: (data) => set({ patient: { id: `pat-new-${Date.now()}`, ...data } as Patient, isNewPatient: true, sessionState: 'IDENTIFIED' }),
  setConsented: () => set({ sessionState: 'CONSENTED' }),
  setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
  setVoiceTranscription: (voiceTranscription, voiceConfidence) => set({ voiceTranscription, voiceConfidence }),
  clearVoiceTranscription: () => set({ voiceTranscription: null, voiceConfidence: 0 }),
  submitAnswer: (questionId, questionText, answer) => set(s => ({
    previousAnswers: [...s.previousAnswers, { questionId, questionText, answer }],
    voiceTranscription: null, voiceConfidence: 0,
    progressPercent: Math.min(s.progressPercent + 8, 90),
    estimatedMinutesRemaining: Math.max(s.estimatedMinutesRemaining - 1, 1),
  })),
  addDocumentId: (id) => set(s => ({ uploadedDocumentIds: [...s.uploadedDocumentIds, id] })),
  advanceState: (sessionState) => set({ sessionState }),
  reset: () => set(initialState),
}))
