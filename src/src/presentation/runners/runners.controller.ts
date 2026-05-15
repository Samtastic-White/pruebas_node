import { Request, Response } from 'express'
import { runnerService } from '../../application/runners/runner.service'
import { runnerDniSchema } from './runners.schema'

export const getRunnerByDni = async (req: Request, res: Response) => {
  try {
    const validation = runnerDniSchema.safeParse(req.params)

    if (!validation.success) {
      return res.status(400).json({ error: 'DNI inválido' })
    }

    const runner = await runnerService.getByDni(validation.data.dni)

    if (!runner) {
      return res.status(404).json({ error: 'Corredor no encontrado' })
    }

    res.json(runner)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al buscar corredor' })
  }
}