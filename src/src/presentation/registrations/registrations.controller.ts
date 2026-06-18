import { Request, Response } from 'express'
import Stripe from 'stripe'
import { registrationService } from '../../application/registrations/registration.service'
import { createRegistrationSchema } from './registrations.schema'
import { registrationRepository } from '../../infrastructure/database/postgres/repositories/registration.repository'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia'
})

export const getRegistrations = async (_req: Request, res: Response) => {
  try {
    const registrations = await registrationService.getAll()
    res.json(registrations)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener inscripciones' })
  }
}

export const getRegistrationsByEvent = async (req: Request, res: Response) => {
  try {
    const registrations = await registrationService.getByEvent(Number(req.params.eventId))
    res.json(registrations)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener inscripciones' })
  }
}

export const createRegistration = async (req: Request, res: Response) => {
  try {
    const validation = createRegistrationSchema.safeParse(req.body)

    if (!validation.success) {
      const errors = validation.error.issues.map(issues => {
        try { return JSON.parse(issues.message) }
        catch { return { description: issues.message } }
      })
      return res.status(400).json({ errors })
    }

    const { payment_intent_id, ...registrationData } = validation.data

    if (payment_intent_id) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

        if (paymentIntent.status !== 'succeeded') {
          return res.status(400).json({
            error: 'El pago no ha sido completado exitosamente'
          });
        }

        if (paymentIntent.metadata.event_id !== String(registrationData.event_id)) {
          return res.status(400).json({
            error: 'El pago no corresponde a este evento'
          });
        }

        const existingReg = await registrationRepository.findByPaymentIntent(payment_intent_id);
        if (existingReg) {
          return res.status(400).json({
            error: 'Este pago ya fue utilizado'
          });
        }

        const charges = await stripe.charges.list({
          payment_intent: payment_intent_id,
          limit: 1,
        });
        const receiptUrl = charges.data[0]?.receipt_url || null;

        (registrationData as any).receipt_url = receiptUrl;

      } catch (stripeError: any) {
        console.error('Stripe verification error:', stripeError)
        return res.status(400).json({
          error: 'Error al verificar el pago'
        });
      }
    }

    const registration = await registrationService.create({...registrationData, payment_intent_id})
    res.status(201).json(registration)

  } catch (error: any) {
    if (error.message === 'Ya estás inscrito a este evento') {
      return res.status(400).json({ error: error.message })
    }
    res.status(500).json({ error: 'Error al crear inscripción' })
  }
}

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId, invoiceId, registrationData } = req.body;

    console.log('🔍 Confirmando pago:', {
      paymentIntentId,
      invoiceId,
      registrationData
    });

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        error: 'El pago no se ha completado exitosamente',
        status: paymentIntent.status
      });
    }

    if (paymentIntent.metadata.event_id !== String(registrationData.event_id)) {
      return res.status(400).json({
        error: 'El pago no corresponde a este evento'
      });
    }

    const existingReg = await registrationRepository.findByPaymentIntent(paymentIntentId);
    if (existingReg) {
      return res.status(409).json({
        message: 'Este pago ya fue registrado',
        registration: existingReg
      });
    }

    let receiptUrl: string | null = null;

    if (invoiceId && paymentIntent.payment_method) {
      try {
        console.log('Pagando factura con método de pago:', paymentIntent.payment_method);

        const paidInvoice = await stripe.invoices.pay(invoiceId, {
          payment_method: paymentIntent.payment_method as string,
        });

        console.log('Factura pagada exitosamente:', {
          invoiceId: paidInvoice.id,
          status: paidInvoice.status,
          invoice_pdf: paidInvoice.invoice_pdf,
          hosted_url: paidInvoice.hosted_invoice_url,
        });

        receiptUrl = paidInvoice.hosted_invoice_url || null;

      } catch (invoiceError: any) {
        console.error('Error pagando factura:', {
          message: invoiceError.message,
          code: invoiceError.code,
        });

        if (invoiceError.code === 'invoice_paid') {
          console.log('La factura ya estaba pagada');
          try {
            const invoice = await stripe.invoices.retrieve(invoiceId);
            receiptUrl = invoice.hosted_invoice_url || null;
            console.log('URL de factura obtenida:', receiptUrl);
          } catch (retrieveError: any) {
            console.error('Error obteniendo factura:', retrieveError.message);
          }
        } else {
          try {
            const invoice = await stripe.invoices.retrieve(invoiceId);
            receiptUrl = invoice.hosted_invoice_url || null;
          } catch (retrieveError: any) {
            console.error('No se pudo obtener la factura:', retrieveError.message);
          }
        }
      }
    }

    if (!receiptUrl) {
      try {
        const charges = await stripe.charges.list({
          payment_intent: paymentIntentId,
          limit: 1,
        });
        receiptUrl = charges.data[0]?.receipt_url || null;
      } catch (chargeError: any) {
        console.error('Error obteniendo charges:', chargeError.message);
      }
    }

    const registration = await registrationService.create({
      event_id: Number(registrationData.event_id),
      full_name: registrationData.full_name,
      dni: registrationData.dni,
      email: registrationData.email,
      phone: registrationData.phone,
      payment_intent_id: paymentIntentId,
      amount: paymentIntent.amount,
      receipt_url: receiptUrl || undefined,
    });

    console.log('Inscripción creada exitosamente:', {
      id: registration.id,
      runner: registrationData.full_name,
      event: registrationData.event_id,
      payment: paymentIntentId,
      receipt: receiptUrl,
    });

    return res.status(201).json({
      message: 'Inscripción confirmada y factura pagada',
      registration,
      receiptUrl,
    });

  } catch (error: any) {
    console.error('Error en confirmPayment:', {
      message: error.message,
      type: error.type,
      code: error.code,
    });

    return res.status(500).json({
      error: 'Error al confirmar el pago',
      details: error.message,
    });
  }
};

export const cancelRegistration = async (req: Request, res: Response) => {
  try {
    const result = await registrationService.cancel(Number(req.params.id))
    if (!result) return res.status(404).json({ error: 'Inscripción no encontrada' })
    res.json({ message: 'Inscripción cancelada' })
  } catch (error: any) {
    res.status(500).json({ error: 'Error al cancelar inscripción' })
  }
}