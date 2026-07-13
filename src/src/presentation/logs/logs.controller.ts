import { Request, Response } from 'express'
import { logService } from '../../application/logs/log.service'

export const getLogs = async (req: Request, res: Response) => {
  try {
    const { type, accion, modulo, limit } = req.query

    if (type && type !== 'success' && type !== 'error') {
      return res.status(400).json({ error: 'type debe ser "success" o "error"' })
    }

    const logs = await logService.getLogs({
      type: type as string,
      accion: accion as string,
      modulo: modulo as string,
      limit: Number(limit) || undefined,
    })

    res.json(logs)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener logs' })
  }
}
