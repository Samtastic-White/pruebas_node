import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent } from './events.controller'

const eventsRoutes = Router()

eventsRoutes.get('/', getEvents)
eventsRoutes.get('/:id', getEvent)

eventsRoutes.post('/', authMiddleware, createEvent)
eventsRoutes.put('/:id', authMiddleware, updateEvent)
eventsRoutes.delete('/:id', authMiddleware, deleteEvent)

export { eventsRoutes }