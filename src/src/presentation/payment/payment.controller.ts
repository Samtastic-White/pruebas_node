import { Request, Response } from "express";
import Stripe from 'stripe';
import { runnerRepository } from "../../infrastructure/database/postgres/repositories/runner.repository";

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
        const { amount, registrationData } = req.body;

        const event = await eventRepository.findById(registrationData.event_id);

        if (!event) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }

        const customerId = await getOrCreateCustomer(
            registrationData.full_name,
            registrationData.email,
            registrationData.dni
        );

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(event.price) * 100),
            currency: 'usd',
            customer: customerId,
            payment_method_types: ['card'],
            metadata: {
                full_name: registrationData.full_name,
                dni: registrationData.dni,
                email: registrationData.email,
                event_id: String(registrationData.event_id),
                event_name: event.name,
                stripe_price_id: event.stripe_price_id || '',
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
        });
    } catch (error: any) {
        console.error('Error creating payment intent', error.message);
        res.status(500).json({
            error: 'Error al crear el pago'
        });
    }
};