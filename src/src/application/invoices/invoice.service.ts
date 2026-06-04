import { registrationRepository } from '../../infrastructure/database/postgres/repositories/registration.repository'

export const invoiceService = {
  getAll: async () => {
    const invoices = await registrationRepository.findAllPaid()
    return invoices.map(r => ({
      id: r.id,
      payment_intent_id: r.payment_intent_id,
      full_name: r.full_name,
      dni: r.dni,
      email: r.email,
      event_name: r.event_name,
      amount: r.amount || 0,
      payment_status: r.payment_status || 'succeeded',
      paid_at: r.paid_at || r.created_at,
      created_at: r.created_at,
    }))
  }
}