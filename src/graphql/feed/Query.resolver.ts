import format from 'pg-format'
import type { QueryResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { selectColumnFromField, serializeSQLParameters } from '../../utils/ORM'
import { buildBasicFeedQuery, feedFieldColumnMapping, feedORM, feedORMv2 } from './ORM'
import { feed as Feed } from 'src/database/sobok'

const byId = importSQL(__dirname, 'sql/byId.sql')

export const Query: QueryResolvers = {
  feed: async (_, { id }, { user }, info) => {
    let [sql, columns, values] = await buildBasicFeedQuery(info, user)

    sql = `${sql} ${await byId}`
    values.push(id)

    const { rows } = await poolQuery({
      text: format(serializeSQLParameters(sql), columns),
      values,
      rowMode: 'array',
    })

    console.log(rows[0])

    return feedORMv2(rows, columns)[0]
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
