import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useEvents } from '../hooks/useEvents'
import { useCreateEvent, useUpdateEvent, useDeleteEvent } from '../hooks/useEventMutations'
import { useEventFilters } from '../hooks/useEventFilters'
import EventForm from '../components/EventForm'
import EventFilters from '../components/EventFilters'
import EventTable from '../components/EventTable'
import ExportButton from '../../../shared/components/ExportButton'
import type { Event } from '../types/event.types'

export default function EventsPage() {
  const { data: events, isLoading } = useEvents()
  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const deleteEvent = useDeleteEvent()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Event | null>(null)
  const { search, setSearch, statusFilter, setStatusFilter, filtered } = useEventFilters(events)

  const handleSubmit = (data: any) => {
    if (editing) updateEvent.mutate({ id: editing.id, data })
    else createEvent.mutate(data)
    setShowForm(false)
    setEditing(null)
  }

  const exportData = filtered?.map(event => ({
    nombre: event.name,
    fecha: new Date(event.event_date.split('T')[0] + 'T12:00:00').toLocaleDateString('es-CO'),
    hora: event.event_time?.slice(0, 5),
    lugar: event.location,
    distancia: event.distance,
    precio: `$${event.price}`,
    cupos: event.max_slots === 0 ? 'Ilimitado' : String(event.max_slots),
    estado: event.status === 'active' ? 'Activo' : event.status === 'inactive' ? 'Inactivo' : 'Finalizado',
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
          <h1 className="text-xl sm:text-2xl font-semibold text-[#e2e8f0]">Eventos</h1>
          <p className="text-[#94a3b8] text-xs sm:text-sm mt-1">Gestiona los eventos deportivos</p>
        </div>
        <div className="flex gap-2">
          <ExportButton
            data={exportData}
            columns={[
              { header: 'Nombre', key: 'nombre', width: 30 },
              { header: 'Fecha', key: 'fecha', width: 14 },
              { header: 'Hora', key: 'hora', width: 8 },
              { header: 'Lugar', key: 'lugar', width: 25 },
              { header: 'Distancia', key: 'distancia', width: 12 },
              { header: 'Precio', key: 'precio', width: 10 },
              { header: 'Cupos', key: 'cupos', width: 10 },
              { header: 'Estado', key: 'estado', width: 12 },
            ]}
            filename={`eventos-${new Date().toISOString().split('T')[0]}`}
            templateKey="events"
            dataStartRow={5}
          />
          <button
            onClick={() => { setEditing(null); setShowForm(true) }}
            className="flex items-center gap-1 sm:gap-2 bg-[#f97316] hover:bg-[#ea6a0a] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
          >
            <Plus size={16} /> <span className="hidden sm:inline">Nuevo Evento</span>
          </button>
        </div>
      </div>

      <EventFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <EventTable
        events={filtered || []}
        onEdit={(e) => { setEditing(e); setShowForm(true) }}
        onDelete={(e) => { if (confirm('¿Eliminar?')) deleteEvent.mutate(e.id) }}
        isEmpty={!filtered?.length}
        hasFilters={!!search || statusFilter !== 'all'}
      />

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