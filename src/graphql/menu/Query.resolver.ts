import format from 'pg-format'
import type { QueryResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { selectColumnFromField, serializeSQLParameters } from '../../utils/ORM'
import { buildBasicMenuQuery, encodeCategory, menuFieldColumnMapping, menuORM } from './ORM'
import { UserInputError } from 'apollo-server-express'
import type { menu as Menu } from 'src/database/sobok'
import type { ApolloContext } from 'src/apollo/server'

const byId = importSQL(__dirname, 'sql/byId.sql')
const menuByName = importSQL(__dirname, 'sql/menuByName.sql')
const menus = importSQL(__dirname, 'sql/menus.sql')
const menusByCategory = importSQL(__dirname, 'sql/menusByCategory.sql')
const menusByStoreId = importSQL(__dirname, 'sql/menusByStoreId.sql')
const menusByTown = importSQL(__dirname, 'sql/menusByTown.sql')
const menusByTownAndCategory = importSQL(__dirname, 'sql/menusByTownAndCategory.sql')

export const Query: QueryResolvers<ApolloContext> = {
  menu: async (_, { id }, { user }, info) => {
    let [sql, columns, values] = await buildBasicMenuQuery(info, user)

    const i = sql.indexOf('GROUP BY')
    const parameterNumber = (sql.match(/\$/g)?.length ?? 0) + 1

    if (i !== -1) {
      sql = `${sql.slice(0, i)} ${await byId}${parameterNumber} ${sql.slice(i)}`
    } else {
      sql = `${sql} ${await byId}${parameterNumber}`
    }

    values.push(id)

    const { rows } = await poolQuery({
      text: serializeSQLParameters(sql),
      values,
      rowMode: 'array',
    })

    return menuORM(rows, columns)[0]
  },

  menu2: async (_, { storeId, name }, { user }, info) => {
    const columns = selectColumnFromField(info, menuFieldColumnMapping)

    const { rowCount, rows } = await poolQuery(format(await menuByName, columns), [storeId, name])

    if (rowCount === 0) return null

    return menuORM(rows[0], columns)[0]
  },

  menus: async (_, { town, category }, { user }, info) => {
    const columns = selectColumnFromField(info, menuFieldColumnMapping)

    const columnsWithTable = columns.map((column) => `menu.${column}`)

    const encodedCategory = encodeCategory(category)

    if (encodedCategory === null) throw new UserInputError('Invalid category value')

    let selectedColumes, sql, values: unknown[]

    if (town && category) {
      selectedColumes = columnsWithTable
      sql = await menusByTownAndCategory
      values = [town, encodedCategory]
    } else if (town) {
      selectedColumes = columnsWithTable
      sql = await menusByTown
      values = [town]
    } else if (category) {
      selectedColumes = columns
      sql = await menusByCategory
      values = [encodedCategory]
    } else {
      selectedColumes = columns
      sql = await menus
      values = []
    }

    const { rows } = await poolQuery(format(sql, selectedColumes), values)

    return rows.map((row) => menuORM(row, columns)[0])
  },

  menus2: async (_, { storeId }, { user }, info) => {
    const columns = selectColumnFromField(info, menuFieldColumnMapping)

    const { rows } = await poolQuery(format(await menusByStoreId, columns), [storeId])

    return rows.map((row) => menuORM(row, columns)[0])
  },
}
