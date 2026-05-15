import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import { useRegistrations } from '../hooks/useRegistrations'
import { useEvents } from '../../events/hooks/useEvents'
import RegistrationForm from '../components/RegistrationForm'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import ExportButton from '../../../shared/components/ExportButton'
import api from '../../../config/api'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export default function RegistrationsPage() {
  const { data: registrations, isLoading } = useRegistrations()
  const { data: events } = useEvents()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const debouncedSearch = useDebounce(search, 500)
  const queryClient = useQueryClient()

  const activeEvents = events?.filter(e => e.status === 'active') || []

  const handleCreate = async (data: any) => {
    setLoading(true)
    try {
      await api.post('/registrations', data)
      toast.success('Corredor inscrito exitosamente')
      queryClient.invalidateQueries({ queryKey: ['registrations'] })
      setShowForm(false)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al inscribir')
    } finally {
      setLoading(false)
    }
  }

  const cancelMutation = useMutation({
    mutationFn: (id: number) => api.put(`/registrations/${id}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] })
      toast.success('Inscripción cancelada')
    },
    onError: () => toast.error('Error al cancelar'),
  })

  const filtered = registrations?.filter(r => {
    const fullName = r.full_name || ''
    const dni = r.dni || ''
    const eventName = r.event_name || ''
    const searchLower = debouncedSearch.toLowerCase()

    const matchSearch =
      fullName.toLowerCase().includes(searchLower) ||
      dni.includes(debouncedSearch) ||
      eventName.toLowerCase().includes(searchLower)

    const eventStatus = events?.find(e => e.id === r.event_id)?.status
    const matchStatus = statusFilter === 'all' || eventStatus === statusFilter

    return matchSearch && matchStatus
  })

  const exportData = filtered?.map(r => ({
    corredor: r.full_name,
    dni: r.dni,
    email: r.email || '',
    telefono: r.phone || '',
    evento: r.event_name,
    fecha: r.created_at
      ? new Date(r.created_at.split('T')[0] + 'T12:00:00').toLocaleDateString('es-CO')
      : '',
    estado: r.status === 'confirmed' ? 'Confirmado' : 'Cancelado',
  })) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#f97316] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#e2e8f0]">Inscripciones</h1>
          <p className="text-[#94a3b8] text-xs sm:text-sm mt-1">Gestiona los corredores inscritos</p>
        </div>
        <div className="flex gap-2">
          <ExportButton
            data={exportData}
            columns={[
              { header: 'Corredor', key: 'corredor', width: 30 },
              { header: 'DNI', key: 'dni', width: 15 },
              { header: 'Email', key: 'email', width: 30 },
              { header: 'Teléfono', key: 'telefono', width: 15 },
              { header: 'Evento', key: 'evento', width: 30 },
              { header: 'Fecha Inscripción', key: 'fecha', width: 16 },
              { header: 'Estado', key: 'estado', width: 12 },
            ]}
            filename={`inscripciones-${new Date().toISOString().split('T')[0]}`}
            templateKey="registrations"
          />
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 sm:gap-2 bg-[#f97316] hover:bg-[#ea6a0a] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Inscribir Corredor</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
          <input
            type="text"
            placeholder="Buscar por corredor, DNI o evento..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#171923] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#171923] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-[#e2e8f0] focus:border-[#f97316] focus:outline-none w-full sm:w-44"
        >
          <option value="all">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
          <option value="finished">Finalizados</option>
        </select>
      </div>

      <div className="bg-[#171923] border border-white/5 rounded-xl overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="border-b border-white/5">
              <th className="py-3 px-4 text-[#94a3b8] font-medium text-sm">Corredor</th>
              <th className="py-3 px-4 text-[#94a3b8] font-medium text-sm">DNI</th>
              <th className="py-3 px-4 text-[#94a3b8] font-medium text-sm">Email</th>
              <th className="py-3 px-4 text-[#94a3b8] font-medium text-sm">Evento</th>
              <th className="py-3 px-4 text-[#94a3b8] font-medium text-sm">Fecha</th>
              <th className="py-3 px-4 text-[#94a3b8] font-medium text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map((r) => (
              <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-4 text-[#e2e8f0] font-medium text-sm">{r.full_name}</td>
                <td className="py-3 px-4 text-[#94a3b8] text-sm">{r.dni}</td>
                <td className="py-3 px-4 text-[#94a3b8] text-sm">{r.email}</td>
                <td className="py-3 px-4 text-[#94a3b8] text-sm">{r.event_name}</td>
                <td className="py-3 px-4 text-[#94a3b8] text-sm">
                  {r.created_at ? new Date(r.created_at.split('T')[0] + 'T12:00:00').toLocaleDateString('es-CO') : '-'}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => { if (confirm('¿Cancelar esta inscripción?')) cancelMutation.mutate(r.id) }}
                    className="text-[#ef4444] hover:bg-[#ef4444]/10 px-2 py-1 rounded text-xs font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
            {filtered?.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#94a3b8]">
                  {search || statusFilter !== 'all'
                    ? 'No se encontraron inscripciones con esos filtros'
                    : 'No hay inscripciones registradas'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <RegistrationForm
          events={activeEvents}
          onClose={() => setShowForm(false)}
          onSubmit={handleCreate}
          loading={loading}
        />
      )}
    </motion.div>
  )
}