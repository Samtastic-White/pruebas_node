export interface Registration {
  id: number
  event_id: number
  runner_id: number
  status: string
  event_name?: string
  full_name?: string
  dni?: string
  email?: string
  phone?: string
  created_at?: string
}