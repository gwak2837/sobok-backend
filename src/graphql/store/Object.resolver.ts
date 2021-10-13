import { NotImplementedError } from '../../apollo/errors'
import type { StoreResolvers } from '../generated/graphql'
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
