import 'dotenv/config'
import { ScanCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from './connection'

async function checkLogs() {
  for (const table of ['success_logs', 'errors_logs']) {
    const result = await docClient.send(
      new ScanCommand({
        TableName: table,
        Limit: 5,
      })
    )
    console.log(`\n📦 ${table} (${result.Items?.length || 0} registros)`)
    if (result.Items?.length) {
      console.table(result.Items.map(({ id, ...rest }) => rest))
    }
  }
}

checkLogs()
