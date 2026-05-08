import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import db from '../../infrastructure/database/postgres/connection'
import { envs } from '../../infrastructure/config/environments'
import { logSuccess, logError } from '../../infrastructure/database/mongo/services/logservice'

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    
    const admin = await db('admin_users').where({ username }).first()
    
    if (!admin) {
      await logError({
        accion: 'LOGIN_FAILED_USER',
        usuario: username,
        modulo: 'auth',
        mensaje: `Usuario no encontrado: ${username}`
      })
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }
    
    if (password !== admin.password_hash) {
      await logError({
        accion: 'LOGIN_FAILED_PASSWORD',
        usuario: username,
        modulo: 'auth',
        mensaje: 'Contraseña incorrecta'
      })
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }
    
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      envs.JWT_SECRET,
      { expiresIn: '5m' as any }
    )
    
    await logSuccess({
      accion: 'LOGIN_SUCCESS',
      usuario: username,
      modulo: 'auth',
      detalles: { admin_id: admin.id, role: admin.role }
    })
    
    res.json({ token })
  } catch (error: any) {
    await logError({
      accion: 'LOGIN_ERROR',
      usuario: req.body?.username || 'desconocido',
      modulo: 'auth',
      mensaje: error.message
    })
    res.status(500).json({ error: 'Error en el servidor' })
  }
}