import mongoose, { Schema } from 'mongoose'

const logSuccessSchema = new Schema(
  {
    accion: { type: String, required: true, index: true },
    usuario: { type: String, required: true },
    modulo: { type: String, required: true, default: 'unknown', index: true },
    endpoint: { type: String, required: false },
    metodo: { type: String, required: false, index: true },
    detalles: { type: Schema.Types.Mixed, default: {} },
    ip: { type: String, required: false },
    status_code: { type: Number, required: false },
    duration: { type: Number, required: false },
  },
  {
    collection: 'success_logs',
    timestamps: true,
  }
)

export const LogSuccessModel = mongoose.models.LogSuccess || mongoose.model('LogSuccess', logSuccessSchema)