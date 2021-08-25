import format from 'pg-format'
import type { QueryResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { selectColumnFromField } from '../../utils/ORM'
import { menuFieldColumnMapping, menuORM } from './ORM'

const menu = importSQL(__dirname, 'sql/menu.sql')
const menus = importSQL(__dirname, 'sql/menus.sql')
const menusByCategory = importSQL(__dirname, 'sql/menusByCategory.sql')
const menusByStoreId = importSQL(__dirname, 'sql/menusByStoreId.sql')
const menusByTown = importSQL(__dirname, 'sql/menusByTown.sql')
const menusByTownAndCategory = importSQL(__dirname, 'sql/menusByTownAndCategory.sql')

export const Query: QueryResolvers = {
  menu: async (_, { id }, { user }, info) => {
    const columns = selectColumnFromField(info, menuFieldColumnMapping)

    const { rows } = await poolQuery(format(await menu, columns), [id])

    return menuORM(rows[0])
  },

  menus: async (_, { town, category }, { user }, info) => {
    const columns = selectColumnFromField(info, menuFieldColumnMapping)

    const columnsWithTable = columns.map((column) => `menu.${column}`)

    if (town && category) {
      const { rows } = await poolQuery(format(await menusByTownAndCategory, columnsWithTable), [
        town,
        category,
      ])

      return rows.map((row) => menuORM(row))
    }

    if (town) {
      const { rows } = await poolQuery(format(await menusByTown, columnsWithTable), [town])

      return rows.map((row) => menuORM(row))
    }

    if (category) {
      const { rows } = await poolQuery(format(await menusByCategory, columns), [category])

      return rows.map((row) => menuORM(row))
    }

    const { rows } = await poolQuery(format(await menus, columns))

    return rows.map((row) => menuORM(row))
  },

  menus2: async (_, { storeId }, { user }, info) => {
    const columns = selectColumnFromField(info, menuFieldColumnMapping)

    const { rows } = await poolQuery(format(await menusByStoreId, columns), [storeId])

    return rows.map((row) => menuORM(row))
  },
}
