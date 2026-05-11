export interface Event {
  id: number
  name: string
  description: string | null
  event_date: string
  event_time: string
  location: string
  distance: string
  price: string
  max_slots: number
  image_url: string | null
  status: 'active' | 'inactive' | 'finished'
}