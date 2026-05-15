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
    .min(1, msg.EVT_005)
    .regex(/^\d{4}-\d{2}-\d{2}$/, msg.EVT_006),

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
    .number({ message: msg.EVT_012 })
    .min(0, msg.EVT_013)
    .max(999999.99, msg.EVT_017),

  max_slots: z
    .number({ message: msg.EVT_014 })
    .int(msg.EVT_015)
    .min(0, msg.EVT_016)
    .max(99999, msg.EVT_018)
    .default(0),

  image_url: z
    .string()
    .url(msg.EVT_019)
    .optional()
    .or(z.literal('')),

  status: z
    .enum(['active', 'inactive', 'finished'])
    .default('inactive'),
})

export type EventFormData = z.infer<typeof eventFormSchema>