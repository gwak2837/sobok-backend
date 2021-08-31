import type { FeedResolvers } from 'src/graphql/generated/graphql'
import { decodeRating } from './ORM'

export const Feed: FeedResolvers = {
  rating: ({ rating }) => {
    return decodeRating(rating)
  },

  isLiked: ({ isLiked }) => {
    return !!isLiked
  },
}
