import { useQuery } from '@tanstack/react-query'
import { registrationService } from '../services/registration.service'

export function useRegistrations() {
  return useQuery({
    queryKey: ['registrations'],
    queryFn: registrationService.getAll,
  })
}