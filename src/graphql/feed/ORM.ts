import type { feed } from 'src/database/sobok'
import type { Feed } from 'src/graphql/generated/graphql'
import { camelToSnake, snakeKeyToCamelKey } from '../../utils/commons'

// All GraphQL fields -> Database columns
export function feedFieldColumnMapping(feedField: keyof Feed) {
  switch (feedField) {
    case 'user':
      return 'user_id'
    case 'comments':
      return 'id'
    case 'hashtags':
      return 'id'
    case 'menus':
      return 'id'
    case 'store':
      return 'store_id'
    default:
      return camelToSnake(feedField)
  }
}

// All database columns -> GraphQL fields
export function feedORM(feed: Partial<feed>): any {
  return {
    ...snakeKeyToCamelKey(feed),
  }
}
