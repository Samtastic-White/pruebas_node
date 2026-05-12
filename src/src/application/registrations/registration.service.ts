import { runnerRepository } from '../../infrastructure/database/postgres/repositories/runner.repository'
import { registrationRepository } from '../../infrastructure/database/postgres/repositories/registration.repository'
import { eventRepository } from '../../infrastructure/database/postgres/repositories/event.repository'
import { logSuccess, logError } from '../../infrastructure/database/mongo/services/logservice'
import { db } from '../../infrastructure/database'

const log = async (type: 'success' | 'error', accion: string, mensajeODetalles?: string | object) => {
  if (type === 'success') {
    await logSuccess({ accion, usuario: 'admin', modulo: 'registrations', detalles: mensajeODetalles as object })
  } else {
    await logError({ accion, usuario: 'admin', modulo: 'registrations', mensaje: (mensajeODetalles as string) || '' })
  }
}

export const registrationService = {
  getAll: async () => {
    try {
      const registrations = await registrationRepository.findAll()
      await log('success', 'REGISTRATIONS_LISTED', { total: registrations.length })
      return registrations
    } catch (error: any) {
      await log('error', 'GET_REGISTRATIONS_ERROR', error.message)
      throw error
    }
  },

  getByEvent: async (eventId: number) => {
    try {
      const registrations = await registrationRepository.findByEvent(eventId)
      await log('success', 'REGISTRATIONS_BY_EVENT_LISTED', { event_id: eventId, total: registrations.length })
      return registrations
    } catch (error: any) {
      await log('error', 'GET_REGISTRATIONS_BY_EVENT_ERROR', error.message)
      throw error
    }
  },

  create: async (data: { event_id: number; full_name: string; dni: string; email?: string; phone?: string }) => {
    try {
      const event = await eventRepository.findById(data.event_id)
      if (!event) throw new Error('Evento no encontrado')
      if (event.status !== 'active') throw new Error('El evento no está activo')
      
      if (event.max_slots > 0) {
        const count = await registrationRepository.countByEvent(data.event_id)
        if (Number(count[0].count) >= event.max_slots) throw new Error('Cupos agotados')
      }
      
      let runner = await runnerRepository.findByDni(data.dni)
      if (!runner) {
        runner = await runnerRepository.create({
          full_name: data.full_name,
          dni: data.dni,
          email: data.email,
          phone: data.phone
        })
      }
      
      const registration = await registrationRepository.create({
        event_id: data.event_id,
        runner_id: runner.id
      })
      
      await log('success', 'REGISTRATION_CREATED', { registration_id: registration.id, event_id: data.event_id, dni: data.dni })
      return registration
      
    } catch (error: any) {
      if (error.code === '23505') {
        await log('error', 'REGISTRATION_DUPLICATED', `DNI ${data.dni} ya inscrito en evento ${data.event_id}`)
        throw new Error('Ya estás inscrito a este evento')
      }
      await log('error', 'CREATE_REGISTRATION_ERROR', error.message)
      throw error
    }
  },

  cancel: async (id: number) => {
    try {
      const registration = await db('registrations').where({ id }).first()
      
      if (!registration) {
        await log('error', 'REGISTRATION_NOT_FOUND', `Inscripción ${id} no encontrada`)
        return null
      }
      
      await db('registrations').where({ id }).update({ status: 'cancelled' })
      
      await log('success', 'REGISTRATION_CANCELLED', { registration_id: id })
      return { success: true }
      
    } catch (error: any) {
      await log('error', 'CANCEL_REGISTRATION_ERROR', error.message)
      throw error
    }
  }
}