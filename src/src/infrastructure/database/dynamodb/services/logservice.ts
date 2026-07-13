import { PutCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '../connection'
import { SUCCESS_LOGS_TABLE } from '../models/log-success.model'
import { ERROR_LOGS_TABLE } from '../models/log-errors.model'

const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export const logSuccess = async (data: {
  accion: string
  usuario: string
  modulo: string
  detalles?: object
}) => {
  await docClient.send(
    new PutCommand({
      TableName: SUCCESS_LOGS_TABLE,
      Item: {
        id: generateId(),
        accion: data.accion,
        usuario: data.usuario,
        modulo: data.modulo || 'unknown',
        detalles: data.detalles || {},
        createdAt: new Date().toISOString(),
      },
    })
  )
}

export const logError = async (data: {
  accion: string
  usuario: string
  modulo: string
  mensaje: string
  stack?: string
}) => {
  await docClient.send(
    new PutCommand({
      TableName: ERROR_LOGS_TABLE,
      Item: {
        id: generateId(),
        accion: data.accion,
        usuario: data.usuario,
        modulo: data.modulo || 'unknown',
        mensaje: data.mensaje,
        stack: data.stack || '',
        createdAt: new Date().toISOString(),
      },
    })
  )
}
