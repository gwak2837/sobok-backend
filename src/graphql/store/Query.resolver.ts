import format from 'pg-format'
import { QueryResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { selectColumnFromField } from '../../utils/ORM'
import { storeFieldColumnMapping, storeORM } from './ORM'

const store = importSQL(__dirname, 'sql/store.sql')
const stores = importSQL(__dirname, 'sql/stores.sql')
const storesByCategories = importSQL(__dirname, 'sql/storesByCategories.sql')
const storesByTown = importSQL(__dirname, 'sql/storesByTown.sql')
const storesByTownAndCategories = importSQL(__dirname, 'sql/storesByTownAndCategories.sql')

export const Query: QueryResolvers = {
  store: async (_, { id }, ___, info) => {
    const columns = selectColumnFromField(info, storeFieldColumnMapping)

    const { rows } = await poolQuery(format(await store, columns), [id])

    return storeORM(rows[0])
  },

  stores: async (_, { categories, town }, ___, info) => {
    const columns = selectColumnFromField(info, storeFieldColumnMapping)

    if (town && categories) {
      const { rows } = await poolQuery(format(await storesByTownAndCategories, columns), [
        town,
        categories,
      ])

      return rows.map((row) => storeORM(row))
    }

    if (town) {
      const { rows } = await poolQuery(format(await storesByTown, columns), [town])

      return rows.map((row) => storeORM(row))
    }

    if (categories) {
      const { rows } = await poolQuery(format(await storesByCategories, columns), [categories])

      return rows.map((row) => storeORM(row))
    }

    const { rows } = await poolQuery(format(await stores, columns))

    return rows.map((row) => storeORM(row))
  },
}
