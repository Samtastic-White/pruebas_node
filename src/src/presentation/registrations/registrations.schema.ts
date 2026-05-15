import { z } from 'zod'
import { ErrorCodes } from '../../common/errors'
import { ErrorMessages } from '../../common/errors'

const msg = (code: string) => {
  const errorCode = ErrorCodes[code as keyof typeof ErrorCodes]
  return JSON.stringify(ErrorMessages[errorCode as keyof typeof ErrorMessages])
}

export const createRegistrationSchema = z.object({
  event_id: z
    .number()
    .int()
    .positive(msg('REG_EVENT_ID_REQUIRED')),

  full_name: z
    .string()
    .min(1, msg('REG_FULL_NAME_REQUIRED'))
    .max(100, msg('REG_FULL_NAME_MAX_LENGTH')),

  dni: z
    .string()
    .min(1, msg('REG_DNI_REQUIRED'))
    .max(20, msg('REG_DNI_MAX_LENGTH'))
    .regex(/^\d+$/, msg('REG_DNI_INVALID')),

  email: z
    .string()
    .min(1, msg('REG_EMAIL_REQUIRED'))
    .email(msg('REG_EMAIL_INVALID'))
    .max(150, msg('REG_EMAIL_MAX_LENGTH')),

  phone: z
    .string()
    .min(1, msg('REG_PHONE_REQUIRED'))
    .max(20, msg('REG_PHONE_MAX_LENGTH'))
    .regex(/^\d+$/, msg('REG_DNI_INVALID')),
})

export type CreateRegistrationInput = z.infer<typeof createRegistrationSchema>