import { AuthenticationError, UserInputError } from 'apollo-server-express'
import { NewsOptions, QueryResolvers } from '../../graphql/generated/graphql'
import { buildBasicNewsQuery, encodeCategory, newsORM } from './ORM'

import type { ApolloContext } from 'src/apollo/server'
import { importSQL } from '../../utils'
import { poolQuery } from '../../database/postgres'
import { spliceSQL } from '../../utils/ORM'

const byCategories = importSQL(__dirname, 'sql/byCategories.sql')
const byId = importSQL(__dirname, 'sql/byId.sql')
const byStoreId = importSQL(__dirname, 'sql/byStoreId.sql')
const byStoreIdAndCategories = importSQL(__dirname, 'sql/byStoreIdAndCategories.sql')
const joinLikedStore = importSQL(__dirname, 'sql/joinLikedStore.sql')
const joinStoreOnTown = importSQL(__dirname, 'sql/joinStoreOnTown.sql')
const onTown = importSQL(__dirname, 'sql/onTown.sql')

export const Query: QueryResolvers<ApolloContext> = {
  news: async (_, { id }, { user }, info) => {
    let [sql, columns, values] = await buildBasicNewsQuery(info, user)

    sql = spliceSQL(sql, await byId, 'GROUP BY')
    values.push(id)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return newsORM(rows, columns)[0]
  },

  newsListByStore: async (_, { storeId, categories }, { user }, info) => {
    let encodedCategories

    if (categories) {
      if (categories?.length === 0) throw new UserInputError('Invalid categories value')

      encodedCategories = categories.map((category) => encodeCategory(category))

      if (encodedCategories.some((encodeCategory) => encodeCategory === null))
        throw new UserInputError('Invalid categories value')
    }

    let [sql, columns, values] = await buildBasicNewsQuery(info, user)

    if (categories) {
      sql = spliceSQL(sql, await byStoreIdAndCategories, 'GROUP BY')
      values.push(storeId, encodedCategories)
    } else {
      sql = spliceSQL(sql, await byStoreId, 'GROUP BY')
      values.push(storeId)
    }

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return newsORM(rows, columns)
  },

  newsListByTown: async (_, { town, option, categories }, { user }, info) => {
    let encodedCategories

    if (categories) {
      if (categories?.length === 0) throw new UserInputError('Invalid categories value')

      encodedCategories = categories.map((category) => encodeCategory(category))

      if (encodedCategories.some((encodeCategory) => encodeCategory === null))
        throw new UserInputError('Invalid categories value')
    }

    let [sql, columns, values] = await buildBasicNewsQuery(info, user)

    if (town) {
      if (sql.includes('JOIN store')) {
        sql = spliceSQL(sql, await onTown, 'JOIN store ON store.id = news.store_id', true)
      } else {
        sql = spliceSQL(sql, await joinStoreOnTown, 'WHERE')
      }
      values.push(town)
    }

    if (option === NewsOptions.LikedStore) {
      if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

      sql = spliceSQL(sql, await joinLikedStore, 'WHERE')
      values.push(user.id)
    }

    if (categories) {
      sql = spliceSQL(sql, await byCategories, 'GROUP BY')
      values.push(encodedCategories)
    }

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return newsORM(rows, columns)
  },
}
