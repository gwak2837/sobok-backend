import { Comment } from '../generated/graphql'
import { camelToSnake, snakeKeyToCamelKey } from '../../utils/commons'

// All GraphQL fields -> Database columns
export function commentFieldColumnMapping(commentField: keyof Comment) {
  switch (commentField) {
    default:
      return camelToSnake(commentField)
  }
}

// All database columns -> GraphQL fields
export function commentORM(comment: Record<string, any>): any {
  return {
    ...snakeKeyToCamelKey(comment),
  }
}
