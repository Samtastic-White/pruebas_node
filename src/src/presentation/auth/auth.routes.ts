import { Router } from 'express'
import { login, changePassword } from './auth.controller'

const authRoutes = Router()

authRoutes.post('/login', login)
authRoutes.put('/change-password', changePassword)

export { authRoutes }