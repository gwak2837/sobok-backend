import { buildBasicStoreQuery, encodeCategories, storeORM } from './ORM'

import { ApolloContext } from 'src/apollo/server'
import type { QueryResolvers } from 'src/graphql/generated/graphql'
import { UserInputError } from 'apollo-server-express'
import { importSQL } from '../../utils'
import { poolQuery } from '../../database/postgres'
import { spliceSQL } from '../../utils/ORM'

const byCategories = importSQL(__dirname, 'sql/byCategories.sql')
const byId = importSQL(__dirname, 'sql/byId.sql')
const byStoreBucketId = importSQL(__dirname, 'sql/byStoreBucketId.sql')
const byTown = importSQL(__dirname, 'sql/byTown.sql')
const byTownAndCategories = importSQL(__dirname, 'sql/byTownAndCategories.sql')
const joinHashtag = importSQL(__dirname, 'sql/joinHashtag.sql')
const joinStoreBucketOnStoreBucketId = importSQL(
  __dirname,
  'sql/joinStoreBucketOnStoreBucketId.sql'
)
const onHashtagName = importSQL(__dirname, 'sql/onHashtagName.sql')
const verifyUserBucket = importSQL(__dirname, 'sql/verifyUserBucket.sql')

const joinHashtagShort = 'JOIN hashtag ON hashtag.id = store_x_hashtag.hashtag_id'

export const Query: QueryResolvers<ApolloContext> = {
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
      if (categories.length === 0) throw new UserInputError('카테고리 배열은 비어있을 수 없습니다.')

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

  storesInBucket: async (_, { bucketId, userUniqueName }, { user }, info) => {
    const response = await poolQuery(await verifyUserBucket, [bucketId, userUniqueName, user?.id])

    const result = response.rows[0].verify_user_bucket

    if (result === '1') throw new UserInputError('입력한 버킷 ID가 존재하지 않습니다.')
    if (result === '2') throw new UserInputError('입력한 버킷이 메뉴 버킷이 아닙니다.')
    if (result === '3')
      throw new UserInputError('해당 사용자가 해당 버킷을 소유하고 있지 않습니다.')

    const publicBucketOnly = result === '4' // TODO: 공개/비공개 버킷을 적절히 구분해서 응답

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

  searchStores: async (_, { hashtags }, { user }, info) => {
    if (hashtags.length === 0) throw new UserInputError('해시태그 배열은 비어있을 수 없습니다.')

    let [sql, columns, values] = await buildBasicStoreQuery(info, user)

    if (sql.includes(joinHashtagShort)) {
      sql = spliceSQL(sql, await onHashtagName, joinHashtagShort, true)
    } else {
      sql = spliceSQL(sql, `${await joinHashtag} ${await onHashtagName}`, 'GROUP BY')
    }

    values.push(hashtags)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return storeORM(rows, columns)
  },
}
