import { UserInputError } from 'apollo-server-express'

import { NotFoundError } from '../../apollo/errors'
import { poolQuery } from '../../database/postgres'
import { buildSQL, columnFieldMapping } from '../common/ORM'
import type { QueryResolvers } from '../generated/graphql'
import buckets from './sql/buckets.sql'
import joinUserOnUniqueNameAndBucketType from './sql/joinUserOnUniqueNameAndBucketType.sql'
import whereUserIdAndBucketType from './sql/whereUserIdAndBucketType.sql'

export const Query: QueryResolvers = {
  buckets: async (_, { userUniqueName, type }, { userId }) => {
    if (!userId && !userUniqueName)
      throw new UserInputError('로그인 하거나 사용자 고유 이름을 입력해주세요')

    let sql = buckets
    const values = []

    if (userId) {
      sql = buildSQL(sql, 'WHERE', whereUserIdAndBucketType)
      values.push(userId, type)
    } else {
      sql = buildSQL(sql, 'JOIN', joinUserOnUniqueNameAndBucketType)
      values.push(userUniqueName, type)
    }

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당 조건의 버킷을 찾을 수 없습니다.')

    return rows.map((row) => columnFieldMapping(row))
  },
}
