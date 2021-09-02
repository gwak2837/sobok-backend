import type { QueryResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { spliceSQL } from '../../utils/ORM'
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

    sql = spliceSQL(sql, await byId, 'GROUP BY')
    values.push(id)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return menuORM(rows, columns)[0]
  },

  menuByName: async (_, { storeId, name }, { user }, info) => {
    let [sql, columns, values] = await buildBasicMenuQuery(info, user)

    sql = spliceSQL(sql, await byName, 'GROUP BY')
    values.push(storeId, name)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return menuORM(rows, columns)[0]
  },

  menusByTownAndCategory: async (_, { town, category }, { user }, info) => {
    const encodedCategory = encodeCategory(category)

    if (encodedCategory === null) throw new UserInputError('Invalid category value')

    let [sql, columns, values] = await buildBasicMenuQuery(info, user)

    if (town && category) {
      sql = spliceSQL(sql, await joinStoreOnTownAndCategory, 'WHERE')
      values.push(town, encodedCategory)
    } else if (town) {
      sql = spliceSQL(sql, await joinStoreOnTown, 'WHERE')
      values.push(town)
    } else if (category) {
      sql = spliceSQL(sql, await byCategory, 'GROUP BY')
      values.push(encodedCategory)
    }

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return menuORM(rows, columns)
  },

  menusByStore: async (_, { storeId }, { user }, info) => {
    let [sql, columns, values] = await buildBasicMenuQuery(info, user)

    sql = spliceSQL(sql, await byStoreId, 'GROUP BY')
    values.push(storeId)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return menuORM(rows, columns)
  },
}
