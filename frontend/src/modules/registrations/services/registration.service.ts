import api from '../../../config/api'
import type { Registration } from '../types/registration.types'

export const registrationService = {
  getAll: () => api.get<Registration[]>('/registrations').then(r => r.data),
  getByEvent: (eventId: number) => api.get<Registration[]>(`/registrations/event/${eventId}`).then(r => r.data),
  create: (data: any) => api.post<Registration>('/registrations', data).then(r => r.data),
}