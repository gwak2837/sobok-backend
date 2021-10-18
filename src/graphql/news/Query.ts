import { AuthenticationError, UserInputError } from 'apollo-server-express'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { spliceSQL } from '../common/ORM'
import { NewsOptions, QueryResolvers } from '../generated/graphql'
import { buildBasicNewsQuery, encodeCategory, newsORM } from './ORM'
import byCategories from './sql/byCategories.sql'
import byId from './sql/byId.sql'
import byStoreId from './sql/byStoreId.sql'
import byStoreIdAndCategories from './sql/byStoreIdAndCategories.sql'
import joinLikedStore from './sql/joinLikedStore.sql'
import joinStoreOnTown from './sql/joinStoreOnTown.sql'
import onTown from './sql/onTown.sql'

export const Query: QueryResolvers<ApolloContext> = {
  news: async (_, { id }, { userId }, info) => {
    let [sql, columns, values] = await buildBasicNewsQuery(info, userId)

    sql = spliceSQL(sql, byId, 'GROUP BY')
    values.push(id)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return newsORM(rows, columns)[0]
  },

  newsListByStore: async (_, { storeId, categories }, { userId }, info) => {
    let encodedStoreCategories

    if (categories) {
      if (categories?.length === 0) throw new UserInputError('Invalid categories value')

      encodedStoreCategories = categories.map((category) => encodeCategory(category))

      if (encodedStoreCategories.some((encodeCategory) => encodeCategory === null))
        throw new UserInputError('Invalid categories value')
    }

    let [sql, columns, values] = await buildBasicNewsQuery(info, userId)

    if (categories) {
      sql = spliceSQL(sql, byStoreIdAndCategories, 'GROUP BY')
      values.push(storeId, encodedStoreCategories)
    } else {
      sql = spliceSQL(sql, byStoreId, 'GROUP BY')
      values.push(storeId)
    }

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return newsORM(rows, columns)
  },

  newsListByTown: async (_, { town, option, categories }, { userId }, info) => {
    let encodedCategories

    if (categories) {
      if (categories?.length === 0) throw new UserInputError('Invalid categories value')

      encodedCategories = categories.map((category) => encodeCategory(category))

      if (encodedCategories.some((encodeCategory) => encodeCategory === null))
        throw new UserInputError('Invalid categories value')
    }

    let [sql, columns, values] = await buildBasicNewsQuery(info, userId)

    if (town) {
      if (sql.includes('JOIN store')) {
        sql = spliceSQL(sql, onTown, 'JOIN store ON store.id = news.store_id', true)
      } else {
        sql = spliceSQL(sql, joinStoreOnTown, 'WHERE')
      }
      values.push(town)
    }

    if (option === NewsOptions.LikedStore) {
      if (!userId)
        throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

      sql = spliceSQL(sql, joinLikedStore, 'WHERE')
      values.push(userId)
    }

    if (categories) {
      sql = spliceSQL(sql, byCategories, 'GROUP BY')
      values.push(encodedCategories)
    }

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return newsORM(rows, columns)
  },
}
