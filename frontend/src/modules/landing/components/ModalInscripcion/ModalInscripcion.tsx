import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import api from '../../../../config/api'
import { registrationFormSchema } from '../../../registrations/schemas/registration.schema'
import { PaymentStep } from '../StripePayment/PaymentStep'
import type { Event } from '../../types/event.types'

interface Props {
  evento: Event
  onClose: () => void
}

type Step = 'form' | 'payment'

export default function ModalInscripcion({ evento, onClose }: Props) {
  const [step, setStep] = useState<Step>('form')
  const [paymentInfo, setPaymentInfo] = useState<{
    clientSecret: string;
    paymentIntentId: string;
    invoiceId?: string;
    invoiceUrl?: string;
    amount: number;
  } | null>(null)
  const [formData, setFormData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const hasPrice = evento.price && Number(evento.price) > 0

  const form = useForm({
    defaultValues: {
      event_id: evento.id,
      full_name: '',
      dni: '',
      email: '',
      phone: '',
    },

    validators: {
      onMount: ({ value }) => {
        const result = registrationFormSchema.safeParse(value)
        if (!result.success) return result.error.issues.map(issue => issue.message)
      },
      onChange: ({ value }) => {
        const result = registrationFormSchema.safeParse(value)
        if (!result.success) return result.error.issues.map(issue => issue.message)
      },
    },

    onSubmit: async ({ value }) => {
      setIsLoading(true)
      try {
        if (hasPrice) {
          console.log('Enviando datos de pago:', value)

          const { data } = await api.post('/payment', {
            registrationData: value,
          })

          console.log('Respuesta del backend:', data)

          // Validar que tengamos los datos necesarios
          if (!data.clientSecret || !data.paymentIntentId) {
            throw new Error('No se recibió la información de pago necesaria')
          }

          // Guardar toda la información del pago
          setPaymentInfo({
            clientSecret: data.clientSecret,
            paymentIntentId: data.paymentIntentId,
            invoiceId: data.invoiceId, // ✅ GUARDAR invoiceId
            invoiceUrl: data.invoiceUrl,
            amount: data.amount,
          })

          // Guardar datos del formulario para el registro posterior
          setFormData(value)

          // Cambiar al paso de pago
          setStep('payment')

        } else {
          // Evento gratuito - registrar directamente
          await api.post('/registrations', value)
          toast.success('¡Inscripción exitosa! Nos vemos en la carrera')
          onClose()
        }
      } catch (error: any) {
        console.error('Error:', error)
        toast.error(error.response?.data?.error || error.message || 'Error al procesar')
      } finally {
        setIsLoading(false)
      }
    },
  })

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      console.log('Pago exitoso, confirmando...', {
        paymentIntentId,
        formData,
        invoiceId: paymentInfo?.invoiceId // ✅ Ahora sí existe
      });

      await api.post('/registrations/confirm-payment', {
        paymentIntentId: paymentIntentId,
        invoiceId: paymentInfo?.invoiceId, // ✅ Pasarlo al backend
        registrationData: formData,
      });

      toast.success('¡Inscripción exitosa! Nos vemos en la carrera');
      onClose();
    } catch (error: any) {
      console.error('Error al confirmar:', error);

      // Si el error es porque ya existe la inscripción (409)
      if (error.response?.status === 409) {
        toast.success('Tu inscripción ya fue registrada');
        onClose();
      } else {
        toast.error(
          error.response?.data?.error ||
          error.response?.data?.details ||
          'Error al confirmar la inscripción'
        );
      }
    }
  };

  if (step === 'payment' && paymentInfo?.clientSecret) {
    return (
      <PaymentStep
        evento={evento}
        clientSecret={paymentInfo.clientSecret}
        paymentIntentId={paymentInfo.paymentIntentId}
        invoiceUrl={paymentInfo.invoiceUrl}
        amount={paymentInfo.amount}
        onBack={() => setStep('form')}
        onClose={onClose}
        onSuccess={handlePaymentSuccess}
        onError={(e) => {
          toast.error(e)
        }}
      />
    )
  }

  // Mostrar formulario
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#111] border border-[#f97316]/25 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div>
            <p className="text-[#f97316] text-xs font-bold uppercase tracking-wider">Inscripción</p>
            <h2 className="text-white font-bold text-lg">{evento.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {hasPrice && (
          <div className="mx-4 mt-4 bg-[#f97316]/10 border border-[#f97316]/25 rounded-lg p-3 flex items-center gap-3">
            <span>💳</span>
            <div>
              <p className="text-[#f97316] text-sm font-semibold">Evento pago</p>
              <p className="text-white/50 text-xs">Se te redirigirá al pago seguro</p>
            </div>
            <span className="ml-auto text-[#f97316] font-bold">
              ${Number(evento.price).toFixed(2)} USD
            </span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="p-4 space-y-4"
        >
          <form.Field name="full_name">
            {(field) => (
              <div>
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Nombre completo"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-white/30 focus:border-[#f97316] focus:outline-none"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Field name="dni">
            {(field) => (
              <div>
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="DNI"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-white/30 focus:border-[#f97316] focus:outline-none"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <div>
                <input
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Correo electrónico"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-white/30 focus:border-[#f97316] focus:outline-none"
                />
                {field.state.meta.errors.map((error) => (
                  <p key={error} className="text-[#ef4444] text-xs mt-1">{error}</p>
                ))}
              </div>
            )}
          </form.Field>

          <form.Field name="phone">
            {(field) => (
              <div>
                <input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Teléfono"
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-white/30 focus:border-[#f97316] focus:outline-none"
                />
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
                disabled={!canSubmit || isSubmitting || isLoading}
                className="w-full bg-[#f97316] hover:bg-[#ea6a0a] text-white py-2.5 rounded-lg font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {isSubmitting || isLoading
                  ? 'Preparando...'
                  : hasPrice
                    ? 'Continuar al pago'
                    : 'Confirmar inscripción'}
              </button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </div>
  )
}