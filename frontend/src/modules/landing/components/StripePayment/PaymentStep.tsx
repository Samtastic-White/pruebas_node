import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { StripePaymentForm } from './StripePaymentForm'
import type { Event } from '../../types/event.types'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

interface Props {
  evento: Event
  clientSecret: string
  paymentIntentId: string
  invoiceUrl?: string
  amount: number
  onBack: () => void
  onClose: () => void
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

export function PaymentStep({ 
  evento, 
  clientSecret, 
  paymentIntentId,
  amount, 
  onBack, 
  onClose, 
  onSuccess, 
  onError 
}: Props) {
  console.log('PaymentStep - Datos recibidos:', {
    clientSecret: clientSecret?.substring(0, 30) + '...',
    paymentIntentId,
    amount,
    amountInDollars: (amount / 100).toFixed(2)
  })

  if (!clientSecret) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#111] border border-[#f97316]/25 rounded-2xl w-full max-w-md p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-500 font-medium">Error: No se pudo inicializar el pago</p>
          <p className="text-white/40 text-sm mt-2">Por favor, intenta nuevamente</p>
          <button
            onClick={onBack}
            className="mt-6 bg-white/5 hover:bg-white/10 text-white py-2 px-6 rounded-lg transition-colors"
          >
            Volver al formulario
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#111] border border-[#f97316]/25 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div>
            <p className="text-[#f97316] text-xs font-bold uppercase tracking-wider">Pago seguro</p>
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

        <div className="p-4">

          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'night',
                variables: {
                  colorPrimary: '#f97316',
                  colorBackground: '#1a1a1a',
                  colorText: '#ffffff',
                  colorDanger: '#ef4444',
                  fontFamily: 'system-ui, sans-serif',
                  borderRadius: '8px',
                },
              },
            }}
          >
            <StripePaymentForm
              onPaymentSuccess={onSuccess}
              onPaymentError={onError}
            />
          </Elements>

          <button
            onClick={onBack}
            className="w-full mt-4 bg-white/5 hover:bg-white/10 text-white/60 py-2.5 rounded-lg text-sm transition-colors"
          >
            ← Volver al formulario
          </button>
        </div>
      </div>
    </div>
  )
}