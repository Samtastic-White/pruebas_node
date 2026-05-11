import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventService } from '../services/event.service'
import { toast } from 'sonner'

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: eventService.getAll,
    staleTime: 0,
    refetchOnMount: true,
  })
}

export function useCreateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: eventService.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['events'] }); toast.success('Evento creado') },
    onError: () => toast.error('Error al crear evento'),
  })
}

export function useUpdateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => eventService.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['events'] }); toast.success('Evento actualizado') },
    onError: () => toast.error('Error al actualizar'),
  })
}

export function useDeleteEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: eventService.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['events'] }); toast.success('Evento eliminado') },
    onError: () => toast.error('Error al eliminar'),
  })
}