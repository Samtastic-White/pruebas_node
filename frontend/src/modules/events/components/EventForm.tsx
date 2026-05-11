import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { Event } from '../types/event.types'

interface Props {
  event?: Event | null
  onClose: () => void
  onSubmit: (data: any) => void
  loading?: boolean
}

export default function EventForm({ event, onClose, onSubmit, loading }: Props) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    event_date: '',
    event_time: '',
    location: '',
    distance: '10K',
    price: 0,
    max_slots: 0,
    status: 'inactive',
    image_url: '',
  })

  useEffect(() => {
    if (event) {
      setForm({
        name: event.name,
        description: event.description || '',
        event_date: event.event_date?.split('T')[0] || '',
        event_time: event.event_time?.slice(0, 5) || '',
        location: event.location,
        distance: event.distance,
        price: Number(event.price),
        max_slots: event.max_slots,
        status: event.status,
        image_url: event.image_url || '',
      })
    }
  }, [event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#171923] border border-white/5 rounded-xl w-full max-w-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-[#e2e8f0]">
            {event ? 'Editar Evento' : 'Nuevo Evento'}
          </h2>
          <button onClick={onClose} className="text-[#94a3b8] hover:text-white">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Nombre del evento"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
            required
          />
          <textarea
            placeholder="Descripción"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none resize-none h-20"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={form.event_date}
              onChange={e => setForm({ ...form, event_date: e.target.value })}
              className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-[#e2e8f0] focus:border-[#f97316] focus:outline-none"
              required
            />
            <input
              type="time"
              value={form.event_time}
              onChange={e => setForm({ ...form, event_time: e.target.value })}
              className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-[#e2e8f0] focus:border-[#f97316] focus:outline-none"
              required
            />
          </div>
          <input
            placeholder="Lugar"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
            className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
            required
          />

          <div>
            <label className="block text-[#94a3b8] text-xs mb-1">Imagen URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={form.image_url}
              onChange={e => setForm({ ...form, image_url: e.target.value })}
              className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[#94a3b8] text-xs mb-1">Distancia</label>
              <input
                type="text"
                list="distancias"
                placeholder="10K, 21K..."
                value={form.distance}
                onChange={e => setForm({ ...form, distance: e.target.value })}
                className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
                required
              />
              <datalist id="distancias">
                <option value="3K" /><option value="5K" /><option value="8K" />
                <option value="10K" /><option value="15K" /><option value="21K" />
                <option value="42K" /><option value="50K" /><option value="80K" />
                <option value="100K" /><option value="Trail" /><option value="Ultra" />
                <option value="Cross" /><option value="Relevos" />
              </datalist>
            </div>
            <div>
              <label className="block text-[#94a3b8] text-xs mb-1">Precio ($)</label>
              <input
                type="number"
                placeholder="25.00"
                value={form.price}
                onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[#94a3b8] text-xs mb-1">Cupos</label>
              <input
                type="number"
                placeholder="0 = ilimitado"
                value={form.max_slots}
                onChange={e => setForm({ ...form, max_slots: Number(e.target.value) })}
                className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
              />
            </div>
          </div>
          {event && (
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
              className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 px-4 text-[#e2e8f0] focus:border-[#f97316] focus:outline-none"
            >
              <option value="inactive">Inactivo</option>
              <option value="active">Activo</option>
              <option value="finished">Finalizado</option>
            </select>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-white/5 text-[#e2e8f0] py-2.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#f97316] hover:bg-[#ea6a0a] text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Guardando...' : event ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}