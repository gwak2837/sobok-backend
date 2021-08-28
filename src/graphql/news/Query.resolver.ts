import format from 'pg-format'
import type { QueryResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { selectColumnFromField } from '../../utils/ORM'
import { encodeCategory, newsFieldColumnMapping, newsORM } from './ORM'
import { UserInputError } from 'apollo-server-express'
import type { news as News } from 'src/database/sobok'

const news = importSQL(__dirname, 'sql/news.sql')
const newsList = importSQL(__dirname, 'sql/newsList.sql')
const newsListByLikedStores = importSQL(__dirname, 'sql/newsListByLikedStores.sql')
const newsListByStoreId = importSQL(__dirname, 'sql/newsListByStoreId.sql')
const newsListByStoreIdAndCategories = importSQL(
  __dirname,
  'sql/newsListByStoreIdAndCategories.sql'
)

export const Query: QueryResolvers = {
  news: async (_, { id }, { user }, info) => {
    const columns = selectColumnFromField(info, newsFieldColumnMapping)

    const { rows } = await poolQuery<News>(format(await news, columns), [id])

    return newsORM(rows[0])
  },

  news2: async (_, __, { user }, info) => {
    const columns = selectColumnFromField(info, newsFieldColumnMapping)

    const { rows } = await poolQuery<News>(format(await newsList, columns))

    const storeIds = rows.map((row) => row.store_id)

    console.log(storeIds)

    return rows.map((row) => ({
      ...newsORM(row),
      store: { id: '1', name: 'name', imageUrls: ['https://www.cmd.com'] },
    }))
  },

  news3: async (_, { storeId, categories }, { user }, info) => {
    const columns = selectColumnFromField(info, newsFieldColumnMapping)

    let result

    if (categories) {
      if (categories.length === 0) throw new UserInputError('Invalid categories value')

      const encodedCategories = categories.map((category) => encodeCategory(category))

      if (encodedCategories.some((encodeCategory) => encodeCategory === null))
        throw new UserInputError('Invalid categories value')

      result = await poolQuery<News>(format(await newsListByStoreIdAndCategories, columns), [
        storeId,
        encodedCategories,
      ])
    } else {
      result = await poolQuery<News>(format(await newsListByStoreId, columns), [storeId])
    }

    return result.rows.map((row) => newsORM(row))
  },

  news4: async (_, __, { user }, info) => {
    const columns = selectColumnFromField(info, newsFieldColumnMapping)

    const { rows } = await poolQuery<News>(format(await newsListByLikedStores, columns), [user.id])

    return rows.map((row) => newsORM(row))
  },
}
