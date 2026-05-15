import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import api from '../../../../config/api'
import { registrationFormSchema } from '../../../registrations/schemas/registration.schema'
import type { Event } from '../../types/event.types'

interface Props {
  evento: Event
  onClose: () => void
}

export default function ModalInscripcion({ evento, onClose }: Props) {
  const form = useForm({
    defaultValues: {
      event_id: evento.id,
      full_name: '',
      dni: '',
      email: '',
      phone: '',
    },

    validators: {
      onMount: ({ value }) => {
        const result = registrationFormSchema.safeParse(value)
        if (!result.success) {
          return result.error.issues.map(issue => issue.message)
        }
        return undefined
      },
      onChange: ({ value }) => {
        const result = registrationFormSchema.safeParse(value)
        if (!result.success) {
          return result.error.issues.map(issue => issue.message)
        }
        return undefined
      },
    },

    onSubmit: async ({ value }) => {
      try {
        await api.post('/registrations', value)
        toast.success('¡Inscripción exitosa! Nos vemos en la carrera')
        onClose()
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Error al inscribir')
      }
    },
  })

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#111] border border-[#f97316]/25 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div>
            <p className="text-[#f97316] text-xs font-bold uppercase tracking-wider">Inscripción</p>
            <h2 className="text-white font-bold text-lg">{evento.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="p-4 space-y-4"
        >
          <form.Field name="full_name">
            {(field) => (
              <div>
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Nombre completo"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-white/30 focus:border-[#f97316] focus:outline-none"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Field name="dni">
            {(field) => (
              <div>
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="DNI"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-white/30 focus:border-[#f97316] focus:outline-none"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <div>
                <input
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Correo electrónico"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-white/30 focus:border-[#f97316] focus:outline-none"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
                ))}
              </div>
            )}
          </form.Field>

          {/* Teléfono */}
          <form.Field name="phone">
            {(field) => (
              <div>
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Teléfono"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-white/30 focus:border-[#f97316] focus:outline-none"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="w-full bg-[#f97316] hover:bg-[#ea6a0a] text-white py-2.5 rounded-lg font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Inscribiendo...' : 'Confirmar inscripción'}
              </button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </div>
  )
}