import type { FeedResolvers } from 'src/graphql/generated/graphql'
import { decodeRating } from './ORM'

export const Feed: FeedResolvers = {
  isLiked: ({ isLiked }) => {
    return !!isLiked
  },

  rating: ({ rating }) => {
    return decodeRating(rating)
  },
}
