import type { bucket } from 'src/database/sobok'
import type { Bucket } from 'src/graphql/generated/graphql'
import { camelToSnake, snakeKeyToCamelKey } from '../../utils/commons'

// All GraphQL fields -> Database columns
export function bucketFieldColumnMapping(bucketField: keyof Bucket) {
  switch (bucketField) {
    default:
      return camelToSnake(bucketField)
  }
}

// All database columns -> GraphQL fields
export function bucketORM(bucket: Partial<bucket>): any {
  return {
    ...snakeKeyToCamelKey(bucket),
  }
}
