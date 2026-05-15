import { ErrorMessages } from './error-messages'

export const ValidationDescriptions: Record<string, string> = Object
  .values(ErrorMessages)
  .filter(msg => msg.public)
  .reduce((acc, msg) => {
    acc[msg.code] = msg.description
    return acc
  }, {} as Record<string, string>)