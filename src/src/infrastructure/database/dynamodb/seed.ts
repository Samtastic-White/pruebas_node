import 'dotenv/config'
import { CreateTableCommand } from '@aws-sdk/client-dynamodb'
import { client } from './connection'

const TABLES = [
  {
    TableName: 'success_logs',
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'accion', AttributeType: 'S' },
      { AttributeName: 'modulo', AttributeType: 'S' },
      { AttributeName: 'createdAt', AttributeType: 'S' },
    ],
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'idx_accion',
        KeySchema: [{ AttributeName: 'accion', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
      {
        IndexName: 'idx_modulo',
        KeySchema: [{ AttributeName: 'modulo', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
      {
        IndexName: 'idx_createdAt',
        KeySchema: [{ AttributeName: 'createdAt', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
  {
    TableName: 'errors_logs',
    AttributeDefinitions: [
      { AttributeName: 'id', AttributeType: 'S' },
      { AttributeName: 'accion', AttributeType: 'S' },
      { AttributeName: 'modulo', AttributeType: 'S' },
      { AttributeName: 'createdAt', AttributeType: 'S' },
    ],
    KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'idx_accion',
        KeySchema: [{ AttributeName: 'accion', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
      {
        IndexName: 'idx_modulo',
        KeySchema: [{ AttributeName: 'modulo', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
      {
        IndexName: 'idx_createdAt',
        KeySchema: [{ AttributeName: 'createdAt', KeyType: 'HASH' }],
        Projection: { ProjectionType: 'ALL' },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST',
  },
]

async function createDynamoTables() {
  for (const table of TABLES) {
    try {
      await client.send(new CreateTableCommand(table))
      console.log(`✅ Tabla creada: ${table.TableName}`)
    } catch (error: any) {
      if (error.name === 'ResourceInUseException') {
        console.log(`⏭️  Tabla ya existe: ${table.TableName}`)
      } else {
        console.error(`❌ Error creando ${table.TableName}:`, error.message)
      }
    }
  }
}

createDynamoTables()
