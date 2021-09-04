import type { StoreResolvers } from 'src/graphql/generated/graphql'
import { decodeCategories } from './ORM'

export const Store: StoreResolvers = {
  categories: ({ categories }, __) => {
    return decodeCategories(categories)
  },

  isInBucket: ({ isInBucket }) => {
    return !!isInBucket
  },

  isLiked: ({ isLiked }) => {
    return !!isLiked
  },
}
