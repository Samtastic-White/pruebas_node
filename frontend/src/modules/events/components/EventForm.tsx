import { useForm } from '@tanstack/react-form'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { eventFormSchema } from '../schemas/event.schema'
import type { Event } from '../types/event.types'

interface Props {
  event?: Event | null
  onClose: () => void
  onSubmit: (data: any) => void
  loading?: boolean
}

export default function EventForm({ event, onClose, onSubmit, loading }: Props) {
  const form = useForm({
    defaultValues: {
      name: event?.name || '',
      description: event?.description || '',
      event_date: event?.event_date?.split('T')[0] || '',
      event_time: event?.event_time?.slice(0, 5) || '',
      location: event?.location || '',
      distance: event?.distance || '10K',
      price: Number(event?.price) || 0,
      max_slots: event?.max_slots || 0,
      image_url: event?.image_url || '',
      status: (event?.status || 'inactive') as 'active' | 'inactive' | 'finished',
    },

    validators: {
      onChange: ({ value }) => {
        const result = eventFormSchema.safeParse(value)
        if (!result.success) {
          return result.error.issues.map(issue => issue.message)
        }
        return undefined
      },
      onSubmit: ({ value }) => {
        const result = eventFormSchema.safeParse(value)
        if (!result.success) {
          return result.error.issues.map(issue => issue.message)
        }
        return undefined
      },
    },

    onSubmit: ({ value }) => {
      onSubmit(value)
    },
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#171923] border border-white/5 rounded-none sm:rounded-xl w-full sm:max-w-lg h-full sm:h-auto overflow-y-auto p-4 sm:p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#e2e8f0]">
            {event ? 'Editar Evento' : 'Nuevo Evento'}
          </h2>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-4"
        >
          <form.Field name="name">
            {(field) => (
              <div>
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Nombre del evento"
                  className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <textarea
                value={field.state.value || ''}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Descripción"
                className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none resize-none h-20"
              />
            )}
          </form.Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <form.Field name="event_date">
              {(field) => (
                <div>
                  <input
                    type="date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-[#e2e8f0] focus:border-[#f97316] focus:outline-none [color-scheme:dark]"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="event_time">
              {(field) => (
                <div>
                  <input
                    type="time"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-[#e2e8f0] focus:border-[#f97316] focus:outline-none [color-scheme:dark]"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="location">
            {(field) => (
              <div>
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Lugar"
                  className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
                ))}
              </div>
            )}
          </form.Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <form.Field name="distance">
              {(field) => (
                <div>
                  <label className="block text-[#94a3b8] text-xs mb-1">Distancia</label>
                  <input
                    type="text"
                    list="distancias"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="10K, 21K..."
                    className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
                  />
                  <datalist id="distancias">
                    <option value="3K" /><option value="5K" /><option value="8K" />
                    <option value="10K" /><option value="15K" /><option value="21K" />
                    <option value="42K" /><option value="50K" /><option value="80K" />
                    <option value="100K" /><option value="Trail" /><option value="Ultra" />
                    <option value="Cross" /><option value="Relevos" />
                  </datalist>
                  {field.state.meta.errors.map((error) => (
                    <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="price">
              {(field) => (
                <div>
                  <label className="block text-[#94a3b8] text-xs mb-1">Precio ($)</label>
                  <input
                    type="number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    placeholder="25.00"
                    className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="max_slots">
              {(field) => (
                <div>
                  <label className="block text-[#94a3b8] text-xs mb-1">Cupos</label>
                  <input
                    type="number"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    placeholder="0 = ilimitado"
                    className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
                  ))}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="image_url">
            {(field) => (
              <div>
                <label className="block text-[#94a3b8] text-xs mb-1">Imagen URL</label>
                <input
                  type="url"
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
                ))}
              </div>
            )}
          </form.Field>

          {event && (
            <form.Field name="status">
              {(field) => (
                <select
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value as 'active' | 'inactive' | 'finished')}
                  className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-[#e2e8f0] focus:border-[#f97316] focus:outline-none"
                >
                  <option value="inactive">Inactivo</option>
                  <option value="active">Activo</option>
                  <option value="finished">Finalizado</option>
                </select>
              )}
            </form.Field>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-white/5 text-[#e2e8f0] py-2.5 rounded-lg hover:bg-white/5 transition-colors text-sm"
            >
              Cancelar
            </button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit || loading}
                  className="flex-1 bg-[#f97316] hover:bg-[#ea6a0a] text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm"
                >
                  {loading || isSubmitting ? 'Guardando...' : event ? 'Actualizar' : 'Crear'}
                </button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </motion.div>
    </div>
  )
}