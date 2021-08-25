import format from 'pg-format'
import type { QueryResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { selectColumnFromField } from '../../utils/ORM'
import { newsFieldColumnMapping, newsORM } from './ORM'

const news = importSQL(__dirname, 'sql/news.sql')
const newsListByStoreId = importSQL(__dirname, 'sql/newsListByStoreId.sql')

export const Query: QueryResolvers = {
  news: async (_, __, { user }, info) => {
    const columns = selectColumnFromField(info, newsFieldColumnMapping)

    const { rows } = await poolQuery(format(await news, columns))

    return newsORM(rows[0])
  },

  newsList2: async (_, { storeId }, { user }, info) => {
    const columns = selectColumnFromField(info, newsFieldColumnMapping)

    const { rows } = await poolQuery(format(await newsListByStoreId, columns), [storeId])

    return newsORM(rows[0])
  },
}
