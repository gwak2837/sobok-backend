import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express from 'express'
import http from 'http'
import { poolQuery } from '../database/postgres'
import schema from '../graphql/schema'
import user from './sql/user.sql'
import { verifyJWT } from '../utils/jwt'

export type ApolloContext =
  | {
      userId?: string
    }
  | undefined

export async function startApolloServer() {
  // Required logic for integrating with Express
  const app = express()
  const httpServer = http.createServer(app)

  // Same ApolloServer initialization as before, plus the drain plugin.
  const apolloServer = new ApolloServer({
    context: async ({ req }) => {
      const jwt = req.headers.authorization ?? ''

      if (!jwt) return

      const verifiedJwt = await verifyJWT(jwt).catch(() => null)

      if (!verifiedJwt) return

      const { rowCount, rows } = await poolQuery(user, [
        verifiedJwt.userId,
        new Date(((verifiedJwt.iat ?? 0) + 2) * 1000),
      ])

      // 로그아웃 등으로 인해 JWT가 유효하지 않을 때
      if (!rowCount) return

      return { userId: rows[0].id }
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    schema,
  })

  // More required logic for integrating with Express
  await apolloServer.start()
  apolloServer.applyMiddleware({ app })

  // Modified server startup
  const port = process.env.PORT ?? 4000
  httpServer.listen(port, () =>
    console.log(`🚀 Server ready at http://localhost:${port}${apolloServer.graphqlPath}`)
  )
}
