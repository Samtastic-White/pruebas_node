import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '../hooks/useEvents'
import EventForm from '../components/EventForm'
import type { Event } from '../types/event.types'
import { useDebounce } from '../../../shared/hooks/useDebounce'

export default function EventsPage() {
  const { data: events, isLoading } = useEvents()
  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const deleteEvent = useDeleteEvent()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Event | null>(null)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [statusFilter, setStatusFilter] = useState('all')

  const handleSubmit = (data: any) => {
    if (editing) updateEvent.mutate({ id: editing.id, data })
    else createEvent.mutate(data)
    setShowForm(false)
    setEditing(null)
  }

  const filteredEvents = events?.filter(event => {
    const matchSearch =
      event.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      event.location.toLowerCase().includes(debouncedSearch.toLowerCase())
    const matchStatus = statusFilter === 'all' || event.status === statusFilter
    return matchSearch && matchStatus
  })

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-[#22c55e]/10 text-[#22c55e]',
      inactive: 'bg-[#eab308]/10 text-[#eab308]',
      finished: 'bg-[#8b5cf6]/10 text-[#8b5cf6]',
    }
    const labels: Record<string, string> = {
      active: 'Activo', inactive: 'Inactivo', finished: 'Finalizado'
    }
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}>
        {labels[status]}
      </span>
    )
  }

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
          <h1 className="text-xl sm:text-2xl font-semibold text-[#e2e8f0]">Eventos</h1>
          <p className="text-[#94a3b8] text-xs sm:text-sm mt-1">Gestiona los eventos deportivos</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true) }}
          className="flex items-center gap-1 sm:gap-2 bg-[#f97316] hover:bg-[#ea6a0a] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
        >
          <Plus size={16} /> <span className="hidden sm:inline">Nuevo Evento</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre o lugar..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-[#171923] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="bg-[#171923] border border-white/5 rounded-lg py-2.5 px-4 text-sm text-[#e2e8f0] focus:border-[#f97316] focus:outline-none w-full sm:w-40"
        >
          <option value="all">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
          <option value="finished">Finalizados</option>
        </select>
      </div>

      <div className="bg-[#171923] border border-white/5 rounded-xl overflow-x-auto">
        <table className="w-full text-left min-w-[700px]">
          <thead>
            <tr className="border-b border-white/5">
              <th className="py-3 px-4 text-[#94a3b8] font-medium text-sm">Nombre</th>
              <th className="py-3 px-4 text-[#94a3b8] font-medium text-sm">Fecha</th>
              <th className="py-3 px-4 text-[#94a3b8] font-medium text-sm">Distancia</th>
              <th className="py-3 px-4 text-[#94a3b8] font-medium text-sm">Precio</th>
              <th className="py-3 px-4 text-[#94a3b8] font-medium text-sm">Estado</th>
              <th className="py-3 px-4 text-[#94a3b8] font-medium text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents?.map((event) => (
              <tr key={event.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="py-3 px-4 text-[#e2e8f0] font-medium text-sm">{event.name}</td>
                <td className="py-3 px-4 text-[#94a3b8] text-sm">
                  {new Date(event.event_date).toLocaleDateString('es-CO')}
                </td>
                <td className="py-3 px-4 text-[#94a3b8] text-sm">{event.distance}</td>
                <td className="py-3 px-4 text-[#94a3b8] text-sm">${event.price}</td>
                <td className="py-3 px-4">{statusBadge(event.status)}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditing(event); setShowForm(true) }}
                      className="p-1.5 text-[#94a3b8] hover:text-[#f97316] hover:bg-[#f97316]/10 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => { if (confirm('¿Eliminar evento?')) deleteEvent.mutate(event.id) }}
                      className="p-1.5 text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredEvents?.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#94a3b8]">
                  {search || statusFilter !== 'all'
                    ? 'No se encontraron eventos con esos filtros'
                    : 'No hay eventos creados'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <EventForm
          event={editing}
          onClose={() => { setShowForm(false); setEditing(null) }}
          onSubmit={handleSubmit}
          loading={createEvent.isPending || updateEvent.isPending}
        />
      )}
    </motion.div>
  )
}