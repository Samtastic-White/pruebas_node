import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { getRegistrations, getRegistrationsByEvent, createRegistration, cancelRegistration } from './registrations.controller'

const registrationsRoutes = Router()

registrationsRoutes.post('/', createRegistration)

registrationsRoutes.get('/', authMiddleware, getRegistrations)
registrationsRoutes.get('/event/:eventId', authMiddleware, getRegistrationsByEvent)
registrationsRoutes.put('/:id/cancel', authMiddleware, cancelRegistration)

export { registrationsRoutes }