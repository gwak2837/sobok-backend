import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'
import format from 'pg-format'

import { ApolloContext } from '../../apollo/server'
import { camelToSnake, removeQuotes, snakeToCamel, tableColumnRegEx } from '../../utils'
import { selectColumnFromField } from '../common/ORM'
import type { Bucket as GraphQLBucket } from '../generated/graphql'
import { userFieldColumnMapping } from '../user/ORM'
import fromBucket from './sql/fromBucket.sql'
import joinUser from './sql/joinUser.sql'

const bucketFieldsFromOtherTable = new Set(['user'])

// GraphQL fields -> Database columns
export function bucketFieldColumnMapping(bucketField: keyof GraphQLBucket) {
  if (bucketFieldsFromOtherTable.has(bucketField)) {
    return 'bucket.id'
  }

  return `bucket.${camelToSnake(bucketField)}`
}

// GraphQL fields -> SQL
export async function buildBasicBucketQuery(
  info: GraphQLResolveInfo,
  userId: ApolloContext['userId'],
  selectColumns = true
) {
  const bucketFields = graphqlFields(info) as Record<string, any>
  const firstBucketFields = new Set(Object.keys(bucketFields))

  let sql = fromBucket
  let columns = selectColumns ? selectColumnFromField(bucketFields, bucketFieldColumnMapping) : []
  const values: any[] = []

  if (firstBucketFields.has('user')) {
    const userColumns = selectColumnFromField(bucketFields.user, userFieldColumnMapping)

    sql = `${sql} ${joinUser}`
    columns = [...columns, ...userColumns]
  }

  return [sql, columns, values] as const
}
