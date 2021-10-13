import { UserInputError } from 'apollo-server-core'

import { NotFoundError } from '../../apollo/errors'
import { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import {
  applyPaginationAndSorting,
  buildSQL,
  objectRelationMapping,
  spliceSQL,
} from '../../utils/ORM'
import { QueryResolvers } from '../generated/graphql'
import { buildBasicStoreQuery, validateStoreCategories } from './ORM'
import byStoreBucketId from './sql/byStoreBucketId.sql'
import joinHashtag from './sql/joinHashtag.sql'
import joinStoreBucketOnStoreBucketId from './sql/joinStoreBucketOnStoreBucketId.sql'
import onHashtagName from './sql/onHashtagName.sql'
import store from './sql/store.sql'
import storeInfo from './sql/storeInfo.sql'
import storesByTownAndCategories from './sql/storesByTownAndCategories.sql'
import verifyUserBucket from './sql/verifyUserBucket.sql'
import whereCategories from './sql/whereCategories.sql'
import whereTown from './sql/whereTown.sql'
import whereTownAndCategories from './sql/whereTownAndCategories.sql'

const joinHashtagShort = 'JOIN hashtag ON hashtag.id = store_x_hashtag.hashtag_id'

export const StoreOrderBy = {
  NAME: 'name',
}

export const Query: QueryResolvers<ApolloContext> = {
  store: async (_, { id }, { userId }) => {
    let sql = store
    const values = [userId, id]

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당 id의 매장을 찾을 수 없습니다.')

    return objectRelationMapping(rows)[0]
  },

  storeInfo: async (_, { id }) => {
    let sql = storeInfo
    const values = [id]

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당 id의 매장을 찾을 수 없습니다.')

    return objectRelationMapping(rows)[0]
  },

  storesByTownAndCategory: async (_, { town, categories, order, pagination }, { userId }) => {
    const encodedCategories = validateStoreCategories(categories)

    // validate order, pagination

    let sql = storesByTownAndCategories
    const values: unknown[] = [userId]

    if (town && categories) {
      sql = buildSQL(sql, 'WHERE', whereTownAndCategories)
      values.push(town, encodedCategories)
    } else if (town) {
      sql = buildSQL(sql, 'WHERE', whereTown)
      values.push(town)
    } else if (categories) {
      sql = buildSQL(sql, 'WHERE', whereCategories)
      values.push(encodedCategories)
    }

    sql = applyPaginationAndSorting(sql, values, 'store', order, pagination)

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) return null

    return objectRelationMapping(rows)
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

    return objectRelationMapping(rows)
  },

  searchStores: async (_, { hashtags, order, pagination }, { userId }, info) => {
    // Input validation
    if (hashtags.length === 0) throw new UserInputError('해시태그 배열은 비어있을 수 없습니다.')
    if (order && !order.by && !order.direction)
      throw new UserInputError('order 객체는 비어있을 수 없습니다.')
    if (!pagination.lastId && pagination.lastValue)
      throw new UserInputError('pagination.lastId가 존재해야 합니다.')

    // Build SQL query
    let [sql, columns, values] = await buildBasicStoreQuery(info, userId)

    if (sql.includes(joinHashtagShort)) {
      sql = spliceSQL(sql, onHashtagName, joinHashtagShort, true)
    } else {
      sql = spliceSQL(sql, `${joinHashtag} ${onHashtagName}`, 'GROUP BY')
    }
    values.push(hashtags)

    sql = applyPaginationAndSorting(sql, values, 'store', order, pagination)

    // Request to database
    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })
    if (rowCount === 0) return null

    // Process response
    return objectRelationMapping(rows)
  },
}
