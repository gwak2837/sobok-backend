import type { MenuResolvers } from '../generated/graphql'
import { decodeMenuCategory } from './ORM'

export const Menu: MenuResolvers = {
  category: async ({ category }, __) => {
    return decodeMenuCategory(category)
  },

  isInBucket: ({ isInBucket }) => {
    return !!isInBucket
  },

  isLiked: ({ isLiked }) => {
    return !!isLiked
  },
}
