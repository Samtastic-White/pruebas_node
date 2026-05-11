import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, User, IdCard, Mail, Phone } from 'lucide-react'
import SearchableSelect from '../../../shared/components/SearchableSelect'

interface Props {
  events: Array<{ id: number; name: string }>
  onClose: () => void
  onSubmit: (data: any) => void
  loading?: boolean
}

export default function RegistrationForm({ events, onClose, onSubmit, loading }: Props) {
  const [form, setForm] = useState({
    event_id: events[0]?.id || 0,
    full_name: '',
    dni: '',
    email: '',
    phone: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#171923] border border-white/5 rounded-xl w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#e2e8f0]">Inscribir Corredor</h2>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#94a3b8] text-xs mb-1">Evento</label>
            <SearchableSelect
              options={events}
              value={form.event_id}
              onChange={(id) => setForm({ ...form, event_id: id })}
              placeholder="Seleccionar evento..."
            />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
            <input
              placeholder="Nombre completo"
              value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })}
              className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
              required
            />
          </div>
          <div className="relative">
            <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
            <input
              placeholder="DNI"
              value={form.dni}
              onChange={e => setForm({ ...form, dni: e.target.value })}
              className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
              required
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
              required
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
            <input
              placeholder="Teléfono"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-white/5 text-[#e2e8f0] py-2.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#f97316] hover:bg-[#ea6a0a] text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Inscribiendo...' : 'Inscribir'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}