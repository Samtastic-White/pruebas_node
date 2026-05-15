import { z } from 'zod'
import { validationMessages as msg } from '../../../shared/constants/validation-messages'

export const registrationFormSchema = z.object({
  event_id: z
    .number({ message: msg.REG_001 })
    .int()
    .positive(msg.REG_001),

  full_name: z
    .string()
    .min(1, msg.REG_002)
    .max(100, msg.REG_003),

  dni: z
    .string()
    .min(1, msg.REG_004)
    .max(20, msg.REG_005),

  email: z
    .string()
    .min(1, msg.REG_006)
    .email(msg.REG_008)
    .max(150, msg.REG_007),

  phone: z
    .string()
    .min(1, msg.REG_009)
    .max(20, msg.REG_010),
})

export type RegistrationFormData = z.infer<typeof registrationFormSchema>