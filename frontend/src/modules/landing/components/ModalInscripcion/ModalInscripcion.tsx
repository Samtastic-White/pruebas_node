import { useState } from 'react'
import { toast } from 'sonner'
import api from '../../../../config/api'
import type { Event } from '../../types/event.types'

interface Props {
  evento: Event
  onClose: () => void
}

export default function ModalInscripcion({ evento, onClose }: Props) {
  const [form, setForm] = useState({
    full_name: '',
    dni: '',
    email: '',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/registrations', { event_id: evento.id, ...form })
      setSuccess(true)
      toast.success('¡Inscripción exitosa!')
      setTimeout(onClose, 2000)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al inscribir')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#111] border border-[#f97316]/25 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div>
            <p className="text-[#f97316] text-xs font-bold uppercase tracking-wider">Inscripción</p>
            <h2 className="text-white font-bold text-lg">{evento.name}</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-[#22c55e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" width="32" height="32"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <p className="text-white font-bold text-xl">¡Inscripción exitosa!</p>
            <p className="text-white/50 text-sm mt-1">Nos vemos en la carrera</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <input
              placeholder="Nombre completo"
              value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-white/30 focus:border-[#f97316] focus:outline-none"
              required
            />
            <input
              placeholder="DNI"
              value={form.dni}
              onChange={e => setForm({ ...form, dni: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-white/30 focus:border-[#f97316] focus:outline-none"
              required
            />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-white/30 focus:border-[#f97316] focus:outline-none"
              required
            />
            <input
              placeholder="Teléfono"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-white/30 focus:border-[#f97316] focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f97316] hover:bg-[#ea6a0a] text-white py-2.5 rounded-lg font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
            >
              {loading ? 'Inscribiendo...' : 'Confirmar inscripción'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}