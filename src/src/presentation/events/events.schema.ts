import { z } from 'zod'
import { ErrorCodes } from '../../common/errors'
import { ErrorMessages } from '../../common/errors'

const msg = (code: string) => {
  const errorCode = ErrorCodes[code as keyof typeof ErrorCodes]
  return JSON.stringify(ErrorMessages[errorCode as keyof typeof ErrorMessages])
}

export const createEventSchema = z.object({
  name: z
    .string()
    .min(1, msg('EVENT_NAME_REQUIRED'))
    .min(3, msg('EVENT_NAME_MIN_LENGTH'))
    .max(150, msg('EVENT_NAME_MAX_LENGTH')),

  description: z
    .string()
    .max(500, msg('EVENT_DESCRIPTION_MAX_LENGTH'))
    .optional()
    .nullable(),

  event_date: z
    .string()
    .min(1, msg('EVENT_DATE_REQUIRED'))
    .regex(/^\d{4}-\d{2}-\d{2}$/, msg('EVENT_DATE_INVALID')),

  event_time: z
    .string()
    .min(1, msg('EVENT_TIME_REQUIRED')),

  location: z
    .string()
    .min(1, msg('EVENT_LOCATION_REQUIRED'))
    .max(200, msg('EVENT_LOCATION_MAX_LENGTH')),

  distance: z
    .string({ message: msg('EVENT_PRICE_INVALID_TYPE') })
    .min(1, msg('EVENT_DISTANCE_REQUIRED'))
    .max(20, msg('EVENT_DISTANCE_MAX_LENGTH')),

  price: z
    .number()
    .min(0, msg('EVENT_PRICE_NEGATIVE'))
    .max(999999.99, msg('EVENT_PRICE_MAX')),

  max_slots: z
    .number({ message: msg('EVENT_SLOTS_INVALID_TYPE') })
    .int(msg('EVENT_SLOTS_NOT_INT'))
    .min(1, msg('EVENT_SLOTS_MIN'))
    .max(99999, msg('EVENT_SLOTS_MAX'))
    .default(0),

  image_url: z
    .string()
    .url(msg('EVENT_IMAGE_URL_INVALID'))
    .optional()
    .nullable()
    .or(z.literal('')),

  status: z
    .enum(['active', 'inactive', 'finished'])
    .default('inactive'),
})

export const updateEventSchema = createEventSchema.partial()

export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>