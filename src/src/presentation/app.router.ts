import { Router } from 'express'
import { healthRoutes } from './health/health.routes'
import { eventsRoutes } from './events/events.routes'
import { authRoutes } from './auth/auth.routes'
import { paymentRoutes } from './payment/payment.routes'
import { registrationsRoutes } from './registrations'
import { runnersRoutes } from './runners'
import { invoiceRoutes } from './invoices/invoices.routes'

class AppRouter {
  private readonly router: Router

  constructor() {
    this.router = Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    const routes: Array<{ path: string; router: Router }> = [
      { path: "/health", router: healthRoutes },
      { path: '/events', router: eventsRoutes },
      { path: '/registrations', router: registrationsRoutes },
      { path: '/auth', router: authRoutes },
      { path: '/runners', router: runnersRoutes },
      { path: '/payment', router: paymentRoutes },
      { path: '/invoices', router: invoiceRoutes },
    ]

    routes.forEach(({ path, router }) => {
      this.router.use(path, router)
    })
  }

  public getRoutes(): Router {
    return this.router
  }
}

export const appRouter = new AppRouter()