import { ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '../../infrastructure/database/dynamodb/connection'
import { SUCCESS_LOGS_TABLE } from '../../infrastructure/database/dynamodb/models/log-success.model'
import { ERROR_LOGS_TABLE } from '../../infrastructure/database/dynamodb/models/log-errors.model'

export const logService = {
  getLogs: async (filters: {
    type?: string
    accion?: string
    modulo?: string
    limit?: number
  }) => {
    const maxResults = Math.min(filters.limit || 20, 100)

    const tables = filters.type
      ? [filters.type === 'success' ? SUCCESS_LOGS_TABLE : ERROR_LOGS_TABLE]
      : [SUCCESS_LOGS_TABLE, ERROR_LOGS_TABLE]

    const results: any[] = []

    for (const table of tables) {
      if (filters.accion) {
        const data = await docClient.send(
          new QueryCommand({
            TableName: table,
            IndexName: 'idx_accion',
            KeyConditionExpression: 'accion = :accion',
            ExpressionAttributeValues: { ':accion': filters.accion },
            Limit: maxResults,
            ScanIndexForward: false,
          })
        )
        results.push(...(data.Items || []))
      } else if (filters.modulo) {
        const data = await docClient.send(
          new QueryCommand({
            TableName: table,
            IndexName: 'idx_modulo',
            KeyConditionExpression: '#mod = :mod',
            ExpressionAttributeValues: { ':mod': filters.modulo },
            ExpressionAttributeNames: { '#mod': 'modulo' },
            Limit: maxResults,
            ScanIndexForward: false,
          })
        )
        results.push(...(data.Items || []))
      } else {
        const data = await docClient.send(
          new ScanCommand({
            TableName: table,
            Limit: maxResults,
          })
        )
        results.push(...(data.Items || []))
      }
    }

    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return results.slice(0, maxResults)
  },
}
