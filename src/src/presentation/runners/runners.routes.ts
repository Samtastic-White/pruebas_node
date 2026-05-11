import { Router } from 'express'
import { getRunnerByDni } from './runners.controller'

const runnersRoutes = Router()

runnersRoutes.get('/:dni', getRunnerByDni)

export { runnersRoutes }