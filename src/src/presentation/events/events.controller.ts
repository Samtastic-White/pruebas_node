import { Request, Response } from 'express'
import { eventService } from '../../application/events/event.service'
import { createEventSchema, updateEventSchema } from './events.schema'

export const getEvents = async (_req: Request, res: Response) => {
  try {
    const events = await eventService.getAll()
    res.json(events)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener eventos' })
  }
}

export const getEvent = async (req: Request, res: Response) => {
  try {
    const event = await eventService.getById(Number(req.params.id))
    if (!event) return res.status(404).json({ error: 'Evento no encontrado' })
    res.json(event)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener evento' })
  }
}

export const createEvent = async (req: Request, res: Response) => {
  try {
    const validation = createEventSchema.safeParse(req.body)

    if (!validation.success) {
      const errors = validation.error.issues.map(issues => {
        try { return JSON.parse(issues.message) }
        catch { return { description: issues.message } }
      })
      return res.status(400).json({ errors })
    }

    const newEvent = await eventService.create(validation.data)
    res.status(201).json(newEvent)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al crear evento' })
  }
}

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const validation = updateEventSchema.safeParse(req.body)

    if (!validation.success) {
      const errors = validation.error.issues.map(issues => {
        try { return JSON.parse(issues.message) }
        catch { return { description: issues.message } }
      })
      return res.status(400).json({ errors })
    }

    const updated = await eventService.update(Number(req.params.id), validation.data)
    if (!updated) return res.status(404).json({ error: 'Evento no encontrado' })
    res.json(updated)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al actualizar evento' })
  }
}

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const deleted = await eventService.delete(Number(req.params.id))
    if (!deleted) return res.status(404).json({ error: 'Evento no encontrado' })
    res.json({ message: 'Evento eliminado' })
  } catch (error: any) {
    res.status(500).json({ error: 'Error al eliminar evento' })
  }
}