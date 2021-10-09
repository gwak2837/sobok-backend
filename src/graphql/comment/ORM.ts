import type { comment } from '../../database/sobok'
import { camelToSnake, snakeKeyToCamelKey } from '../../utils'
import type { Comment } from '../generated/graphql'

// All GraphQL fields -> Database columns
export function commentFieldColumnMapping(commentField: keyof Comment) {
  switch (commentField) {
    default:
      return `comment.${camelToSnake(commentField)}`
  }
}

// All database columns -> GraphQL fields
export function commentORM(comment: Partial<comment>): any {
  return {
    ...snakeKeyToCamelKey(comment),
  }
}
