export class CustomError extends Error {
  statusCode: number
  code: string
  description: string

  constructor(statusCode: number, code: string, description: string) {
    super(description)
    this.statusCode = statusCode
    this.code = code
    this.description = description
  }

  static notFound(message = 'Recurso no encontrado'): CustomError {
    return new CustomError(404, 'NOT_FOUND', message)
  }

  static badRequest(message: string): CustomError {
    return new CustomError(400, 'BAD_REQUEST', message)
  }

  static unauthorized(message = 'No autorizado'): CustomError {
    return new CustomError(401, 'UNAUTHORIZED', message)
  }

  static internal(message = 'Error interno'): CustomError {
    return new CustomError(500, 'INTERNAL_ERROR', message)
  }
}