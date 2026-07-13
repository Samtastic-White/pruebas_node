import { Router } from 'express'
import { getLogs } from './logs.controller'

const logsRoutes = Router()

logsRoutes.get('/', getLogs)

export { logsRoutes }
