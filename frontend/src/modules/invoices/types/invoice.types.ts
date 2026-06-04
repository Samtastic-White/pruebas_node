export interface Invoice {
  id: number
  payment_intent_id: string
  full_name: string
  dni: string
  email: string
  event_name: string
  amount: number
  payment_status: string
  paid_at: string
  created_at: string
  receipt_url: string | null;
}