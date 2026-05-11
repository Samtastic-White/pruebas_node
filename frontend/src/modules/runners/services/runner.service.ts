import api from '../../../config/api'
import type { RunnerWithHistory } from '../types/runner.types'

export const runnerService = {
  getByDni: (dni: string) => api.get<RunnerWithHistory>(`/runners/${dni}`).then(r => r.data),
}