import knex, { type Knex } from 'knex'
import { envs } from '../../config/environments'

export const db: Knex = knex({
  client: 'pg',
  connection: {
    database: envs.DB_NAME,
    host: envs.DB_HOST,
    password: envs.DB_PASSWORD,
    port: envs.DB_PORT,
    user: envs.DB_USER,
  },
  pool: {
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 3000,
    max: 15,
    min: 0,
  },
})

export default db