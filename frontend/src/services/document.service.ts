import { apiClient } from '@/lib/api-client'

export const documentService = {
  getByEncounter: (encounterId: string) => apiClient.getDocuments(encounterId),
  upload: (encounterId: string, file: File, type: string) =>
    apiClient.uploadDocument(encounterId, file, type),
}
