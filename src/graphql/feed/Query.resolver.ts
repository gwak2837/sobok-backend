import type { ApolloContext } from 'src/apollo/server'
import type { QueryResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { buildBasicFeedQuery, feedORM } from './ORM'
import { spliceSQL } from '../../utils/ORM'

const byId = importSQL(__dirname, 'sql/byId.sql')

export const Query: QueryResolvers<ApolloContext> = {
  feed: async (_, { id }, { user }, info) => {
    let [sql, columns, values] = await buildBasicFeedQuery(info, user)

    const i = sql.indexOf('GROUP BY')
    const groupbyIndex = i !== -1 ? i : null

    sql = spliceSQL(sql, await byId, groupbyIndex ?? sql.length)
    values.push(id)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return feedORM(rows, columns)[0]
  },

  // feedByStore: async (_, { storeId }, { user }, info) => {
  //   const columns = selectColumnFromField(info, feedFieldColumnMapping)

  //   const { rows } = await poolQuery(format(await feedListByStoreId, columns), [storeId])

  //   return rows.map((row) => feedORM(row))
  // },

  // feedByTown: async (_, { town }, { user }, info) => {
  //   const columns = selectColumnFromField(info, feedFieldColumnMapping)

  //   const columnsWithTable = columns.map((column) => `feed.${column}`)

  //   const { rows } = await poolQuery(format(await feedListByTown, columnsWithTable), [town])

  //   return rows.map((row) => feedORM(row))
  // },
}
