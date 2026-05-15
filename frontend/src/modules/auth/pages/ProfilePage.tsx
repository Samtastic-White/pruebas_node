import { useForm } from '@tanstack/react-form'
import { motion } from 'framer-motion'
import { Lock, Key, User } from 'lucide-react'
import { changePasswordFormSchema } from '../../auth/schemas/auth.schema'
import api from '../../../config/api'
import { toast } from 'sonner'

export default function ProfilePage() {
  const form = useForm({
    defaultValues: {
      username: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },

    validators: {
      onMount: ({ value }) => {
        const result = changePasswordFormSchema.safeParse(value)
        if (!result.success) {
          return result.error.issues.map(issue => issue.message)
        }
        return undefined
      },
      onChange: ({ value }) => {
        const result = changePasswordFormSchema.safeParse(value)
        if (!result.success) {
          return result.error.issues.map(issue => issue.message)
        }
        return undefined
      },
    },

    onSubmit: async ({ value }) => {
      try {
        await api.put('/auth/change-password', {
          username: value.username,
          oldPassword: value.oldPassword,
          newPassword: value.newPassword,
        })
        toast.success('Contraseña actualizada exitosamente')
        form.reset()
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Error al cambiar contraseña')
      }
    },
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto px-0 sm:px-4"
    >
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-[#e2e8f0]">Perfil</h1>
        <p className="text-[#94a3b8] text-xs sm:text-sm mt-1">Cambia tu contraseña de administrador</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="bg-[#171923] border border-white/5 rounded-xl p-4 sm:p-6 space-y-4"
      >
        <div className="flex items-center gap-3 p-4 bg-[#0f1117] rounded-lg border border-white/5 mb-2">
          <div className="w-10 h-10 bg-[#8b5cf6]/10 rounded-lg flex items-center justify-center">
            <User className="text-[#8b5cf6]" size={20} />
          </div>
          <div>
            <p className="text-[#e2e8f0] font-medium">Administrador</p>
            <p className="text-[#94a3b8] text-sm">Cambia tu contraseña periódicamente</p>
          </div>
        </div>

        <form.Field name="username">
          {(field) => (
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Usuario"
                  className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
                />
              </div>
              {field.state.meta.errors.map((error) => (
                <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Field name="oldPassword">
          {(field) => (
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
                <input
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Contraseña actual"
                  className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
                />
              </div>
              {field.state.meta.errors.map((error) => (
                <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Field name="newPassword">
          {(field) => (
            <div>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
                <input
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Nueva contraseña"
                  className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
                />
              </div>
              {field.state.meta.errors.map((error) => (
                <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Field name="confirmPassword">
          {(field) => (
            <div>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
                <input
                  type="password"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Confirmar nueva contraseña"
                  className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-sm text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none"
                />
              </div>
              {field.state.meta.errors.map((error) => (
                <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
              ))}
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Lock size={18} />
              {isSubmitting ? 'Actualizando...' : 'Cambiar Contraseña'}
            </button>
          )}
        </form.Subscribe>
      </form>
    </motion.div>
  )
}