import { Router } from 'express'
import { eventsRoutes } from './events/events.routes'
import { registrationsRoutes } from './registrations/registrations.routes'
import { authRoutes } from './auth/auth.routes'

class AppRouter {
  private readonly router: Router

  constructor() {
    this.router = Router()
    this.initializeRoutes()
  }

  private initializeRoutes(): void {
    const routes: Array<{ path: string; router: Router }> = [
      { path: '/events', router: eventsRoutes },
      { path: '/registrations', router: registrationsRoutes },
      { path: '/auth', router: authRoutes },
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