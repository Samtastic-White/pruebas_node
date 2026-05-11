import { Request, Response } from 'express'
import { registrationService } from '../../application/registrations/registration.service'

export const getRegistrations = async (_req: Request, res: Response) => {
  try {
    const registrations = await registrationService.getAll()
    res.json(registrations)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener inscripciones' })
  }
}

export const getRegistrationsByEvent = async (req: Request, res: Response) => {
  try {
    const registrations = await registrationService.getByEvent(Number(req.params.eventId))
    res.json(registrations)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener inscripciones' })
  }
}

export const createRegistration = async (req: Request, res: Response) => {
  try {
    const registration = await registrationService.create(req.body)
    res.status(201).json(registration)
  } catch (error: any) {
    if (error.message === 'Ya estás inscrito a este evento') {
      return res.status(400).json({ error: error.message })
    }
    if (error.message === 'Evento no encontrado') {
      return res.status(404).json({ error: error.message })
    }
    if (error.message === 'El evento no está activo') {
      return res.status(400).json({ error: error.message })
    }
    if (error.message === 'Cupos agotados') {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: 'Error al crear inscripción' })
  }
}