import type { NewsResolvers } from 'src/graphql/generated/graphql'
import { decodeCategory } from './ORM'

export const News: NewsResolvers = {
  category: ({ category }) => {
    return decodeCategory(category)
  },

  isLiked: ({ isLiked }) => {
    return !!isLiked
  },
}
