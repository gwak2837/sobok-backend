import { UserInputError } from 'apollo-server-express'

import { poolQuery } from '../../database/postgres'
import { basicORM, buildSQL, spliceSQL } from '../../utils/ORM'
import type { QueryResolvers } from '../generated/graphql'
import { buildBasicBucketQuery } from './ORM'
import byId from './sql/byId.sql'
import byUserIdAndBucketType from './sql/byUserIdAndBucketType.sql'
import joinUserOnUniqueNameAndBucketType from './sql/joinUserOnUniqueNameAndBucketType.sql'
import onUniqueNameAndBucketType from './sql/onUniqueNameAndBucketType.sql'

const joinUserOnUserId = 'JOIN "user" ON "user".id = bucket.user_id'

export const Query: QueryResolvers = {
  bucket: async (_, { id }, { userId }, info) => {
    let [sql, columns, values] = await buildBasicBucketQuery(info, userId)

    sql = buildSQL(sql, 'WHERE', byId)
    values.push(id)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return basicORM(rows)[0]
  },

  buckets: async (_, { userUniqueName, type }, { userId }, info) => {
    if (!userId && !userUniqueName)
      throw new UserInputError('로그인 하거나 사용자 고유 이름을 입력해주세요')

    let [sql, columns, values] = await buildBasicBucketQuery(info, userId)

    if (userId) {
      sql = buildSQL(sql, 'WHERE', byUserIdAndBucketType)
      values.push(userId, type)
    } else {
      if (sql.includes('JOIN "user"')) {
        sql = spliceSQL(sql, onUniqueNameAndBucketType, joinUserOnUserId, true)
        values.push(userUniqueName, type)
      } else {
        sql = buildSQL(sql, 'JOIN', joinUserOnUniqueNameAndBucketType)
        values.push(userUniqueName, type)
      }
    }

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return basicORM(rows)
  },
}
