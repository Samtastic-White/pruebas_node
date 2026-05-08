import mongoose from 'mongoose'
import { envs } from '../../config/environments'

export const connectMongo = async () => {
  try {
    
    const hasCredentials = Boolean(envs.MONGO_USER && envs.MONGO_PASSWORD)
    const credentials = hasCredentials
      ? `${encodeURIComponent(envs.MONGO_USER)}:${encodeURIComponent(envs.MONGO_PASSWORD)}@`
      : ''
    const uri = await `mongodb://${credentials}${envs.MONGO_HOST}:${envs.MONGO_PORT}/${envs.MONGO_DB}`

    console.log("entro", {
        host: envs.MONGO_HOST,
        port: envs.MONGO_PORT,
        db: envs.MONGO_DB,
        uri,
    })
    const connection = await mongoose.connect(uri, {
      authSource: hasCredentials ? 'admin' : undefined,
      serverSelectionTimeoutMS: 5000,
    })
    
    console.log(`✅ MongoDB conectado: ${connection.connection.host}`)
    return connection
  } catch (error) {
    console.error(`❌ Error MongoDB: ${String(error)}`)
    throw error
  }
}