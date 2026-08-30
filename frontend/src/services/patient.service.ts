import { apiClient } from '@/lib/api-client'
import type { Patient } from '@/types'

export const patientService = {
  getById: (id: string) => apiClient.getPatient(id),
  lookupByABHA: (abha: string) => apiClient.lookupPatientByABHA(abha),
  lookupByPhone: (phone: string) => apiClient.lookupPatientByPhone(phone),
  create: (data: Partial<Patient>) => apiClient.createPatient(data),
}
