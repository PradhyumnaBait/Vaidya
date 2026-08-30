import { apiClient } from '@/lib/api-client'

export const intakeService = {
  createEncounter: (patientId: string, department: string) =>
    apiClient.createEncounter(patientId, department),
  getEncounter: (id: string) => apiClient.getEncounter(id),
  getNextQuestion: (sessionId: string, lastAnswerId?: string) =>
    apiClient.getNextQuestion(sessionId, lastAnswerId),
  submitAnswer: (sessionId: string, questionId: string, answer: string) =>
    apiClient.submitAnswer(sessionId, questionId, answer),
}
