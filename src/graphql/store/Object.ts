import type { StoreResolvers } from '../generated/graphql'
import { decodeStoreCategories } from './ORM'

export const Store: StoreResolvers = {
  categories: ({ categories }, __) => {
    return decodeStoreCategories(categories)
  },

  isInBucket: ({ isInBucket }) => {
    return !!isInBucket
  },

  isLiked: ({ isLiked }) => {
    return !!isLiked
  },
}
