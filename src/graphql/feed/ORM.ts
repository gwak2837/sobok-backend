import { camelToSnake } from '../../utils'
import type { Feed as GraphQLFeed } from '../generated/graphql'

// GraphQL fields -> Database columns
export function feedFieldColumnMapping(feedField: keyof GraphQLFeed) {
  switch (feedField) {
    case 'isLiked':
    case 'store':
    case 'user':
    case 'hashtags':
      return 'feed.id'
    default:
      return `feed.${camelToSnake(feedField)}`
  }
}

export function encodeRating(ratings: string) {
  switch (ratings) {
    case '맛있어요':
      return 3
    case '괜찮아요':
      return 2
    case '별로에요':
      return 1
    default:
      return null
  }
}

export function decodeRating(code: number) {
  switch (code) {
    case 3:
      return '맛있어요'
    case 2:
      return '괜찮아요'
    case 1:
      return '별로에요'
    default:
      return null
  }
}
