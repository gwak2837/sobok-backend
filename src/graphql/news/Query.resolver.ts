import format from 'pg-format'
import type { QueryResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { selectColumnFromField, selectColumnFromSubField } from '../../utils/ORM'
import { encodeCategory, newsFieldColumnMapping, newsORM } from './ORM'
import { UserInputError } from 'apollo-server-express'
import type { news as News, store as Store } from 'src/database/sobok'
import graphqlFields from 'graphql-fields'
import { storeFieldColumnMapping } from '../store/ORM'

const news = importSQL(__dirname, 'sql/news.sql')
const newsList = importSQL(__dirname, 'sql/newsList.sql')
const newsListByLikedStores = importSQL(__dirname, 'sql/newsListByLikedStores.sql')
const newsListByStoreId = importSQL(__dirname, 'sql/newsListByStoreId.sql')
const newsListByStoreIdAndCategories = importSQL(
  __dirname,
  'sql/newsListByStoreIdAndCategories.sql'
)
const stores = importSQL(__dirname, 'sql/stores.sql')

export const Query: QueryResolvers = {
  news: async (_, { id }, { user }, info) => {
    const columns = selectColumnFromField(info, newsFieldColumnMapping)

    const { rows } = await poolQuery<News>(format(await news, columns), [id])

    return newsORM(rows[0])
  },

  news2: async (_, __, { user }, info) => {
    const columns = selectColumnFromField(info, newsFieldColumnMapping)

    const { rows } = await poolQuery<News>(format(await newsList, columns))

    // if (colu) {
    //   const storeColumns = selectColumnFromSubField(
    //     graphqlFields(info).store,
    //     storeFieldColumnMapping
    //   )

    //   const storeIds = rows.map((row) => row.store_id)

    //   const storesResult = await poolQuery<Store>(format(await stores, storeColumns), [storeIds])

    //   return
    // }

    // store: { id: '1', name: 'name', imageUrls: ['https://www.cmd.com'] },

    return rows.map((row) => newsORM(row))
  },

  news3: async (_, { storeId, categories }, { user }, info) => {
    const columns = selectColumnFromField(info, newsFieldColumnMapping)

    let sql, values: unknown[]

    if (categories) {
      if (categories.length === 0) throw new UserInputError('Invalid categories value')

      const encodedCategories = categories.map((category) => encodeCategory(category))

      if (encodedCategories.some((encodeCategory) => encodeCategory === null))
        throw new UserInputError('Invalid categories value')

      sql = await newsListByStoreIdAndCategories
      values = [storeId, encodedCategories]
    } else {
      sql = await newsListByStoreId
      values = [storeId]
    }

    const { rows } = await poolQuery<News>(format(sql, columns), values)

    return rows.map((row) => newsORM(row))
  },

  news4: async (_, __, { user }, info) => {
    const columns = selectColumnFromField(info, newsFieldColumnMapping)

    const { rows } = await poolQuery<News>(format(await newsListByLikedStores, columns), [user.id])

    return rows.map((row) => newsORM(row))
  },
}
