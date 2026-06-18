import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

interface Props {
  onPaymentSuccess: (paymentIntentId: string) => void
  onPaymentError: (error: string) => void
}

export function StripePaymentForm({ onPaymentSuccess, onPaymentError }: Props) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!stripe || !elements) {
      setErrorMessage('Stripe no está inicializado correctamente')
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: 'if_required',
      })

      if (error) {
        setErrorMessage(error.message || 'Error en el pago')
        onPaymentError(error.message || 'Error en el pago')
      } else if (paymentIntent) {
        console.log('Payment Intent status:', paymentIntent.status)
        
        if (paymentIntent.status === 'succeeded') {
          onPaymentSuccess(paymentIntent.id)
        } else if (paymentIntent.status === 'processing') {
          setErrorMessage('El pago está siendo procesado. Te notificaremos cuando se complete.')
        } else if (paymentIntent.status === 'requires_payment_method') {
          setErrorMessage('El pago fue rechazado. Intenta con otro método de pago.')
          onPaymentError('Pago rechazado')
        }
      }
    } catch (err) {
      console.error('Error en el pago:', err)
      setErrorMessage('Error al procesar el pago')
      onPaymentError('Error al procesar el pago')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/25 rounded-lg p-3">
          <p className="text-red-500 text-sm">{errorMessage}</p>
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-[#f97316] hover:bg-[#ea6a0a] text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Procesando pago...
          </span>
        ) : (
          'Pagar e inscribirse'
        )}
      </button>
    </form>
  )
}