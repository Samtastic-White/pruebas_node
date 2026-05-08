import { Request, Response } from 'express'
import db from '../../infrastructure/database/postgres/connection'

export const getRegistrations = async (req: Request, res: Response) => {
  const registrations = await db('registrations')
    .join('events', 'registrations.event_id', 'events.id')
    .select('registrations.*', 'events.name as event_name')
  res.json(registrations)
}

export const getRegistrationsByEvent = async (req: Request, res: Response) => {
  const registrations = await db('registrations')
    .where({ event_id: req.params.eventId })
  res.json(registrations)
}

export const createRegistration = async (req: Request, res: Response) => {
  const { event_id } = req.body
  
  const event = await db('events').where({ id: event_id }).first()
  if (!event) return res.status(404).json({ error: 'Evento no encontrado' })
  if (event.status !== 'active') return res.status(400).json({ error: 'Evento no activo' })
  
  if (event.max_slots > 0) {
    const count = await db('registrations').where({ event_id }).count()
    if (Number(count[0].count) >= event.max_slots) {
      return res.status(400).json({ error: 'Cupos agotados' })
    }
  }
  
  try {
    const [newReg] = await db('registrations').insert(req.body).returning('*')
    res.status(201).json(newReg)
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Ya estás inscrito a este evento' })
    }
    throw error
  }
}