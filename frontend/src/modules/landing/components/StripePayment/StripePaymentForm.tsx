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

  console.log('stripe:', !!stripe)
  console.log('elements:', !!elements)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!stripe || !elements) return

    setIsProcessing(true)
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.origin },
        redirect: 'if_required',
      })

      if (error) onPaymentError(error.message || 'Error en el pago')
      else if (paymentIntent?.status === 'succeeded') onPaymentSuccess(paymentIntent.id)
    } catch {
      onPaymentError('Error al procesar el pago')
    }
    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-[#f97316] hover:bg-[#ea6a0a] text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        {isProcessing ? 'Procesando...' : 'Pagar e inscribirse'}
      </button>
    </form>
  )
}