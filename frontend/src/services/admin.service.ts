import { apiClient } from '@/lib/api-client'

export const adminService = {
  getMetrics: () => apiClient.getAdminMetrics(),
  getIntegrationHealth: () => apiClient.getIntegrationHealth(),
  getAuditEvents: (filters?: { eventType?: string; dateRange?: string }) =>
    apiClient.getAuditEvents(filters),
}
