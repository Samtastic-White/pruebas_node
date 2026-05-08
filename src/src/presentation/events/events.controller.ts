import { Request, Response } from 'express'
import db from '../../infrastructure/database/postgres/connection'
import { logSuccess, logError } from '../../infrastructure/database/mongo/services/logservice'

export const getEvents = async (_req: Request, res: Response) => {
  try {
    const events = await db('events').select('*')
    
    await logSuccess({
      accion: 'EVENTS_LISTED',
      usuario: 'admin',
      modulo: 'events',
      detalles: { total: events.length }
    })
    
    res.json(events)
  } catch (error: any) {
    await logError({
      accion: 'GET_EVENTS_ERROR',
      usuario: 'admin',
      modulo: 'events',
      mensaje: error.message
    })
    res.status(500).json({ error: 'Error al obtener eventos' })
  }
}

export const getEvent = async (req: Request, res: Response) => {
  try {
    const event = await db('events').where({ id: req.params.id }).first()
    
    if (!event) {
      await logError({
        accion: 'EVENT_NOT_FOUND',
        usuario: 'admin',
        modulo: 'events',
        mensaje: `Evento ${req.params.id} no encontrado`
      })
      return res.status(404).json({ error: 'Evento no encontrado' })
    }
    
    await logSuccess({
      accion: 'EVENT_RETRIEVED',
      usuario: 'admin',
      modulo: 'events',
      detalles: { event_id: event.id, name: event.name }
    })
    
    res.json(event)
  } catch (error: any) {
    await logError({
      accion: 'GET_EVENT_ERROR',
      usuario: 'admin',
      modulo: 'events',
      mensaje: error.message
    })
    res.status(500).json({ error: 'Error al obtener evento' })
  }
}

export const createEvent = async (req: Request, res: Response) => {
  try {
    const [newEvent] = await db('events').insert(req.body).returning('*')

    await logSuccess({
      accion: 'EVENT_CREATED',
      usuario: 'admin',
      modulo: 'events',
      detalles: { event_id: newEvent.id, name: newEvent.name }
    })

    res.status(201).json(newEvent)
  } catch (error: any) {
    await logError({
      accion: 'CREATE_EVENT_ERROR',
      usuario: 'admin',
      modulo: 'events',
      mensaje: error.message
    })
    res.status(500).json({ error: 'Error al crear evento' })
  }
}

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const [updated] = await db('events').where({ id: req.params.id }).update(req.body).returning('*')
    
    if (!updated) {
      await logError({
        accion: 'EVENT_NOT_FOUND_UPDATE',
        usuario: 'admin',
        modulo: 'events',
        mensaje: `Evento ${req.params.id} no encontrado para actualizar`
      })
      return res.status(404).json({ error: 'Evento no encontrado' })
    }

    await logSuccess({
      accion: 'EVENT_UPDATED',
      usuario: 'admin',
      modulo: 'events',
      detalles: { event_id: updated.id, name: updated.name }
    })

    res.json(updated)
  } catch (error: any) {
    await logError({
      accion: 'UPDATE_EVENT_ERROR',
      usuario: 'admin',
      modulo: 'events',
      mensaje: error.message
    })
    res.status(500).json({ error: 'Error al actualizar evento' })
  }
}

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const deleted = await db('events').where({ id: req.params.id }).del()
    
    if (!deleted) {
      await logError({
        accion: 'EVENT_NOT_FOUND_DELETE',
        usuario: 'admin',
        modulo: 'events',
        mensaje: `Evento ${req.params.id} no encontrado para eliminar`
      })
      return res.status(404).json({ error: 'Evento no encontrado' })
    }

    await logSuccess({
      accion: 'EVENT_DELETED',
      usuario: 'admin',
      modulo: 'events',
      detalles: { event_id: req.params.id }
    })

    res.json({ message: 'Evento eliminado' })
  } catch (error: any) {
    await logError({
      accion: 'DELETE_EVENT_ERROR',
      usuario: 'admin',
      modulo: 'events',
      mensaje: error.message
    })
    res.status(500).json({ error: 'Error al eliminar evento' })
  }
}