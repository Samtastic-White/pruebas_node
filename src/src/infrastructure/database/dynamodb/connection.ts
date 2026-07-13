import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { envs } from '../../config/environments'

export const client = new DynamoDBClient({
  region: envs.AWS_REGION,
  credentials: {
    accessKeyId: envs.AWS_ACCESS_KEY_ID,
    secretAccessKey: envs.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: envs.DYNAMO_ENDPOINT || undefined,
})

export const docClient = DynamoDBDocumentClient.from(client)

export const connectDynamoDB = async () => {
  try {
    await client.config.region()
    console.log(`✅ DynamoDB conectado: ${envs.AWS_REGION}`)
  } catch (error) {
    console.error(`❌ Error DynamoDB: ${String(error)}`)
    throw error
  }
}