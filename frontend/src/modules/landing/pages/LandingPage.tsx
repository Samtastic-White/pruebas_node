import { useState, useEffect } from 'react'
import { useEvents } from '../../events/hooks/useEvents'
import Navbar from '../components/Navbar/Navbar'
import HeroSection from '../components/HeroSection/HeroSection'
import NextEvents from '../components/NextEvents/NextEvents'
import ModalInscripcion from '../components/ModalInscripcion/ModalInscripcion'
import type { Event } from '../types/event.types'

export default function LandingPage() {
  const { data: events } = useEvents()
  const activeEvents = events
    ?.filter(e => e.status === 'active' || e.status === 'finished')
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()) || 
  []
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(activeEvents[0] || null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (activeEvents.length > 0 && !selectedEvent) {
      setSelectedEvent(activeEvents[0])
    }
  }, [activeEvents])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <HeroSection
        evento={selectedEvent}
        onInscribirse={() => setShowModal(true)}
      />
      <NextEvents
        eventos={activeEvents}
        eventoActivoId={selectedEvent?.id || null}
        onSeleccionar={setSelectedEvent}
      />
      {showModal && selectedEvent && (
        <ModalInscripcion
          evento={selectedEvent}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}