import { Router } from 'express'
import { getRegistrations, getRegistrationsByEvent, createRegistration } from './registrations.controller'

const registrationsRoutes = Router()

registrationsRoutes.get('/', getRegistrations)
registrationsRoutes.get('/event/:eventId', getRegistrationsByEvent)
registrationsRoutes.post('/', createRegistration)

export { registrationsRoutes }