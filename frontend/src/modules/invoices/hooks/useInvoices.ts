import { useQuery } from '@tanstack/react-query'
import api from '../../../config/api'
import { Invoice } from '../types/invoice.types'

export function useInvoices() {
  return useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: () => api.get('/invoices').then(r => r.data),
  })
}