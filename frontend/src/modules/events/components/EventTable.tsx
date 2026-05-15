import { Edit, Trash2 } from 'lucide-react'
import type { Event } from '../types/event.types'

interface Props {
  events: Event[]
  onEdit: (event: Event) => void
  onDelete: (event: Event) => void
  isEmpty: boolean
  hasFilters: boolean
}

export default function EventTable({ events, onEdit, onDelete, isEmpty, hasFilters }: Props) {
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
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-white/5 text-[#94a3b8]'}`}>
        {labels[status] || status}
      </span>
    )
  }

  if (isEmpty) {
    return (
      <div className="bg-[#171923] border border-white/5 rounded-xl p-12 text-center text-[#94a3b8]">
        {hasFilters
          ? 'No se encontraron eventos con esos filtros'
          : 'No hay eventos creados'
        }
      </div>
    )
  }

  return (
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
          {events.map((event) => (
            <tr key={event.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              <td className="py-3 px-4 text-[#e2e8f0] font-medium text-sm">{event.name}</td>
              <td className="py-3 px-4 text-[#94a3b8] text-sm">
                {new Date(event.event_date.split('T')[0] + 'T12:00:00').toLocaleDateString('es-CO')}
              </td>
              <td className="py-3 px-4 text-[#94a3b8] text-sm">{event.distance}</td>
              <td className="py-3 px-4 text-[#94a3b8] text-sm">${event.price}</td>
              <td className="py-3 px-4">{statusBadge(event.status)}</td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(event)}
                    className="p-1.5 text-[#94a3b8] hover:text-[#f97316] hover:bg-[#f97316]/10 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(event)}
                    className="p-1.5 text-[#94a3b8] hover:text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}