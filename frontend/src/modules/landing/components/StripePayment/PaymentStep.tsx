import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { StripePaymentForm } from './StripePaymentForm'
import type { Event } from '../../types/event.types'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

interface Props {
  evento: Event
  clientSecret: string
  onBack: () => void
  onClose: () => void
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

export function PaymentStep({ evento, clientSecret, onBack, onClose, onSuccess, onError }: Props) {
    console.log('clientSecret:', clientSecret?.substring(0, 20) + '...')
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-[#111] border border-[#f97316]/25 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div>
            <p className="text-[#f97316] text-xs font-bold uppercase tracking-wider">Pago</p>
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
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Total a pagar</span>
              <span className="text-2xl font-bold text-[#f97316]">
                ${(evento.price)} USD
              </span>
            </div>
          </div>

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

          <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg">
            <p className="text-white/40 text-xs mb-2">Tarjeta de prueba:</p>
            <code className="text-white/60 text-xs">4242 4242 4242 4242</code>
          </div>
        </div>
      </div>
    </div>
  )
}