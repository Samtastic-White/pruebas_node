import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventService } from '../services/event.service'
import { toast } from 'sonner'

export function useCreateEvent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: eventService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('Evento creado exitosamente')
    },
    onError: () => {
      toast.error('Error al crear evento')
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => eventService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('Evento actualizado exitosamente')
    },
    onError: () => {
      toast.error('Error al actualizar evento')
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => eventService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast.success('Evento eliminado exitosamente')
    },
    onError: () => {
      toast.error('Error al eliminar evento')
    },
  })
}