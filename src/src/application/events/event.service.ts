import Stripe from 'stripe'
import { eventRepository } from '../../infrastructure/database/postgres/repositories/event.repository'
import { logSuccess, logError } from '../../infrastructure/database/dynamodb/services/logservice'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia'
})

const log = async (
  type: 'success' | 'error',
  accion: string,
  mensajeODetalles?: string | object
) => {
  if (type === 'success') {
    await logSuccess({
      accion,
      usuario: 'admin',
      modulo: 'events',
      detalles: mensajeODetalles as object
    })
  } else {
    await logError({
      accion,
      usuario: 'admin',
      modulo: 'events',
      mensaje: (mensajeODetalles as string) || ''
    })
  }
}

export const eventService = {
  getAll: async () => {
    try {
      const events = await eventRepository.findAll()
      await log('success', 'EVENTS_LISTED', { total: events.length })
      return events
    } catch (error: any) {
      await log('error', 'GET_EVENTS_ERROR', error.message)
      throw error
    }
  },

  getById: async (id: number) => {
    try {
      const event = await eventRepository.findById(id)
      if (!event) {
        await log('error', 'EVENT_NOT_FOUND', `Evento ${id} no encontrado`)
        return null
      }
      await log('success', 'EVENT_RETRIEVED', { event_id: event.id, name: event.name })
      return event
    } catch (error: any) {
      await log('error', 'GET_EVENT_ERROR', error.message)
      throw error
    }
  },

  create: async (data: any) => {
    try {
      let stripeProductId: string | null = null
      let stripePriceId: string | null = null

      if (data.price > 0) {
        const product = await stripe.products.create({
          name: data.name,
          description: data.description || undefined,
          metadata: {
            location: data.location || '',
            distance: data.distance || '',
            event_date: data.event_date || '',
          },
        })
        stripeProductId = product.id

        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(Number(data.price) * 100),
          currency: 'usd',
        })
        stripePriceId = price.id
      }

      const newEvent = await eventRepository.create({
        ...data,
        stripe_product_id: stripeProductId,
        stripe_price_id: stripePriceId,
      })

      await log('success', 'EVENT_CREATED', { event_id: newEvent.id, name: newEvent.name })
      return newEvent
    } catch (error: any) {
      await log('error', 'CREATE_EVENT_ERROR', error.message)
      throw error
    }
  },

  update: async (id: number, data: any) => {
    try {
      const existingEvent = await eventRepository.findById(id)

      let stripeProductId = existingEvent?.stripe_product_id || null
      let stripePriceId = existingEvent?.stripe_price_id || null

      if (data.price > 0) {
        if (stripeProductId) {
          await stripe.products.update(stripeProductId, {
            name: data.name,
            description: data.description || undefined,
          })

          if (Number(data.price) !== Number(existingEvent?.price)) {
            const newPrice = await stripe.prices.create({
              product: stripeProductId,
              unit_amount: Math.round(Number(data.price) * 100),
              currency: 'usd',
            })
            stripePriceId = newPrice.id
          }
        } else {
          const product = await stripe.products.create({
            name: data.name,
            description: data.description || undefined,
          })
          stripeProductId = product.id

          const price = await stripe.prices.create({
            product: product.id,
            unit_amount: Math.round(Number(data.price) * 100),
            currency: 'usd',
          })
          stripePriceId = price.id
        }
      }

      const updated = await eventRepository.update(id, {
        ...data,
        stripe_product_id: stripeProductId,
        stripe_price_id: stripePriceId,
      })

      if (!updated) {
        await log('error', 'EVENT_NOT_FOUND_UPDATE', `Evento ${id} no encontrado`)
        return null
      }

      await log('success', 'EVENT_UPDATED', { event_id: updated.id, name: updated.name })
      return updated
    } catch (error: any) {
      await log('error', 'UPDATE_EVENT_ERROR', error.message)
      throw error
    }
  },

  delete: async (id: number) => {
    try {
      const deleted = await eventRepository.delete(id)
      if (!deleted) {
        await log('error', 'EVENT_NOT_FOUND_DELETE', `Evento ${id} no encontrado para eliminar`)
        return false
      }
      await log('success', 'EVENT_DELETED', { event_id: id })
      return true
    } catch (error: any) {
      await log('error', 'DELETE_EVENT_ERROR', error.message)
      throw error
    }
  },

  updateExpiredEvents: async () => {
    const today = new Date().toISOString().split('T')[0]
    const updated = await eventRepository.updateExpired(today)
    if (updated > 0) {
      console.log(` ${updated} marcado como finalizado`)
    }
  },
}