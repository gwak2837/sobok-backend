import { UserInputError } from 'apollo-server-express'
import type { QueryResolvers } from 'src/graphql/generated/graphql'
import { bucketORM, buildBasicBucketQuery } from './ORM'
import { spliceSQL } from '../../utils/ORM'
import { poolQuery } from '../../database/postgres'
import { importSQL } from '../../utils/commons'

const byId = importSQL(__dirname, 'sql/byId.sql')
const byUserIdAndBucketType = importSQL(__dirname, 'sql/byUserIdAndBucketType.sql')
const joinUserOnUniqueNameAndBucketType = importSQL(
  __dirname,
  'sql/joinUserOnUniqueNameAndBucketType.sql'
)
const onUniqueNameAndBucketType = importSQL(__dirname, 'sql/onUniqueNameAndBucketType.sql')

const joinUserOnUserId = 'JOIN "user" ON "user".id = bucket.user_id'

export const Query: QueryResolvers = {
  bucket: async (_, { id }, { user }, info) => {
    let [sql, columns, values] = await buildBasicBucketQuery(info, user)

    sql = spliceSQL(sql, await byId, 'GROUP BY')
    values.push(id)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return bucketORM(rows, columns)[0]
  },

  buckets: async (_, { userUniqueName, type }, { user }, info) => {
    if (!user && !userUniqueName) throw new UserInputError('로그인 하거나 사용자 ID를 입력해주세요')

    let [sql, columns, values] = await buildBasicBucketQuery(info, user)

    if (user) {
      sql = spliceSQL(sql, await byUserIdAndBucketType, 'GROUP BY')
      values.push(user.id, type)
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
