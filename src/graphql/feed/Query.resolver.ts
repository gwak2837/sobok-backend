import type { QueryResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { buildBasicFeedQuery, feedORM } from './ORM'
import type { ApolloContext } from 'src/apollo/server'

const byId = importSQL(__dirname, 'sql/byId.sql')

export const Query: QueryResolvers<ApolloContext> = {
  feed: async (_, { id }, { user }, info) => {
    let [sql, columns, values] = await buildBasicFeedQuery(info, user)

    const i = sql.indexOf('GROUP BY')
    const parameterNumber = (sql.match(/\$/g)?.length ?? 0) + 1

    if (i !== -1) {
      sql = `${sql.slice(0, i)} ${await byId}${parameterNumber} ${sql.slice(i)}`
    } else {
      sql = `${sql} ${await byId}${parameterNumber}`
    }

    values.push(id)

    const { rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    return feedORM(rows, columns)[0]
  },

  // feedByOneStore: async (_, { storeId }, { user }, info) => {
  //   const columns = selectColumnFromField(info, feedFieldColumnMapping)

  //   const { rows } = await poolQuery(format(await feedListByStoreId, columns), [storeId])

  //   return rows.map((row) => feedORM(row))
  // },

  // feedByOneTown: async (_, { town }, { user }, info) => {
  //   const columns = selectColumnFromField(info, feedFieldColumnMapping)

  //   const columnsWithTable = columns.map((column) => `feed.${column}`)

  //   const { rows } = await poolQuery(format(await feedListByTown, columnsWithTable), [town])

  //   return rows.map((row) => feedORM(row))
  // },
}
