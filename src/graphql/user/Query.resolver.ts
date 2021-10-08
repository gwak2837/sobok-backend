import { buildBasicUserQuery, userORM } from './ORM'

import { AuthenticationError } from 'apollo-server-express'
import { QueryResolvers } from '../generated/graphql'
import { importSQL } from '../../utils'
import { poolQuery } from '../../database/postgres'
import { spliceSQL } from '../../utils/ORM'

const byId = importSQL(__dirname, 'sql/byId.sql')
const isEmailUnique = importSQL(__dirname, 'sql/isEmailUnique.sql')
const isUniqueNameUnique = importSQL(__dirname, 'sql/isUniqueNameUnique.sql')

export const Query: QueryResolvers = {
  me: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    let [sql, columns, values] = await buildBasicUserQuery(info, user)

    sql = spliceSQL(sql, await byId, 'GROUP BY')
    values.push(user.id)

    const { rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    return userORM(rows, columns)[0]
  },

  isEmailUnique: async (_, { email }) => {
    const { rowCount } = await poolQuery(await isEmailUnique, [email])

    return rowCount === 0
  },

  isUniqueNameUnique: async (_, { uniqueName }) => {
    const { rowCount } = await poolQuery(await isUniqueNameUnique, [uniqueName])

    return rowCount === 0
  },
}
