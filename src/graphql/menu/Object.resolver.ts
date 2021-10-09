import type { MenuResolvers } from '../generated/graphql'
import { decodeCategory } from './ORM'

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
