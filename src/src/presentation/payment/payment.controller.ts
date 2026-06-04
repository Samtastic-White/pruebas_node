import { Request, Response } from "express";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-05-27.dahlia'
});

export const createPaymentIntent = async (req:Request, res:Response) => {
    try {
        const { amount, registrationData } = req.body;

        console.log('Received:', { amount, registrationData });

        const createPaymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(amount)), 
            currency: 'usd',
            payment_method_types: ['card'],
            metadata: {
                full_name: registrationData.full_name,
                dni: registrationData.dni,
                email: registrationData.email,
                event_id: String(registrationData.event_id),
            },
        });

        res.json({
            clientSecret: createPaymentIntent.client_secret,
            paymentIntentId: createPaymentIntent.id
        });
    } catch (error: any) {
        console.error('Error creating payment intent', error.message);
        res.status(500).json({
            error: 'Error al crear el pago'
        });
    }
};