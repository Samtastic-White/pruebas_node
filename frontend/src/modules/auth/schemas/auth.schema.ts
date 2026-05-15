import { z } from 'zod'
import { validationMessages as msg } from '../../../shared/constants/validation-messages'

export const loginFormSchema = z.object({
  username: z
    .string()
    .min(1, msg.AUT_001)
    .max(50, msg.AUT_003),

  password: z
    .string()
    .min(1, msg.AUT_004)
    .max(100, msg.AUT_005),
})

export const changePasswordFormSchema = z.object({
  username: z.string().min(1, msg.AUT_001),
  oldPassword: z.string().min(1, msg.AUT_004),
  newPassword: z.string().min(6, msg.AUT_009).max(100, msg.AUT_005),
  confirmPassword: z.string().min(1, 'Debes confirmar la contraseña'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
}).refine(data => data.oldPassword !== data.newPassword, {
  message: msg.AUT_010,
  path: ['newPassword'],
})

export type LoginFormData = z.infer<typeof loginFormSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>