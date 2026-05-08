import compression from 'compression'
import cors from 'cors'
import express, { type Router } from 'express'
import { connectMongo } from '../infrastructure/database/mongo/connection'


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
    this.app.listen(this.port, () => {
      console.log(` Servidor en http://localhost:${this.port}`)
    })
  }
}