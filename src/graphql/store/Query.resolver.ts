import type { QueryResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { spliceSQL } from '../../utils/ORM'
import { buildBasicStoreQuery, encodeCategories, storeORM } from './ORM'
import { UserInputError } from 'apollo-server-express'

const byCategories = importSQL(__dirname, 'sql/byCategories.sql')
const byId = importSQL(__dirname, 'sql/byId.sql')
const byStoreBucketId = importSQL(__dirname, 'sql/byStoreBucketId.sql')
const byTown = importSQL(__dirname, 'sql/byTown.sql')
const byTownAndCategories = importSQL(__dirname, 'sql/byTownAndCategories.sql')
const joinStoreBucketOnStoreBucketId = importSQL(
  __dirname,
  'sql/joinStoreBucketOnStoreBucketId.sql'
)
const verifyUserBucket = importSQL(__dirname, 'sql/verifyUserBucket.sql')

export const Query: QueryResolvers = {
  store: async (_, { id }, { user }, info) => {
    let [sql, columns, values] = await buildBasicStoreQuery(info, user)

    sql = spliceSQL(sql, await byId, 'GROUP BY')
    values.push(id)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return storeORM(rows, columns)[0]
  },

  storesByTownAndCategory: async (_, { town, categories }, { user }, info) => {
    let encodedCategories

    if (categories) {
      if (categories.length === 0) throw new UserInputError('Invalid categories value')

      encodedCategories = encodeCategories(categories)

      if (encodedCategories.some((encodeCategory) => encodeCategory === null))
        throw new UserInputError('Invalid categories value')
    }

    let [sql, columns, values] = await buildBasicStoreQuery(info, user)

    if (town && categories) {
      sql = spliceSQL(sql, await byTownAndCategories, 'GROUP BY')
      values.push(town, encodedCategories)
    }
    //
    else if (town) {
      sql = spliceSQL(sql, await byTown, 'GROUP BY')
      values.push(town)
    }
    //
    else if (categories) {
      sql = spliceSQL(sql, await byCategories, 'GROUP BY')
      values.push(encodedCategories)
    }

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return storeORM(rows, columns)
  },

  storesInBucket: async (_, { bucketId }, { user }, info) => {
    const response = await poolQuery(await verifyUserBucket, [bucketId, user?.id])

    const result = response.rows[0].verify_user_bucket

    if (result === '1') throw new UserInputError('입력한 버킷 ID가 존재하지 않습니다.')
    if (result === '2') throw new UserInputError('입력한 버킷이 메뉴 버킷이 아닙니다.')

    const publicBucketOnly = result === '3' // TODO: 공개/비공개 버킷을 적절히 구분해서 응답

    let [sql, columns, values] = await buildBasicStoreQuery(info, user)

    if (sql.includes('LEFT JOIN bucket')) {
      sql = spliceSQL(sql, await byStoreBucketId, 'GROUP BY')
    } else {
      sql = spliceSQL(sql, await joinStoreBucketOnStoreBucketId, 'GROUP BY')
    }

    values.push(bucketId)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return storeORM(rows, columns)
  },
}
