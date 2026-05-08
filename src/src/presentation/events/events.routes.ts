import { Router } from 'express'
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent } from './events.controller'

const eventsRoutes = Router()

eventsRoutes.get('/', getEvents)
eventsRoutes.get('/:id', getEvent)
eventsRoutes.post('/', createEvent)
eventsRoutes.put('/:id', updateEvent)
eventsRoutes.delete('/:id', deleteEvent)

export { eventsRoutes }