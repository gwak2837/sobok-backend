import { ApolloServer } from 'apollo-server-express'
import schema from '../graphql/schema'
import { poolQuery } from '../database/postgres'
import { verifyJWT } from '../utils/jwt'
import { importSQL } from '../utils/commons'

export type ApolloContext = {
  user?: { id: string }
}

const user = importSQL(__dirname, 'sql/user.sql')

export const apolloServer = new ApolloServer({
  context: async ({ req }) => {
    const token = req.headers.authorization || ''

    const jwt = await verifyJWT(token).catch(() => {
      return null
    })

    // JWT가 아니거나, JWT 서명이 유효하지 않거나, JWT 유효기간이 만료됐을 때
    if (!jwt) return { user: null }

    const { rowCount, rows } = await poolQuery(await user, [
      jwt.userId,
      new Date(jwt.iat as number),
    ])

    // 로그아웃 등으로 인해 JWT가 유효하지 않을 때
    if (!rowCount) return { user: null }

    return { user: rows[0] } as ApolloContext
  },
  schema,
})
