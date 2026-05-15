import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from '@tanstack/react-form'
import { motion } from 'framer-motion'
import { LogIn, User, Lock } from 'lucide-react'
import { toast } from 'sonner'
import api from '../../../config/api'
import { loginFormSchema } from '../schemas/auth.schema'
import logo from '../../../assets/logo.png'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },

    validators: {
      onChange: ({ value }) => {
        const result = loginFormSchema.safeParse(value)
        if (!result.success) {
          return result.error.issues.map(issue => issue.message)
        }
        return undefined
      },
    },

    onSubmit: async ({ value }) => {
      setLoading(true)
      try {
        const { data } = await api.post('/auth/login', value)
        localStorage.setItem('token', data.token)
        toast.success('¡Bienvenido!')
        navigate('/dashboard')
      } catch {
        toast.error('Credenciales inválidas')
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#f97316]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8b5cf6]/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#171923] border border-white/5 rounded-xl p-8">
          
          <div className="text-center mb-8">
            <img src={logo} alt="Marathon" className="w-14 h-14 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-[#e2e8f0]">Marathon</h1>
            <p className="text-[#94a3b8] text-sm mt-1">Bienvenido de Nuevo</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
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
                      className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-[#f97316]/20 transition-all"
                    />
                  </div>
                  {field.state.meta.errors.map((error) => (
                    <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="password">
              {(field) => (
                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
                    <input
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Contraseña"
                      className="w-full bg-[#0f1117] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-[#e2e8f0] placeholder-[#94a3b8] focus:border-[#f97316] focus:outline-none focus:ring-1 focus:ring-[#f97316]/20 transition-all"
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
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={!canSubmit || loading}
                  className="w-full bg-[#f97316] hover:bg-[#ea6a0a] text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <LogIn size={18} />
                  {loading || isSubmitting ? 'Ingresando...' : 'Iniciar Sesión'}
                </motion.button>
              )}
            </form.Subscribe>
          </form>

          <p className="text-center text-[#94a3b8] text-xs mt-6">
            Todos los Derechos Reservados para mi © 2026
          </p>
        </div>
      </motion.div>
    </div>
  )
}