import { AuthenticationError } from 'apollo-server-express'

import { poolQuery } from '../../database/postgres'
import { graphqlRelationMapping } from '../common/ORM'
import { QueryResolvers } from '../generated/graphql'
import isEmailUnique from './sql/isEmailUnique.sql'
import isUniqueNameUnique from './sql/isUniqueNameUnique.sql'
import me from './sql/me.sql'

export const Query: QueryResolvers = {
  me: async (_, __, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const sql = me
    const values = [userId]

    const { rows } = await poolQuery(sql, values)

    return graphqlRelationMapping(rows[0], 'user')
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
