import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, IdCard, Mail, Phone, Calendar } from 'lucide-react'
import { useEvents } from '../../events/hooks/useEvents'
import SearchableSelect from '../../../shared/components/SearchableSelect'
import api from '../../../config/api'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export default function RegisterRunnerPage() {
  const { data: events } = useEvents()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [form, setForm] = useState({
    event_id: 0,
    full_name: '',
    dni: '',
    email: '',
    phone: '',
  })

  const activeEvents = events?.filter(e => e.status === 'active') || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/registrations', form)
      toast.success('¡Corredor inscrito exitosamente!')
      navigate('/registrations')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al inscribir')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#e2e8f0]">Inscribir Corredor</h1>
        <p className="text-[#94a3b8] text-sm mt-1">Registra un corredor en un evento activo</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#171923] border border-white/5 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-[#94a3b8] text-xs mb-1 flex items-center gap-1">
            <Calendar size={14} /> Evento
          </label>
          <SearchableSelect
            options={activeEvents}
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
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#f97316] hover:bg-[#ea6a0a] text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Inscribiendo...' : 'Inscribir Corredor'}
        </button>
      </form>
    </motion.div>
  )
}