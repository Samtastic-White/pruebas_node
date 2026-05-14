import compression from 'compression'
import cors from 'cors'
import express, { type Router } from 'express'
import { apiReference } from '@scalar/express-api-reference'
import { connectMongo } from '../infrastructure/database/mongo/connection'
import { seedAdmin } from '../infrastructure/database/postgres/seeds/admin.seed'
import { eventService } from '../application/events/event.service'

const docsAuth = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization
  
  if (!auth || !auth.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic')
    return res.status(401).send('Autenticación requerida')
  }
  
  const [username, password] = Buffer.from(auth.split(' ')[1], 'base64')
    .toString()
    .split(':')
  
  if (username !== envs.DOCS_USERNAME || password !== envs.DOCS_PASSWORD) {
    return res.status(403).send('Acceso denegado')
  }
  
  next()
}

// Ruta de documentación
app.get('/api/docs', docsAuth, apiReference({
  theme: 'purple',
  metaData: {
    title: 'Marathon API',
    description: 'Documentación de la API de Marathon',
    author: 'Samtastic',
  },
  spec: {
    url: '/api/openapi.json',  // ← La especificación OpenAPI
  },
}))

export class Server {
  public readonly app = express()
  private readonly port: number
  private readonly routes: Router

  constructor(port: number, routes: Router) {
    this.port = port
    this.routes = routes
  }

  private middlewares(): void {
    this.app.disable('x-powered-by')
    this.app.use(cors())
    this.app.use(compression())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use('/api', this.routes)
    this.app.use((_req, res) => {
      res.status(404).json({ error: 'Ruta no encontrada' })
    })
  }

  public async start(): Promise<void> {
    this.middlewares()
    await connectMongo()
    await seedAdmin()
    await eventService.updateExpiredEvents()
    
    setInterval(() => {
      eventService.updateExpiredEvents()
    }, 30 * 60 * 1000)
    
    this.app.listen(this.port, () => {
      console.log(`🚀 Servidor en http://localhost:${this.port}`)
    })
  }
}