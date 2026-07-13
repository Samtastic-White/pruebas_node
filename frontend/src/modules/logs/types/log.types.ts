export interface LogEntry {
  id: string
  accion: string
  usuario: string
  modulo: string
  createdAt: string
  detalles?: Record<string, unknown>
  mensaje?: string
  stack?: string
}
