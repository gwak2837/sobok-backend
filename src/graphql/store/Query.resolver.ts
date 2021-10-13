import { UserInputError } from 'apollo-server-core'

import { NotFoundError } from '../../apollo/errors'
import { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { applyPaginationAndSorting, buildSQL, validatePaginationAndSorting } from '../../utils/ORM'
import { QueryResolvers } from '../generated/graphql'
import { storeORM, validateStoreCategories } from './ORM'
import searchStores from './sql/searchStores.sql'
import store from './sql/store.sql'
import storeInfo from './sql/storeInfo.sql'
import storesByTownAndCategories from './sql/storesByTownAndCategories.sql'
import storesInBucket from './sql/storesInBucket.sql'
import verifyUserBucket from './sql/verifyUserBucket.sql'
import whereCategories from './sql/whereCategories.sql'
import whereTown from './sql/whereTown.sql'
import whereTownAndCategories from './sql/whereTownAndCategories.sql'

export const StoreOrderBy = {
  NAME: 'name',
}

export const Query: QueryResolvers<ApolloContext> = {
  store: async (_, { id }, { userId }) => {
    let sql = store
    const values = [userId, id]

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당 id의 매장을 찾을 수 없습니다.')

    return storeORM(rows)[0]
  },

  storeInfo: async (_, { id }) => {
    let sql = storeInfo
    const values = [id]

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당 id의 매장을 찾을 수 없습니다.')

    return storeORM(rows)[0]
  },

  storesByTownAndCategory: async (_, { town, categories, order, pagination }, { userId }) => {
    const encodedCategories = validateStoreCategories(categories)
    validatePaginationAndSorting(order, pagination)

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
    if (rowCount === 0) throw new NotFoundError('해당하는 매장을 찾을 수 없습니다.')

    return storeORM(rows)
  },

  storesInBucket: async (_, { bucketId, userUniqueName }, { userId }, info) => {
    const response = await poolQuery(verifyUserBucket, [bucketId, userUniqueName, userId])

    const result = response.rows[0].verify_user_bucket

    if (result === '1') throw new UserInputError('해당 bucketId의 버킷이 존재하지 않습니다.')
    if (result === '2') throw new UserInputError('해당 bucketId의 버킷이 매장 버킷이 아닙니다.')
    if (result === '3')
      throw new UserInputError('해당 사용자가 해당 bucketId의 버킷을 소유하고 있지 않습니다.')

    const publicBucketOnly = result === '4' // TODO: 공개/비공개 버킷을 적절히 구분해서 응답

    let sql = storesInBucket
    const values: unknown[] = [userId, bucketId]

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당 id의 버킷에 매장이 존재하지 않습니다.')

    return storeORM(rows)
  },

  searchStores: async (_, { hashtags, order, pagination }, { userId }, info) => {
    if (hashtags.length === 0) throw new UserInputError('hashtags 배열은 비어있을 수 없습니다.')
    validatePaginationAndSorting(order, pagination)

    let sql = searchStores
    const values = [hashtags, userId]

    sql = applyPaginationAndSorting(sql, values, 'store', order, pagination)

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('hashtags가 포함된 매장을 찾을 수 없습니다.')

    return storeORM(rows)
  },
}
