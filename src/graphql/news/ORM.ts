import { News } from '../generated/graphql'
import { camelToSnake, snakeKeyToCamelKey } from '../../utils/commons'

// All GraphQL fields -> Database columns
export function newsFieldColumnMapping(newsField: keyof News) {
  switch (newsField) {
    default:
      return camelToSnake(newsField)
  }
}

// All database columns -> GraphQL fields
export function newsORM(news: Record<string, any>): any {
  return {
    ...snakeKeyToCamelKey(news),
  }
}
