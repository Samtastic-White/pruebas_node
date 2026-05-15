import { useQuery } from '@tanstack/react-query'
import { eventService } from '../services/event.service'

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: eventService.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnMount: true,
  })
}