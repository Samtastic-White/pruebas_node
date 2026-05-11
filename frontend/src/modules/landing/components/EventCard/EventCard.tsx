import type { Event } from '../../types/event.types'

interface Props {
  evento: Event
  activo: boolean
  onClick: () => void
}

export default function EventCard({ evento, activo, onClick }: Props) {
  const fecha = new Date(evento.event_date.split('T')[0] + 'T12:00:00').toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 bg-white/[0.04] border rounded-lg p-3 cursor-pointer text-left
        transition-all duration-200 w-full min-w-[220px] max-w-[280px] flex-shrink-0
        ${activo 
          ? 'border-[#f97316] bg-[#f97316]/10 shadow-lg shadow-[#f97316]/20' 
          : 'border-white/10 hover:border-[#f97316]/40 hover:bg-[#f97316]/5 hover:-translate-y-0.5'
        }
      `}
    >
      <div
        className="w-16 h-16 rounded-md bg-cover bg-center flex-shrink-0 relative overflow-hidden"
        style={{ backgroundImage: `url(${evento.image_url || 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=200&q=80'})` }}
      >
        <div className={`absolute inset-0 ${activo ? 'bg-[#f97316]/15' : 'bg-black/15'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold leading-tight truncate">{evento.name}</p>
        <p className="text-[#f97316] text-xs font-semibold uppercase tracking-wider mt-1">{fecha}</p>
      </div>
    </button>
  )
}