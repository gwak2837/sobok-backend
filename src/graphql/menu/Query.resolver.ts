import type { QueryResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { serializeSQLParameters, spliceSQL } from '../../utils/ORM'
import { buildBasicMenuQuery, encodeCategory, menuORM } from './ORM'
import { UserInputError } from 'apollo-server-express'
import type { ApolloContext } from 'src/apollo/server'

const byCategory = importSQL(__dirname, 'sql/byCategory.sql')
const byId = importSQL(__dirname, 'sql/byId.sql')
const byName = importSQL(__dirname, 'sql/byName.sql')
const byStoreId = importSQL(__dirname, 'sql/byStoreId.sql')
const joinStoreOnTown = importSQL(__dirname, 'sql/joinStoreOnTown.sql')
const joinStoreOnTownAndCategory = importSQL(__dirname, 'sql/joinStoreOnTownAndCategory.sql')

export const Query: QueryResolvers<ApolloContext> = {
  menu: async (_, { id }, { user }, info) => {
    let [sql, columns, values] = await buildBasicMenuQuery(info, user)

    const i = sql.indexOf('GROUP BY')
    const groupbyIndex = i !== -1 ? i : null

    sql = spliceSQL(sql, await byId, groupbyIndex ?? sql.length)
    values.push(id)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return menuORM(rows, columns)[0]
  },

  menuByName: async (_, { storeId, name }, { user }, info) => {
    let [sql, columns, values] = await buildBasicMenuQuery(info, user)

    const i = sql.indexOf('GROUP BY')
    const groupbyIndex = i !== -1 ? i : null

    sql = spliceSQL(sql, await byName, groupbyIndex ?? sql.length)
    values.push(storeId, name)

    const { rowCount, rows } = await poolQuery({
      text: serializeSQLParameters(sql),
      values,
      rowMode: 'array',
    })

    if (rowCount === 0) return null

    return menuORM(rows, columns)[0]
  },

  menusByTownAndCategory: async (_, { town, category }, { user }, info) => {
    const encodedCategory = encodeCategory(category)

    if (encodedCategory === null) throw new UserInputError('Invalid category value')

    let [sql, columns, values] = await buildBasicMenuQuery(info, user)

    const i = sql.indexOf('WHERE')
    const j = sql.indexOf('GROUP BY')
    const whereIndex = i !== -1 ? i : null
    const groupbyIndex = j !== -1 ? j : null

    if (town && category) {
      sql = spliceSQL(sql, await joinStoreOnTownAndCategory, whereIndex ?? sql.length)
      values.push(town, encodedCategory)
    } else if (town) {
      sql = spliceSQL(sql, await joinStoreOnTown, whereIndex ?? sql.length)
      values.push(town)
    } else if (category) {
      sql = spliceSQL(sql, await byCategory, groupbyIndex ?? sql.length)
      values.push(encodedCategory)
    }

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return menuORM(rows, columns)
  },

  menusByStore: async (_, { storeId }, { user }, info) => {
    let [sql, columns, values] = await buildBasicMenuQuery(info, user)

    const i = sql.indexOf('GROUP BY')
    const whereIndex = i !== -1 ? i : null

    sql = spliceSQL(sql, await byStoreId, whereIndex ?? sql.length)
    values.push(storeId)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return menuORM(rows, columns)
  },
}
