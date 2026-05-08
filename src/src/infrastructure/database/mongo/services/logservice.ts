import { LogSuccessModel } from '../models/log-success.model'
import { LogErrorModel } from '../models/log-errors.model'

export const logSuccess = async (data: {
  accion: string
  usuario: string
  modulo: string
  detalles?: object
}) => {
  await LogSuccessModel.create({
    ...data,
    modulo: data.modulo || 'unknown'
  })
}

export const logError = async (data: {
  accion: string
  usuario: string
  modulo: string
  mensaje: string
  stack?: string
}) => {
  await LogErrorModel.create({
    ...data,
    modulo: data.modulo || 'unknown'
  })
}