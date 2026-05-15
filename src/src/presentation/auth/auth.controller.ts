import { Request, Response } from 'express'
import { authService } from '../../application/auth/auth.service'
import { loginSchema, changePasswordSchema } from './auth.schema'

export const login = async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body)

    if (!validation.success) {
      const errors = validation.error.issues.map(issues => {
        try { return JSON.parse(issues.message) }
        catch { return { description: issues.message } }
      })
      return res.status(400).json({ errors })
    }

    const result = await authService.login(
      validation.data.username,
      validation.data.password
    )

    if (!result) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    res.json(result)
  } catch (error: any) {
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

export const changePassword = async (req: Request, res: Response) => {
  try {
    const validation = changePasswordSchema.safeParse(req.body)

    if (!validation.success) {
      const errors = validation.error.issues.map(issues => {
        try { return JSON.parse(issues.message) }
        catch { return { description: issues.message } }
      })
      return res.status(400).json({ errors })
    }

    const result = await authService.changePassword(
      validation.data.username,
      validation.data.oldPassword,
      validation.data.newPassword
    )

    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }

    res.json({ message: 'Contraseña actualizada exitosamente' })
  } catch (error: any) {
    res.status(500).json({ error: 'Error al cambiar contraseña' })
  }
}