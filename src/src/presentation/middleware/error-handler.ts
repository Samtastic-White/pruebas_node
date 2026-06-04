import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { ErrorMessages } from '../../domain/errors'

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    const errors = err.issues.map(issue => {
      try {
        return JSON.parse(issue.message)
      } catch {
        return { description: issue.message }
      }
    })
    return res.status(400).json({ errors })
  }

  if (err.code && ErrorMessages[err.code]) {
    const errorInfo = ErrorMessages[err.code]
    return res.status(422).json({
      code: errorInfo.code,
      description: errorInfo.public ? errorInfo.description : 'Error interno'
    })
  }

  console.error('Error no manejado:', err)
  return res.status(500).json({
    code: 'SYS-001',
    description: 'Error interno del servidor'
  })
}