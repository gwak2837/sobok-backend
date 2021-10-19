import { AuthenticationError } from 'apollo-server-express'

import { NotFoundError } from '../../apollo/errors'
import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { buildSQL, columnFieldMapping } from '../common/ORM'
import { NewsOptions, QueryResolvers } from '../generated/graphql'
import { validateStoreCategories } from '../store/ORM'
import joinLikedStore from './sql/joinLikedStore.sql'
import newsListByStore from './sql/newsListByStore.sql'
import newsListByTown from './sql/newsListByTown.sql'
import whereNewsCategory from './sql/whereNewsCategory.sql'
import whereStoreCategories from './sql/whereStoreCategories.sql'
import whereStoreTown from './sql/whereStoreTown.sql'

export const Query: QueryResolvers<ApolloContext> = {
  news: async (_, { id }, { userId }) => {
    let sql = ''
    const values = [userId, id]

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당 id의 소식을 찾을 수 없습니다.')

    return columnFieldMapping(rows[0])
  },

  newsListByStore: async (_, { storeId, categories }) => {
    const encodedStoreCategories = validateStoreCategories(categories)

    let sql = newsListByStore
    const values: unknown[] = [storeId]

    if (categories) {
      sql = buildSQL(sql, 'WHERE', whereNewsCategory)
      values.push(encodedStoreCategories)
    }

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당 조건의 피드를 찾을 수 없습니다.')

    return rows.map((row) => columnFieldMapping(row))
  },

  newsListByTown: async (_, { town, option, categories }, { userId }) => {
    const encodedStoreCategories = validateStoreCategories(categories)

    let sql = newsListByTown
    const values: unknown[] = []

    if (town) {
      sql = buildSQL(sql, 'WHERE', whereStoreTown)
      values.push(town)
    }

    if (option === NewsOptions.LikedStore) {
      if (!userId)
        throw new AuthenticationError('찜한 매장의 소식을 보고 싶다면 로그인 후 시도해주세요.')

      sql = buildSQL(sql, 'JOIN', joinLikedStore)
      values.push(userId)
    }

    if (categories) {
      sql = buildSQL(sql, 'WHERE', whereStoreCategories)
      values.push(encodedStoreCategories)
    }

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당 조건의 피드를 찾을 수 없습니다.')

    return rows.map((row) => columnFieldMapping(row))
  },
}
