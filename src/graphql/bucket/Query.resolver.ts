import { AuthenticationError } from 'apollo-server-express'
import format from 'pg-format'
import { QueryResolvers } from 'src/graphql/generated/graphql'
import { selectColumnFromField, spliceSQL } from '../../utils/ORM'
import { poolQuery } from '../../database/postgres'
import { importSQL } from '../../utils/commons'

import type { user as User } from 'src/database/sobok'
import { bucketORM, buildBasicBucketQuery } from './ORM'
import { buildBasicMenuQuery } from '../menu/ORM'

const byId = importSQL(__dirname, 'sql/byId.sql')
const byUserIdAndMenuBucket = importSQL(__dirname, 'sql/byUserIdAndMenuBucket.sql')
const byUserIdAndStoreBucket = importSQL(__dirname, 'sql/byUserIdAndStoreBucket.sql')

export const Query: QueryResolvers = {
  bucket: async (_, { id }, { user }, info) => {
    let [sql, columns, values] = await buildBasicBucketQuery(info, user)

    sql = spliceSQL(sql, await byId, 'GROUP BY')
    values.push(id)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return bucketORM(rows, columns)[0]
  },

  menuBuckets: async (_, __, { user }, info) => {
    let [sql, columns, values] = await buildBasicBucketQuery(info, user)

    sql = spliceSQL(sql, await byUserIdAndStoreBucket, 'GROUP BY')
    values.push(user.id)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return bucketORM(rows, columns)
  },

  storeBuckets: async (_, __, { user }, info) => {
    let [sql, columns, values] = await buildBasicBucketQuery(info, user)

    sql = spliceSQL(sql, await byUserIdAndMenuBucket, 'GROUP BY')
    values.push(user.id)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return bucketORM(rows, columns)
  },
}
