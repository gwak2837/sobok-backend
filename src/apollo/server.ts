import { ApolloServer } from 'apollo-server-express'
import schema from '../graphql/schema'
import { userORM } from '../graphql/user/ORM'
import { poolQuery } from '../database/postgres'
import { verifyJWT } from '../utils/jwt'
import { importSQL } from '../utils/commons'

const user = importSQL(__dirname, 'sql/user.sql')

export const apolloServer = new ApolloServer({
  context: async ({ req }) => {
    const token = req.headers.authorization || ''

    const result = await verifyJWT(token).catch(() => {
      return null
    })

    if (!result) return { user: null } // JWT가 아니거나, JWT 서명이 유효하지 않거나, JWT 유효기간이 만료됐을 때

    const { rowCount, rows } = await poolQuery(await user, [result.userId, result.lastLoginDate])

    if (!rowCount) return { user: null } // 로그아웃 등으로 인해 JWT가 유효하지 않을 때

    return { user: userORM(rows[0]) }
  },
  introspection: true,
  playground: true,
  schema,
})
