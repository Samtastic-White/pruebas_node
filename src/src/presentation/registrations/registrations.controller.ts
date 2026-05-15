import { Request, Response } from 'express'
import { registrationService } from '../../application/registrations/registration.service'
import { createRegistrationSchema } from './registrations.schema'

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
    const validation = createRegistrationSchema.safeParse(req.body)

    if (!validation.success) {
      const errors = validation.error.issues.map(issues => {
        try { return JSON.parse(issues.message) }
        catch { return { description: issues.message } }
      })
      return res.status(400).json({ errors })
    }

    const registration = await registrationService.create(validation.data)
    res.status(201).json(registration)

  } catch (error: any) {
    if (error.message === 'Ya estás inscrito a este evento') {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: 'Error al crear inscripción' })
  }
}

export const cancelRegistration = async (req: Request, res: Response) => {
  try {
    const result = await registrationService.cancel(Number(req.params.id))
    if (!result) return res.status(404).json({ error: 'Inscripción no encontrada' })
    res.json({ message: 'Inscripción cancelada' })
  } catch (error: any) {
    res.status(500).json({ error: 'Error al cancelar inscripción' })
  }
}