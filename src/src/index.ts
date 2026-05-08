import { Server } from './server/server'
import { appRouter } from './presentation/app.router'
import { envs } from './infrastructure/config/environments'

async function main() {
  const server = new Server(envs.PORT, appRouter.getRoutes())
  await server.start()
}

main()