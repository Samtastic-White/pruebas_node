import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Key, User } from 'lucide-react'
import api from '../../../config/api'
import { toast } from 'sonner'

export default function ProfilePage() {
  const [form, setForm] = useState({
    username: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (form.newPassword !== form.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    
    if (form.newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres')
      return
    }
    
    setLoading(true)
    try {
      await api.put('/auth/change-password', {
        username: form.username,
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      })
      toast.success('Contraseña actualizada exitosamente')
      setForm({ username: '', oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al cambiar contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto mt-20">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#e2e8f0]">Perfil</h1>
        <p className="text-[#94a3b8] text-sm mt-1">Cambia tu contraseña de administrador</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#171923] border border-white/5 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3 p-4 bg-[#0f1117] rounded-lg border border-white/5 mb-2">
          <div className="w-10 h-10 bg-[#8b5cf6]/10 rounded-lg flex items-center justify-center">
            <User className="text-[#8b5cf6]" size={20} />
          </div>
          <div>
            <p className="text-[#e2e8f0] font-medium">Administrador</p>
            <p className="text-[#94a3b8] text-sm">Cambia tu contraseña periódicamente</p>
          </div>
        </div>

        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
          <input
            type="text"
            placeholder="Usuario"
            value={form.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
            className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
          <input
            type="password"
            placeholder="Contraseña actual"
            value={form.oldPassword}
            onChange={e => setForm({ ...form, oldPassword: e.target.value })}
            className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
            required
          />
        </div>

        <div className="relative">
          <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={form.newPassword}
            onChange={e => setForm({ ...form, newPassword: e.target.value })}
            className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
            required
          />
        </div>

        <div className="relative">
          <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
          <input
            type="password"
            placeholder="Confirmar nueva contraseña"
            value={form.confirmPassword}
            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Lock size={18} />
          {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
        </button>
      </form>
    </motion.div>
  )
}