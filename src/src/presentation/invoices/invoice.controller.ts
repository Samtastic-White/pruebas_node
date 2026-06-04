import { Request, Response } from 'express'
import { invoiceService } from '../../application/invoices/invoice.service'

export const getInvoices = async (_req: Request, res: Response) => {
  try {
    const invoices = await invoiceService.getAll()
    res.json(invoices)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener facturas' })
  }
}