import format from 'pg-format'
import type { QueryResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { selectColumnFromField } from '../../utils/ORM'
import { encodeCategory, newsFieldColumnMapping, newsORM } from './ORM'
import { UserInputError } from 'apollo-server-express'

const news = importSQL(__dirname, 'sql/news.sql')
const newsList = importSQL(__dirname, 'sql/newsList.sql')
const newsListByStoreId = importSQL(__dirname, 'sql/newsListByStoreId.sql')
const newsListByStoreIdAndCategories = importSQL(
  __dirname,
  'sql/newsListByStoreIdAndCategories.sql'
)

export const Query: QueryResolvers = {
  news: async (_, { id }, { user }, info) => {
    const columns = selectColumnFromField(info, newsFieldColumnMapping)

    const { rows } = await poolQuery(format(await news, columns), [id])

    return newsORM(rows[0])
  },

  news2: async (_, __, { user }, info) => {
    const columns = selectColumnFromField(info, newsFieldColumnMapping)

    const { rows } = await poolQuery(format(await newsList, columns))

    return rows.map((row) => newsORM(row))
  },

  news3: async (_, { storeId, categories }, { user }, info) => {
    const columns = selectColumnFromField(info, newsFieldColumnMapping)

    if (categories) {
      if (categories.length === 0) throw new UserInputError('Invalid categories value')

      const encodedCategories = categories.map((category) => encodeCategory(category))

      if (encodedCategories.some((encodeCategory) => encodeCategory === null))
        throw new UserInputError('Invalid categories value')

      const { rows } = await poolQuery(format(await newsListByStoreIdAndCategories, columns), [
        storeId,
        encodedCategories,
      ])

      return rows.map((row) => newsORM(row))
    }

    const { rows } = await poolQuery(format(await newsListByStoreId, columns), [storeId])

    return rows.map((row) => newsORM(row))
  },
}
