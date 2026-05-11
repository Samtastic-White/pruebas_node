import { runnerRepository } from '../../infrastructure/database/postgres/repositories/runner.repository'
import { logSuccess, logError } from '../../infrastructure/database/mongo/services/logservice'

const log = async (type: 'success' | 'error', accion: string, mensajeODetalles?: string | object) => {
  if (type === 'success') {
    await logSuccess({ accion, usuario: 'admin', modulo: 'runners', detalles: mensajeODetalles as object })
  } else {
    await logError({ accion, usuario: 'admin', modulo: 'runners', mensaje: (mensajeODetalles as string) || '' })
  }
}

export const runnerService = {
  getByDni: async (dni: string) => {
    try {
      const runner = await runnerRepository.findByDni(dni)
      if (!runner) {
        await log('error', 'RUNNER_NOT_FOUND', `Corredor con DNI ${dni} no encontrado`)
        return null
      }
      await log('success', 'RUNNER_RETRIEVED', { runner_id: runner.id, dni })
      return runner
    } catch (error: any) {
      await log('error', 'GET_RUNNER_ERROR', error.message)
      throw error
    }
  },
}