import { useEffect, useRef, useState } from 'react'
import type { Event } from '../../types/event.types'
import EventCard from '../EventCard/EventCard'

interface Props {
  eventos: Event[]
  eventoActivoId: number | null
  onSeleccionar: (evento: Event) => void
}

export default function NextEvents({ eventos, onSeleccionar }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (eventos.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % eventos.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [eventos.length])

  useEffect(() => {
    if (eventos.length === 0) return
    
    const selectedEvent = eventos[currentIndex]
    onSeleccionar(selectedEvent)

  }, [currentIndex])

  const scroll = (dir: 'left' | 'right') => {
    if (dir === 'left') {
      setCurrentIndex(prev => (prev - 1 + eventos.length) % eventos.length)
    } else {
      setCurrentIndex(prev => (prev + 1) % eventos.length)
    }
  }

  if (eventos.length === 0) return null

  return (
    <section id="eventos" className="bg-[#0a0a0a] py-12 px-8 border-t border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold text-white uppercase tracking-wider">
          <span className="text-[#f97316]">PRÓXIMOS</span> EVENTOS
        </h2>
        <div className="flex gap-2">
          <button onClick={() => scroll('left')} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#f97316]/15 hover:border-[#f97316] hover:text-[#f97316] transition-colors">
            ◀
          </button>
          <button onClick={() => scroll('right')} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#f97316]/15 hover:border-[#f97316] hover:text-[#f97316] transition-colors">
            ▶
          </button>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {eventos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'bg-[#f97316] w-6' : 'bg-white/20 w-2'
            }`}
          />
        ))}
      </div>

      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
        {eventos.map((evento, i) => (
          <EventCard
            key={evento.id}
            evento={evento}
            activo={i === currentIndex}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
      </div>
    </section>
  )
}