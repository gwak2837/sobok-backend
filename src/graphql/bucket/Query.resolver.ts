import { UserInputError } from 'apollo-server-express'

import { poolQuery } from '../../database/postgres'
import { spliceSQL } from '../../utils/ORM'
import type { QueryResolvers } from '../generated/graphql'
import { bucketORM, buildBasicBucketQuery } from './ORM'
import byId from './sql/byId.sql'
import byUserIdAndBucketType from './sql/byUserIdAndBucketType.sql'
import joinUserOnUniqueNameAndBucketType from './sql/joinUserOnUniqueNameAndBucketType.sql'
import onUniqueNameAndBucketType from './sql/onUniqueNameAndBucketType.sql'

const joinUserOnUserId = 'JOIN "user" ON "user".id = bucket.user_id'

export const Query: QueryResolvers = {
  bucket: async (_, { id }, { userId }, info) => {
    let [sql, columns, values] = await buildBasicBucketQuery(info, userId)

    sql = spliceSQL(sql, await byId, 'GROUP BY')
    values.push(id)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return bucketORM(rows, columns)[0]
  },

  buckets: async (_, { userUniqueName, type }, { userId }, info) => {
    if (!userId && !userUniqueName)
      throw new UserInputError('로그인 하거나 사용자 고유 이름을 입력해주세요')

    let [sql, columns, values] = await buildBasicBucketQuery(info, userId)

    if (userId) {
      sql = spliceSQL(sql, await byUserIdAndBucketType, 'GROUP BY')
      values.push(userId, type)
    } else {
      if (sql.includes('JOIN "user"')) {
        sql = spliceSQL(sql, await onUniqueNameAndBucketType, joinUserOnUserId, true)
        values.push(userUniqueName, type)
      } else {
        sql = spliceSQL(sql, await joinUserOnUniqueNameAndBucketType, 'WHERE')
        values.push(userUniqueName, type)
      }
    }

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return bucketORM(rows, columns)
  },
}
