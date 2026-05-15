import { useForm } from '@tanstack/react-form'
import { motion } from 'framer-motion'
import { User, IdCard, Mail, Phone, Calendar } from 'lucide-react'
import { useEvents } from '../../events/hooks/useEvents'
import SearchableSelect from '../../../shared/components/SearchableSelect'
import { registrationFormSchema } from '../../registrations/schemas/registration.schema'
import api from '../../../config/api'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export default function RegisterRunnerPage() {
  const { data: events } = useEvents()
  const navigate = useNavigate()

  const activeEvents = events?.filter(e => e.status === 'active') || []

  const form = useForm({
    defaultValues: {
      event_id: 0,
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
      if (!value.event_id) {
        toast.error('Selecciona un evento')
        return
      }
      try {
        await api.post('/registrations', value)
        toast.success('¡Corredor inscrito exitosamente!')
        navigate('/registrations')
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Error al inscribir')
      }
    },
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto px-0 sm:px-4"
    >
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-[#e2e8f0]">Inscribir Corredor</h1>
        <p className="text-[#94a3b8] text-xs sm:text-sm mt-1">
          Registra un corredor en un evento activo
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="bg-[#171923] border border-white/5 rounded-xl p-4 sm:p-6 space-y-4"
      >
        <div>
          <label className="block text-[#94a3b8] text-xs mb-1 flex items-center gap-1">
            <Calendar size={14} /> Evento
          </label>
          <form.Field name="event_id">
            {(field) => (
              <div>
                <SearchableSelect
                  options={activeEvents}
                  value={field.state.value}
                  onChange={(id) => field.handleChange(id)}
                  placeholder="Seleccionar evento..."
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
                ))}
              </div>
            )}
          </form.Field>
        </div>

        <form.Field name="full_name">
          {(field) => (
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Nombre completo"
                  className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
                />
              </div>
              {field.state.meta.errors.map((error) => (
                <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Field name="dni">
          {(field) => (
            <div>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="DNI"
                  className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
                />
              </div>
              {field.state.meta.errors.map((error) => (
                <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Field name="email">
          {(field) => (
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
                <input
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Correo electrónico"
                  className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
                />
              </div>
              {field.state.meta.errors.map((error) => (
                <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Field name="phone">
          {(field) => (
            <div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Teléfono"
                  className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
                />
              </div>
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
              className="w-full bg-[#f97316] hover:bg-[#ea6a0a] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Inscribiendo...
                </>
              ) : (
                'Inscribir Corredor'
              )}
            </button>
          )}
        </form.Subscribe>
      </form>
    </motion.div>
  )
}