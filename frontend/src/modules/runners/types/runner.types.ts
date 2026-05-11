export interface Runner {
  id: number
  full_name: string
  dni: string
  email: string
  phone: string
  created_at: string
}

export interface RunnerWithHistory extends Runner {
  inscriptions: Array<{
    name: string
    event_date: string
    status: string
    created_at: string
  }>
}