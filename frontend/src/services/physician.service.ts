import { apiClient } from '@/lib/api-client'

export const physicianService = {
  getQueue: () => apiClient.getPatientQueue(),
  getEncounter: (id: string) => apiClient.getEncounter(id),
  getFacts: (encounterId: string) => apiClient.getFacts(encounterId),
  updateFact: (factId: string, value: string) => apiClient.updateFact(factId, value),
  getConflicts: (encounterId: string) => apiClient.getConflicts(encounterId),
  resolveConflict: (id: string, resolution: 'RESOLVED_A' | 'RESOLVED_B' | 'RESOLVED_UNCERTAIN', note?: string) =>
    apiClient.resolveConflict(id, resolution, note),
  getTimeline: (encounterId: string) => apiClient.getTimeline(encounterId),
  getDocuments: (encounterId: string) => apiClient.getDocuments(encounterId),
  getRedFlags: (encounterId: string) => apiClient.getRedFlags(encounterId),
  getCompleteness: (encounterId: string) => apiClient.getCompleteness(encounterId),
  approveCase: (encounterId: string) => apiClient.approveCase(encounterId),
}
