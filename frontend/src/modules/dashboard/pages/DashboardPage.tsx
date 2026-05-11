import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Calendar, Users, ClipboardList, Activity } from 'lucide-react'
import api from '../../../config/api'
import type { Event } from '../../events/types/event.types'
import type { Registration } from '../../registrations/types/registration.types'

export default function DashboardPage() {
  const { data: events } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: () => api.get('/events').then(r => r.data),
  })

  const { data: registrations } = useQuery<Registration[]>({
    queryKey: ['registrations'],
    queryFn: () => api.get('/registrations').then(r => r.data),
  })

  const stats = [
    {
      label: 'Eventos Activos',
      value: events?.filter(e => e.status === 'active').length || 0,
      icon: Calendar,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Total Eventos',
      value: events?.length || 0,
      icon: Activity,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      label: 'Inscripciones',
      value: registrations?.length || 0,
      icon: ClipboardList,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Corredores Únicos',
      value: new Set(registrations?.map(r => r.dni)).size || 0,
      icon: Users,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ]

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Resumen general de tus eventos</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#171923] border border-white/5 rounded-xl p-6 hover:border-orange-500/30 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} p-3 rounded-lg`}>
                <stat.icon className={stat.color} size={24} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-[#171923] border border-white/5 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Eventos Recientes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="py-3 px-4 text-gray-400 font-medium text-sm">Nombre</th>
                <th className="py-3 px-4 text-gray-400 font-medium text-sm">Fecha</th>
                <th className="py-3 px-4 text-gray-400 font-medium text-sm">Distancia</th>
                <th className="py-3 px-4 text-gray-400 font-medium text-sm">Estado</th>
              </tr>
            </thead>
            <tbody>
              {events?.slice(0, 5).map((event) => (
                <tr key={event.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-white">{event.name}</td>
                  <td className="py-3 px-4 text-gray-300">
                    {new Date(event.event_date).toLocaleDateString('es-CO')}
                  </td>
                  <td className="py-3 px-4 text-gray-300">{event.distance}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      event.status === 'inactive' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {event.status === 'active' ? 'Activo' :
                       event.status === 'inactive' ? 'Inactivo' : 'Finalizado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}