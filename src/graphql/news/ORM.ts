import type { news } from 'src/database/sobok'
import type { News } from 'src/graphql/generated/graphql'
import { camelToSnake, snakeKeyToCamelKey } from '../../utils/commons'

// All GraphQL fields -> Database columns
export function newsFieldColumnMapping(newsField: keyof News) {
  switch (newsField) {
    default:
      return camelToSnake(newsField)
  }
}

// All database columns -> GraphQL fields
export function newsORM(news: news): any {
  return {
    ...snakeKeyToCamelKey(news),
  }
}
