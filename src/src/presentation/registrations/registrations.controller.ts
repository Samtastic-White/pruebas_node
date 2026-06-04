import { Request, Response } from 'express'
import Stripe from 'stripe'
import { registrationService } from '../../application/registrations/registration.service'
import { createRegistrationSchema } from './registrations.schema'
import { registrationRepository } from '../../infrastructure/database/postgres/repositories/registration.repository'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia'
})

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

    const { payment_intent_id, ...registrationData } = validation.data

    if (payment_intent_id) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

        if (paymentIntent.status !== 'succeeded') {
          return res.status(400).json({
            error: 'El pago no ha sido completado exitosamente'
          });
        }

        if (paymentIntent.metadata.event_id !== String(registrationData.event_id)) {
          return res.status(400).json({
            error: 'el pago no corresponde a este evento'
          });
        }

        const existingReg = await registrationRepository.findByPaymentIntent(payment_intent_id);
        if (existingReg) {
          return res.status(400).json({
            error: 'este pago ya fue utilizado'
          });
        }
        
      } catch (stripeError: any) {
        console.error('Stripe verification error:', stripeError)
        return res.status(400).json({
          error: 'Error al verificar el pago'
        });
      }
    }

    const registration = await registrationService.create({...registrationData, payment_intent_id})
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