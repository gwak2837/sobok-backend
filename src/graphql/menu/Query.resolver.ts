import format from 'pg-format'
import type { QueryResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { selectColumnFromField } from '../../utils/ORM'
import { encodeCategory, menuFieldColumnMapping, menuORM } from './ORM'
import { UserInputError } from 'apollo-server-express'
import type { menu as Menu } from 'src/database/sobok'

const menu = importSQL(__dirname, 'sql/menu.sql')
const menuByName = importSQL(__dirname, 'sql/menuByName.sql')
const menus = importSQL(__dirname, 'sql/menus.sql')
const menusByCategory = importSQL(__dirname, 'sql/menusByCategory.sql')
const menusByStoreId = importSQL(__dirname, 'sql/menusByStoreId.sql')
const menusByTown = importSQL(__dirname, 'sql/menusByTown.sql')
const menusByTownAndCategory = importSQL(__dirname, 'sql/menusByTownAndCategory.sql')

export const Query: QueryResolvers = {
  menu: async (_, { id }, { user }, info) => {
    const columns = selectColumnFromField(info, menuFieldColumnMapping)

    const { rows } = await poolQuery<Menu>(format(await menu, columns), [id])

    return menuORM(rows[0])
  },

  menu2: async (_, { storeId, name }, { user }, info) => {
    const columns = selectColumnFromField(info, menuFieldColumnMapping)

    const { rowCount, rows } = await poolQuery<Menu>(format(await menuByName, columns), [
      storeId,
      name,
    ])

    if (rowCount === 0) return null

    return menuORM(rows[0])
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

    const { rows } = await poolQuery<Menu>(format(sql, selectedColumes), values)

    return rows.map((row) => menuORM(row))
  },

  menus2: async (_, { storeId }, { user }, info) => {
    const columns = selectColumnFromField(info, menuFieldColumnMapping)

    const { rows } = await poolQuery<Menu>(format(await menusByStoreId, columns), [storeId])

    return rows.map((row) => menuORM(row))
  },
}
