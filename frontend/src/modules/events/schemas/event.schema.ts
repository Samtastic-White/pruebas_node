import { z } from 'zod'
import { validationMessages as msg } from '../../../shared/constants/validation-messages'

export const eventFormSchema = z.object({
  name: z
    .string()
    .min(1, msg.EVT_001)
    .min(3, msg.EVT_002)
    .max(150, msg.EVT_003),

  description: z
    .string()
    .max(500, msg.EVT_004)
    .optional(),

  event_date: z
    .string()
    .min(1, msg.EVT_005),

  event_time: z
    .string()
    .min(1, msg.EVT_007),

  location: z
    .string()
    .min(1, msg.EVT_008)
    .max(200, msg.EVT_009),

  distance: z
    .string()
    .min(1, msg.EVT_010)
    .max(20, msg.EVT_011),

  price: z
    .number({ message: 'Debe ser un número' })
    .min(0, msg.EVT_012)
    .max(999999.99, msg.EVT_013),

  max_slots: z
    .number({ message: 'Debe ser un número' })
    .int('Debe ser un número entero')
    .min(0, msg.EVT_014)
    .max(99999, msg.EVT_015),

  image_url: z
    .string()
    .url('URL de imagen inválida')
    .optional()
    .or(z.literal('')),

  status: z
    .enum(['active', 'inactive', 'finished'])
    .default('inactive'),
})

export type EventFormData = z.infer<typeof eventFormSchema>