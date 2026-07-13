import { Request, Response, NextFunction } from 'express'
import { logSuccess, logError } from '../../infrastructure/database/dynamodb/services/logservice'

export const loggerMiddleware = (action: string, module: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json.bind(res)

    res.json = function (body: any) {
      if (res.statusCode < 400) {
        logSuccess({
          accion: action,
          usuario: 'admin',
          modulo: module,
          detalles: body
        }).catch(() => {})
      } else {
        logError({
          accion: action,
          usuario: 'admin',
          modulo: module,
          mensaje: JSON.stringify(body)
        }).catch(() => {})
      }
      return originalJson(body)
    }

    next()
  }
}