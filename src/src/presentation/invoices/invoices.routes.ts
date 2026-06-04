import { Router } from 'express'
import { getInvoices } from './invoice.controller'

const invoiceRoutes = Router()

invoiceRoutes.get('/', getInvoices)

export { invoiceRoutes }