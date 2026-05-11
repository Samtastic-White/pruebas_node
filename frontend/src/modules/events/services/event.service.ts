import api from '../../../config/api'
import type { Event } from '../types/event.types'

export const eventService = {
  getAll: () => api.get<Event[]>('/events').then(r => r.data),
  create: (data: any) => api.post<Event>('/events', data).then(r => r.data),
  update: (id: number, data: any) => api.put<Event>(`/events/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/events/${id}`),
}