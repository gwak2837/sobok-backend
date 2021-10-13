import { AuthenticationError } from 'apollo-server-express'

import { poolQuery } from '../../database/postgres'
import { buildSQL, spliceSQL } from '../../utils/ORM'
import { QueryResolvers } from '../generated/graphql'
import { buildBasicUserQuery, userORM } from './ORM'
import byId from './sql/byId.sql'
import isEmailUnique from './sql/isEmailUnique.sql'
import isUniqueNameUnique from './sql/isUniqueNameUnique.sql'

export const Query: QueryResolvers = {
  me: async (_, __, { userId }, info) => {
    if (!userId) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    let sql = buildBasicUserQuery(info)
    const values = []

    sql = buildSQL(sql, 'WHERE', '"user".id = $1')
    values.push(userId)

    const { rows } = await poolQuery(sql, values)

    return userORM(rows)[0]
  },

  isEmailUnique: async (_, { email }) => {
    const { rowCount } = await poolQuery(isEmailUnique, [email])

    return rowCount === 0
  },

  isUniqueNameUnique: async (_, { uniqueName }) => {
    const { rowCount } = await poolQuery(isUniqueNameUnique, [uniqueName])

    return rowCount === 0
  },

  myComments: async (_, __, { userId }) => {
    return []
  },
}
