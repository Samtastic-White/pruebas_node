import { eventRepository } from '../../infrastructure/database/postgres/repositories/event.repository'
import { logSuccess, logError } from '../../infrastructure/database/mongo/services/logservice'
import  db  from '../../infrastructure/database/postgres/connection'

const log = async (
  type: 'success' | 'error',
  accion: string,
  mensajeODetalles?: string | object
) => {
  if (type === 'success') {
    await logSuccess({
      accion,
      usuario: 'admin',
      modulo: 'events',
      detalles: mensajeODetalles as object
    })
  } else {
    await logError({
      accion,
      usuario: 'admin',
      modulo: 'events',
      mensaje: (mensajeODetalles as string) || ''
    })
  }
}

export const eventService = {
  getAll: async () => {
    try {
      const events = await eventRepository.findAll()
      await log('success', 'EVENTS_LISTED', { total: events.length })
      return events
    } catch (error: any) {
      await log('error', 'GET_EVENTS_ERROR', error.message)
      throw error
    }
  },

  getById: async (id: number) => {
    try {
      const event = await eventRepository.findById(id)
      if (!event) {
        await log('error', 'EVENT_NOT_FOUND', `Evento ${id} no encontrado`)
        return null
      }
      await log('success', 'EVENT_RETRIEVED', { event_id: event.id, name: event.name })
      return event
    } catch (error: any) {
      await log('error', 'GET_EVENT_ERROR', error.message)
      throw error
    }
  },

  create: async (data: any) => {
    try {
      const newEvent = await eventRepository.create(data)
      await log('success', 'EVENT_CREATED', { event_id: newEvent.id, name: newEvent.name })
      return newEvent
    } catch (error: any) {
      await log('error', 'CREATE_EVENT_ERROR', error.message)
      throw error
    }
  },

  update: async (id: number, data: any) => {
    try {
      const updated = await eventRepository.update(id, data)
      if (!updated) {
        await log('error', 'EVENT_NOT_FOUND_UPDATE', `Evento ${id} no encontrado para actualizar`)
        return null
      }
      await log('success', 'EVENT_UPDATED', { event_id: updated.id, name: updated.name })
      return updated
    } catch (error: any) {
      await log('error', 'UPDATE_EVENT_ERROR', error.message)
      throw error
    }
  },

  delete: async (id: number) => {
    try {
      const deleted = await eventRepository.delete(id)
      if (!deleted) {
        await log('error', 'EVENT_NOT_FOUND_DELETE', `Evento ${id} no encontrado para eliminar`)
        return false
      }
      await log('success', 'EVENT_DELETED', { event_id: id })
      return true
    } catch (error: any) {
      await log('error', 'DELETE_EVENT_ERROR', error.message)
      throw error
    }
  },

  updateExpiredEvents: async () => {
    const today = new Date().toISOString().split('T')[0]
    const updated = await eventRepository.updateExpired(today)
    if (updated > 0) {
      console.log(` ${updated} marcado como finalizado`)
    }
  },
}