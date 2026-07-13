import { useQuery } from '@tanstack/react-query'
import api from '../../../config/api'
import type { LogEntry } from '../types/log.types'

export interface LogFilters {
  type?: string
  modulo?: string
  accion?: string
  limit?: number
}

export function useLogs(filters: LogFilters = {}) {
  const params: Record<string, string | number> = {}
  if (filters.type) params.type = filters.type
  if (filters.modulo) params.modulo = filters.modulo
  if (filters.accion) params.accion = filters.accion
  if (filters.limit) params.limit = filters.limit

  return useQuery<LogEntry[]>({
    queryKey: ['logs', filters],
    queryFn: () => api.get('/logs', { params }).then(r => r.data),
  })
}
