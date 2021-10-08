import { UserInputError } from 'apollo-server-express'

import { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { spliceSQL } from '../../utils/ORM'
import type { QueryResolvers } from '../generated/graphql'
import { buildBasicStoreQuery, encodeCategories, storeORM } from './ORM'
import byCategories from './sql/byCategories.sql'
import byId from './sql/byId.sql'
import byStoreBucketId from './sql/byStoreBucketId.sql'
import byTown from './sql/byTown.sql'
import byTownAndCategories from './sql/byTownAndCategories.sql'
import joinHashtag from './sql/joinHashtag.sql'
import joinStoreBucketOnStoreBucketId from './sql/joinStoreBucketOnStoreBucketId.sql'
import onHashtagName from './sql/onHashtagName.sql'
import verifyUserBucket from './sql/verifyUserBucket.sql'

const joinHashtagShort = 'JOIN hashtag ON hashtag.id = store_x_hashtag.hashtag_id'

export const Query: QueryResolvers<ApolloContext> = {
  store: async (_, { id }, { userId }, info) => {
    let [sql, columns, values] = await buildBasicStoreQuery(info, userId)

    sql = spliceSQL(sql, byId, 'GROUP BY')
    values.push(id)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return storeORM(rows, columns)[0]
  },

  storesByTownAndCategory: async (_, { town, categories }, { userId }, info) => {
    let encodedCategories

    if (categories) {
      if (categories.length === 0) throw new UserInputError('카테고리 배열은 비어있을 수 없습니다.')

      encodedCategories = encodeCategories(categories)

      if (encodedCategories.some((encodeCategory) => encodeCategory === null))
        throw new UserInputError('Invalid categories value')
    }

    let [sql, columns, values] = await buildBasicStoreQuery(info, userId)

    if (town && categories) {
      sql = spliceSQL(sql, byTownAndCategories, 'GROUP BY')
      values.push(town, encodedCategories)
    }
    //
    else if (town) {
      sql = spliceSQL(sql, byTown, 'GROUP BY')
      values.push(town)
    }
    //
    else if (categories) {
      sql = spliceSQL(sql, byCategories, 'GROUP BY')
      values.push(encodedCategories)
    }

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return storeORM(rows, columns)
  },

  storesInBucket: async (_, { bucketId, userUniqueName }, { userId }, info) => {
    const response = await poolQuery(verifyUserBucket, [bucketId, userUniqueName, userId])

    const result = response.rows[0].verify_user_bucket

    if (result === '1') throw new UserInputError('입력한 버킷 ID가 존재하지 않습니다.')
    if (result === '2') throw new UserInputError('입력한 버킷이 메뉴 버킷이 아닙니다.')
    if (result === '3')
      throw new UserInputError('해당 사용자가 해당 버킷을 소유하고 있지 않습니다.')

    const publicBucketOnly = result === '4' // TODO: 공개/비공개 버킷을 적절히 구분해서 응답

    let [sql, columns, values] = await buildBasicStoreQuery(info, userId)

    if (sql.includes('LEFT JOIN bucket')) {
      sql = spliceSQL(sql, byStoreBucketId, 'GROUP BY')
    } else {
      sql = spliceSQL(sql, joinStoreBucketOnStoreBucketId, 'GROUP BY')
    }

    values.push(bucketId)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return storeORM(rows, columns)
  },

  searchStores: async (_, { hashtags }, { userId }, info) => {
    if (hashtags.length === 0) throw new UserInputError('해시태그 배열은 비어있을 수 없습니다.')

    let [sql, columns, values] = await buildBasicStoreQuery(info, userId)

    if (sql.includes(joinHashtagShort)) {
      sql = spliceSQL(sql, onHashtagName, joinHashtagShort, true)
    } else {
      sql = spliceSQL(sql, `${joinHashtag} ${onHashtagName}`, 'GROUP BY')
    }

    values.push(hashtags)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return storeORM(rows, columns)
  },
}
