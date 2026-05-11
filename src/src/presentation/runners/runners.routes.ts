import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { getRunnerByDni } from './runners.controller'

const runnersRoutes = Router()

runnersRoutes.get('/:dni', authMiddleware, getRunnerByDni)

export { runnersRoutes }