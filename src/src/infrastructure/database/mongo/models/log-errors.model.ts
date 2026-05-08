import mongoose, { Schema } from 'mongoose'

const logErrorSchema = new Schema(
  {
    accion: { type: String, required: true, index: true },
    usuario: { type: String, required: true },
    modulo: { type: String, required: true, default: 'unknown', index: true },
    endpoint: { type: String, required: false },
    metodo: { type: String, required: false, index: true },
    detalles: { type: Schema.Types.Mixed, default: {} },
    mensaje: { type: String, required: false },
    stack: { type: String, required: false },
    ip: { type: String, required: false },
    status_code: { type: Number, required: false, index: true },
  },
  {
    collection: 'errors_logs',
    timestamps: true,
  }
)

export const LogErrorModel = mongoose.models.LogError || mongoose.model('LogError', logErrorSchema)