import format from 'pg-format'
import type { MenuResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { selectColumnFromField } from '../../utils/ORM'
import { storeFieldColumnMapping, storeORM } from '../store/ORM'
import { decodeCategory } from './ORM'

const store = importSQL(__dirname, 'sql/store.sql')

export const Menu: MenuResolvers = {
  category: async ({ category }, __) => {
    return decodeCategory(category)
  },

  isInBucket: ({ isInBucket }) => {
    return !!isInBucket
  },

  isLiked: ({ isLiked }) => {
    return !!isLiked
  },

  // store: async ({ storeId }, __, ___, info) => {
  //   const columns = selectColumnFromField(info, storeFieldColumnMapping)

  //   const { rows } = await poolQuery(format(await store, columns), [storeId])

  //   return storeORM(rows[0])
  // },
}
