import { Request, Response } from "express";
import Stripe from 'stripe';
import { registrationService } from "../../application/registrations/registration.service";
import { runnerRepository } from "../../infrastructure/database/postgres/repositories/runner.repository";
import { eventRepository } from "../../infrastructure/database/postgres/repositories/event.repository";
import { registrationRepository } from "../../infrastructure/database/postgres/repositories/registration.repository";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia'
});

async function getOrCreateCustomer(
  full_name: string,
  email: string,
  dni: string
): Promise<string> {
  const runner = await runnerRepository.findByDni(dni)

  if (runner?.stripe_customer_id) {
    return runner.stripe_customer_id
  }

  const existingCustomers = await stripe.customers.list({
    email: email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    const customerId = existingCustomers.data[0].id

    if (runner) {
      await runnerRepository.updateStripeCustomerId(runner.id, customerId)
    }

    return customerId
  }

  const newCustomer = await stripe.customers.create({
    name: full_name,
    email: email,
    metadata: {
      dni: dni,
    },
  })

  if (runner) {
    await runnerRepository.updateStripeCustomerId(runner.id, newCustomer.id)
  }

  return newCustomer.id
}

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { registrationData } = req.body;

    const event = await eventRepository.findById(registrationData.event_id);

    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    if (!event.stripe_product_id || !event.stripe_price_id) {
      return res.status(400).json({
        error: 'Error de configuración',
        message: 'El evento no está configurado para recibir pagos en línea'
      });
    }

    const priceNumber = Number(event.price);
    if (!priceNumber || priceNumber <= 0) {
      return res.status(400).json({
        error: 'Error de configuración',
        message: 'El evento no tiene un precio válido'
      });
    }

    const amountInCents = Math.round(priceNumber * 100);

    const customerId = await getOrCreateCustomer(
      registrationData.full_name,
      registrationData.email,
      registrationData.dni
    );

    console.log('👤 Customer ID:', customerId);

    // 1. PRIMERO crear la factura
    const invoice = await stripe.invoices.create({
      customer: customerId,
      collection_method: 'charge_automatically',
      metadata: {
        full_name: registrationData.full_name,
        dni: registrationData.dni,
        email: registrationData.email,
        phone: registrationData.phone || '',
        event_id: String(registrationData.event_id),
        event_name: event.name,
      },
    });

    await stripe.invoiceItems.create({
      customer: customerId,
      price_data: {
        currency: 'usd',
        product: event.stripe_product_id,
        unit_amount: amountInCents,
      },
      invoice: invoice.id,
    });

    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

    console.log('📄 Factura finalizada:', {
      id: finalizedInvoice.id,
      status: finalizedInvoice.status,
      number: finalizedInvoice.number,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      customer: customerId,
      payment_method_types: ['card'],
      setup_future_usage: 'off_session',
      description: `Inscripción a ${event.name}`,
      metadata: {
        invoice_id: finalizedInvoice.id,
        full_name: registrationData.full_name,
        dni: registrationData.dni,
        email: registrationData.email,
        phone: registrationData.phone || '',
        event_id: String(registrationData.event_id),
        event_name: event.name,
      },
      receipt_email: registrationData.email,
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      invoiceId: finalizedInvoice.id,
      invoiceUrl: finalizedInvoice.hosted_invoice_url,
      invoicePdf: finalizedInvoice.invoice_pdf,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
    });

  } catch (error: any) {
    console.error('Error en createPaymentIntent:', {
      message: error.message,
      type: error.type,
      code: error.code,
      statusCode: error.statusCode,
    });

    return res.status(500).json({
      error: 'Error al procesar el pago',
      details: error.message,
    });
  }
};

export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const { paymentIntentId, invoiceId, registrationData } = req.body;

    console.log('Confirmando pago:', { 
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

    let receiptUrl = null;
    
    if (invoiceId && paymentIntent.payment_method) {
      try {
        console.log('Pagando factura con método de pago:', paymentIntent.payment_method);
        
        const paidInvoice = await stripe.invoices.pay(invoiceId, {
          payment_method: paymentIntent.payment_method as string,
        });
        
        console.log('Factura pagada', {
          invoiceId: paidInvoice.id,
          status: paidInvoice.status,
          invoice_pdf: paidInvoice.invoice_pdf,
          hosted_url: paidInvoice.hosted_invoice_url,
        });
        
        receiptUrl = paidInvoice.hosted_invoice_url;
        
      } catch (invoiceError: any) {
        console.error('Error pagando factura:', {
          message: invoiceError.message,
          code: invoiceError.code,
        });

        if (invoiceError.code === 'invoice_paid') {
          console.log('La factura ya esta pagada');
          const invoice = await stripe.invoices.retrieve(invoiceId);
          receiptUrl = invoice.hosted_invoice_url;
        } else {
          try {
            const invoice = await stripe.invoices.retrieve(invoiceId);
            receiptUrl = invoice.hosted_invoice_url;
          } catch (retrieveError) {
            console.error('No se pudo obtener la factura');
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
      } catch (chargeError) {
        console.error('Error obteniendo charges');
      }
    }

    const registration = await registrationService.create({
      runner_id: 0,
      event_id: Number(registrationData.event_id),
      full_name: registrationData.full_name,
      dni: registrationData.dni,
      email: registrationData.email,
      phone: registrationData.phone,
      payment_intent_id: paymentIntentId,
      amount: paymentIntent.amount,
      ...({ receipt_url: receiptUrl } as any),
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