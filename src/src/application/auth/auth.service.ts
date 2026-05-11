import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../../infrastructure/database/postgres/connection'
import { envs } from '../../infrastructure/config/environments'
import { logSuccess, logError } from '../../infrastructure/database/mongo/services/logservice'

const log = async (type: 'success' | 'error', accion: string, mensajeODetalles?: string | object) => {
  if (type === 'success') {
    await logSuccess({ accion, usuario: 'admin', modulo: 'auth', detalles: mensajeODetalles as object })
  } else {
    await logError({ accion, usuario: 'admin', modulo: 'auth', mensaje: (mensajeODetalles as string) || '' })
  }
}

export const authService = {
  login: async (username: string, password: string) => {
    try {
      const admin = await db('admin_users').where({ username }).first()
      
      if (!admin) {
        await log('error', 'LOGIN_FAILED_USER', `Usuario ${username} no encontrado`)
        return null
      }
      
      const isValid = await bcrypt.compare(password, admin.password_hash)
      if (!isValid) {
        await log('error', 'LOGIN_FAILED_PASSWORD', 'Contraseña incorrecta')
        return null
      }
      
      const token = jwt.sign(
        { id: admin.id, username: admin.username, role: admin.role },
        envs.JWT_SECRET,
        { expiresIn: envs.JWT_EXPIRES_IN as any }
      )
      
      await log('success', 'LOGIN_SUCCESS', { admin_id: admin.id, role: admin.role })
      return { token }
      
    } catch (error: any) {
      await log('error', 'LOGIN_ERROR', error.message)
      throw error
    }
  },

  changePassword: async (username: string, oldPassword: string, newPassword: string) => {
    try {
      const admin = await db('admin_users').where({ username }).first()
      
      if (!admin) {
        await log('error', 'CHANGE_PASSWORD_USER_NOT_FOUND', `Usuario ${username} no encontrado`)
        return { success: false, error: 'Usuario no encontrado' }
      }
      
      const isValid = await bcrypt.compare(oldPassword, admin.password_hash)
      if (!isValid) {
        await log('error', 'CHANGE_PASSWORD_INVALID', 'Contraseña actual incorrecta')
        return { success: false, error: 'Contraseña actual incorrecta' }
      }
      
      const newHash = await bcrypt.hash(newPassword, 10)
      await db('admin_users').where({ username }).update({ password_hash: newHash })
      
      await log('success', 'PASSWORD_CHANGED', { username })
      return { success: true }
      
    } catch (error: any) {
      await log('error', 'CHANGE_PASSWORD_ERROR', error.message)
      throw error
    }
  },
}