import { z } from 'zod'
import { ErrorCodes } from '../../common/errors'
import { ErrorMessages } from '../../common/errors'

const msg = (code: string) => {
  const errorCode = ErrorCodes[code as keyof typeof ErrorCodes]
  return JSON.stringify(ErrorMessages[errorCode as keyof typeof ErrorMessages])
}

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, msg('AUTH_USERNAME_REQUIRED'))
    .max(50, msg('AUTH_USERNAME_MAX_LENGTH')),

  password: z
    .string()
    .min(1, msg('AUTH_PASSWORD_REQUIRED'))
    .max(100, msg('AUTH_PASSWORD_MAX_LENGTH')),
})

export const changePasswordSchema = z.object({
  username: z
    .string()
    .min(1, msg('AUTH_USERNAME_REQUIRED')),

  oldPassword: z
    .string()
    .min(1, msg('AUTH_PASSWORD_REQUIRED')),

  newPassword: z
    .string()
    .min(6, msg('AUTH_NEW_PASSWORD_MIN'))
    .max(100, msg('AUTH_PASSWORD_MAX_LENGTH')),
}).refine(data => data.oldPassword !== data.newPassword, {
  message: msg('AUTH_PASSWORD_SAME'),
  path: ['newPassword'],
})

export type LoginInput = z.infer<typeof loginSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>