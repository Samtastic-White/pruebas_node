import { Router } from 'express'
import { createPaymentIntent } from "./payment.controller";

const paymentRoutes = Router()

paymentRoutes.post('/', createPaymentIntent)

export { paymentRoutes }