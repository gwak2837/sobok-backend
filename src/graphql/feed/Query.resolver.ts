import format from 'pg-format'
import type { QueryResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { selectColumnFromField } from '../../utils/ORM'
import { feedFieldColumnMapping, feedORM } from './ORM'
import { feed as Feed } from 'src/database/sobok'

const feed = importSQL(__dirname, 'sql/feed.sql')
const feedListByStoreId = importSQL(__dirname, 'sql/feedListByStoreId.sql')
const feedListByTown = importSQL(__dirname, 'sql/feedListByTown.sql')

export const Query: QueryResolvers = {
  feed: async (_, { id }, { user }, info) => {
    const columns = selectColumnFromField(info, feedFieldColumnMapping)

    const { rows } = await poolQuery(format(await feed, columns), [id])

    return feedORM(rows[0])
  },

  feed2: async (_, { storeId }, { user }, info) => {
    const columns = selectColumnFromField(info, feedFieldColumnMapping)

    const { rows } = await poolQuery(format(await feedListByStoreId, columns), [storeId])

    return rows.map((row) => feedORM(row))
  },

  feed3: async (_, { town }, { user }, info) => {
    const columns = selectColumnFromField(info, feedFieldColumnMapping)

    const columnsWithTable = columns.map((column) => `feed.${column}`)

    const { rows } = await poolQuery(format(await feedListByTown, columnsWithTable), [town])

    return rows.map((row) => feedORM(row))
  },
}
