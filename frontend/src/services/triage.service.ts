import { apiClient } from '@/lib/api-client'

export const triageService = {
  getQueue: () => apiClient.getTriageQueue(),
  getAlerts: (encounterId: string) => apiClient.getRedFlags(encounterId),
  acknowledgeAlert: (alertId: string, action: string, note?: string) =>
    apiClient.acknowledgeAlert(alertId, action, note),
}
