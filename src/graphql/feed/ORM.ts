import type { feed } from 'src/database/sobok'
import type { Feed } from 'src/graphql/generated/graphql'
import { camelToSnake, snakeKeyToCamelKey } from '../../utils/commons'

// All GraphQL fields -> Database columns
export function feedFieldColumnMapping(feedField: keyof Feed) {
  switch (feedField) {
    default:
      return camelToSnake(feedField)
  }
}

// All database columns -> GraphQL fields
export function feedORM(feed: feed): any {
  return {
    ...snakeKeyToCamelKey(feed),
  }
}
