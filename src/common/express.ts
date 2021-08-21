import express from 'express'

import { setPassportStrategies } from './passport'
import { apolloServer } from '../apollo/server'

export async function startApolloExpressServer() {
  const app = express()

  app.get('/', (req, res) => {
    res.status(200).send('Hello world')
  })

  setPassportStrategies(app)

  await apolloServer.start()

  apolloServer.applyMiddleware({
    app,
    cors: true, // 지워도 되나?
  })

  await new Promise((resolve) => {
    app.listen(process.env.PORT || 4000, resolve as () => void)
  })

  console.log(`🚀 Server ready at ${process.env.BACKEND_URL}${apolloServer.graphqlPath}`)
}
