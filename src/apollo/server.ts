/* eslint-disable no-console */
import http from 'http'

import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'

import { poolQuery } from '../database/postgres'
import schema from '../graphql/schema'
import { setPassportStrategies } from '../lib/passport'
import { verifyJWT } from '../utils/jwt'
import user from './sql/user.sql'

export type ApolloContext = {
  userId?: string
}

export async function startApolloServer() {
  // Required logic for integrating with Express
  const app = express()
  const httpServer = http.createServer(app)
  setPassportStrategies(app)

  // Same ApolloServer initialization as before, plus the drain plugin.
  const apolloServer = new ApolloServer({
    context: async ({ req }) => {
      const jwt = req.headers.authorization
      if (!jwt) return {}

      const verifiedJwt = await verifyJWT(jwt).catch(() => null)
      if (!verifiedJwt) return {}

      const { rowCount, rows } = await poolQuery(user, [
        verifiedJwt.userId,
        new Date(((verifiedJwt.iat ?? 0) + 2) * 1000),
      ])

      // 로그아웃 등으로 인해 JWT가 유효하지 않을 때
      if (!rowCount) return {}

      return { userId: rows[0].id }
    },
    introspection: process.env.NODE_ENV === 'development',
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    schema,
  })

  // More required logic for integrating with Express
  await apolloServer.start()
  apolloServer.applyMiddleware({ app })

  // Modified server startup
  const port = process.env.PORT ?? 4000
  return new Promise((resolve) => {
    httpServer.listen(port, () => resolve(`http://localhost:${port}${apolloServer.graphqlPath}`))
  })
}
