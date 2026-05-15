import { z } from 'zod'
import { ErrorCodes } from '../../common/errors'
import { ErrorMessages } from '../../common/errors'

const msg = (code: string) => {
  const errorCode = ErrorCodes[code as keyof typeof ErrorCodes]
  return JSON.stringify(ErrorMessages[errorCode as keyof typeof ErrorMessages])
}

export const runnerDniSchema = z.object({
  dni: z
    .string()
    .min(1, msg('RUN_DNI_REQUIRED'))
    .regex(/^\d+$/, msg('RUN_DNI_INVALID')),
})

export type RunnerDniInput = z.infer<typeof runnerDniSchema>