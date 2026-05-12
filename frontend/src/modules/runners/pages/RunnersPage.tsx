import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, IdCard, Mail, Phone, Calendar, History } from 'lucide-react'
import api from '../../../config/api'
import { toast } from 'sonner'
import type { RunnerWithHistory } from '../types/runner.types'

export default function RunnersPage() {
  const [dni, setDni] = useState('')
  const [runner, setRunner] = useState<RunnerWithHistory | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dni.trim()) return
    
    setLoading(true)
    setNotFound(false)
    setRunner(null)
    
    try {
      const data = await api.get(`/runners/${dni}`).then(r => r.data)
      setRunner(data)
    } catch (error: any) {
      if (error.response?.status === 404) {
        setNotFound(true)
      } else {
        toast.error('Error al buscar corredor')
      }
    } finally {
      setLoading(false)
    }
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      confirmed: 'bg-[#22c55e]/10 text-[#22c55e]',
      cancelled: 'bg-[#ef4444]/10 text-[#ef4444]',
    }
    const labels: Record<string, string> = {
      confirmed: 'Confirmado', cancelled: 'Cancelado'
    }
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-white/5 text-[#94a3b8]'}`}>
        {labels[status] || status}
      </span>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#e2e8f0]">Corredores</h1>
        <p className="text-[#94a3b8] text-sm mt-1">Busca corredores por DNI y consulta su historial</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
          <input
            type="text"
            placeholder="Ingresa el DNI del corredor..."
            value={dni}
            onChange={e => setDni(e.target.value)}
            className="w-full bg-[#171923] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-[#f97316] hover:bg-[#ea6a0a] text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Search size={18} />
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {loading && (
        <div className="flex items-center justify-center h-32">
          <div className="w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {notFound && (
        <div className="bg-[#171923] border border-[#ef4444]/20 rounded-xl p-6 text-center">
          <p className="text-[#ef4444] font-medium">Corredor no encontrado</p>
          <p className="text-[#94a3b8] text-sm mt-1">No se encontró un corredor con el DNI {dni}</p>
        </div>
      )}

      {runner && (
        <div className="space-y-6">
          <div className="bg-[#171923] border border-white/5 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-[#e2e8f0] mb-4">Datos del Corredor</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f97316]/10 rounded-lg flex items-center justify-center">
                  <IdCard className="text-[#f97316]" size={20} />
                </div>
                <div>
                  <p className="text-[#94a3b8] text-xs">DNI</p>
                  <p className="text-[#e2e8f0] font-medium">{runner.dni}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#22c55e]/10 rounded-lg flex items-center justify-center">
                  <Mail className="text-[#22c55e]" size={20} />
                </div>
                <div>
                  <p className="text-[#94a3b8] text-xs">Email</p>
                  <p className="text-[#e2e8f0] font-medium">{runner.email || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#8b5cf6]/10 rounded-lg flex items-center justify-center">
                  <Phone className="text-[#8b5cf6]" size={20} />
                </div>
                <div>
                  <p className="text-[#94a3b8] text-xs">Teléfono</p>
                  <p className="text-[#e2e8f0] font-medium">{runner.phone || '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#eab308]/10 rounded-lg flex items-center justify-center">
                  <Calendar className="text-[#eab308]" size={20} />
                </div>
                <div>
                  <p className="text-[#94a3b8] text-xs">Registrado</p>
                  <p className="text-[#e2e8f0] font-medium">
                    {new Date(runner.created_at.split('T')[0] + 'T12:00:00').toLocaleDateString('es-CO')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#171923] border border-white/5 rounded-xl overflow-x-auto">
            <div className="p-4 border-b border-white/5 flex items-center gap-2">
              <History size={18} className="text-[#f97316]" />
              <h2 className="text-lg font-semibold text-[#e2e8f0]">Historial de Carreras</h2>
            </div>
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="py-3 px-4 text-[#94a3b8] font-medium text-sm">Evento</th>
                  <th className="py-3 px-4 text-[#94a3b8] font-medium text-sm">Fecha</th>
                  <th className="py-3 px-4 text-[#94a3b8] font-medium text-sm">Estado</th>
                  <th className="py-3 px-4 text-[#94a3b8] font-medium text-sm">Inscripción</th>
                </tr>
              </thead>
              <tbody>
                {runner.inscriptions?.map((ins, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="py-3 px-4 text-[#e2e8f0]">{ins.name}</td>
                    <td className="py-3 px-4 text-[#94a3b8] text-sm">
                      {new Date(ins.event_date.split('T')[0] + 'T12:00:00').toLocaleDateString('es-CO')}
                    </td>
                    <td className="py-3 px-4">{statusBadge(ins.status)}</td>
                    <td className="py-3 px-4 text-[#94a3b8] text-sm">
                      {new Date(ins.created_at.split('T')[0] + 'T12:00:00').toLocaleDateString('es-CO')}
                    </td>
                  </tr>
                ))}
                {!runner.inscriptions?.length && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#94a3b8]">
                      Sin carreras registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  )
}