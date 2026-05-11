import { Request, Response } from 'express'
import { runnerService } from '../../application/runners/runner.service'

export const getRunnerByDni = async (req: Request, res: Response) => {
  try {
    const dni = Array.isArray(req.params.dni) ? req.params.dni[0] : req.params.dni
    const runner = await runnerService.getByDni(dni)
    
    if (!runner) {
      return res.status(404).json({ error: 'Corredor no encontrado' })
    }
    
    res.json(runner)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al buscar corredor' })
  }
}