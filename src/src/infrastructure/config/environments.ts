export const envs = {
  PORT: Number(process.env.PORT) || 4000,
  NODE_ENV: String(process.env.NODE_ENV) || 'local',
  SERVICE_NAME: String(process.env.SERVICE_NAME) || 'marathon_backend',
  LOG_LEVEL: String(process.env.LOG_LEVEL) || 'debug',
  
  DB_HOST: String(process.env.DB_HOST),
  DB_NAME: String(process.env.DB_NAME),
  DB_PASSWORD: String(process.env.DB_PASSWORD),
  DB_PORT: Number(process.env.DB_PORT),
  DB_USER: String(process.env.DB_USER),
  
  JWT_SECRET: String(process.env.JWT_SECRET),
  JWT_EXPIRES_IN: String(process.env.JWT_EXPIRES_IN),
  
  DOCS_USERNAME: String(process.env.DOCS_USERNAME),
  DOCS_PASSWORD: String(process.env.DOCS_PASSWORD),
  
  MONGO_USER: String(process.env.MONGO_USER),
  MONGO_PASSWORD: String(process.env.MONGO_PASSWORD),
  MONGO_HOST: String(process.env.MONGO_HOST),
  MONGO_PORT: Number(process.env.MONGO_PORT),
  MONGO_DB: String(process.env.MONGO_DB),
}