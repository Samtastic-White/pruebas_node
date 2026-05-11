import { Request, Response } from 'express'
import { authService } from '../../application/auth/auth.service'

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    const result = await authService.login(username, password)
    
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
    const { username, oldPassword, newPassword } = req.body
    const result = await authService.changePassword(username, oldPassword, newPassword)
    
    if (!result.success) {
      return res.status(400).json({ error: result.error })
    }
    
    res.json({ message: 'Contraseña actualizada exitosamente' })
  } catch (error: any) {
    res.status(500).json({ error: 'Error al cambiar contraseña' })
  }
}