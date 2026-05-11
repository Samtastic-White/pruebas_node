import { useRef } from 'react'
import type { Event } from '../../types/event.types'
import EventCard from '../EventCard/EventCard'

interface Props {
  eventos: Event[]
  eventoActivoId: number | null
  onSeleccionar: (evento: Event) => void
}

export default function NextEvents({ eventos, eventoActivoId, onSeleccionar }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' })
  }

  return (
    <section id="eventos" className="bg-[#0a0a0a] py-12 px-8 border-t border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-white uppercase tracking-wider">
          <span className="text-[#f97316]">PRÓXIMOS</span> EVENTOS
        </h2>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#f97316]/15 hover:border-[#f97316] hover:text-[#f97316] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#f97316]/15 hover:border-[#f97316] hover:text-[#f97316] transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {eventos.map(evento => (
          <EventCard
            key={evento.id}
            evento={evento}
            activo={evento.id === eventoActivoId}
            onClick={() => onSeleccionar(evento)}
          />
        ))}
      </div>
    </section>
  )
}