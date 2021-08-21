import { Trend } from '../generated/graphql'
import { camelToSnake, snakeKeyToCamelKey } from '../../utils/commons'

// All GraphQL fields -> Database columns
export function trendFieldColumnMapping(trendField: keyof Trend) {
  switch (trendField) {
    default:
      return camelToSnake(trendField)
  }
}

// All database columns -> GraphQL fields
export function trendORM(trend: Record<string, any>): any {
  return {
    ...snakeKeyToCamelKey(trend),
  }
}
