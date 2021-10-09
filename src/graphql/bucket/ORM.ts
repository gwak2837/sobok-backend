import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'
import format from 'pg-format'

import { ApolloContext } from '../../apollo/server'
import { camelToSnake, removeQuotes, snakeToCamel, tableColumnRegEx } from '../../utils'
import { selectColumnFromSubField, serializeParameters } from '../../utils/ORM'
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
  let columns = selectColumns
    ? selectColumnFromSubField(bucketFields, bucketFieldColumnMapping)
    : []
  const values: any[] = []

  if (firstBucketFields.has('user')) {
    const userColumns = selectColumnFromSubField(bucketFields.user, userFieldColumnMapping)

    sql = `${sql} ${joinUser}`
    columns = [...columns, ...userColumns]
  }

  return [format(serializeParameters(sql), columns), columns, values] as const
}

// Database records -> GraphQL fields
export function bucketORM(rows: unknown[][], selectedColumns: string[]): GraphQLBucket[] {
  return rows.map((row) => {
    const graphQLBucket: any = {}

    selectedColumns.forEach((selectedColumn, i) => {
      const [_, __] = (selectedColumn.match(tableColumnRegEx) ?? [''])[0].split('.')
      const tableName = removeQuotes(_)
      const columnName = removeQuotes(__)
      const camelTableName = snakeToCamel(tableName)
      const camelColumnName = snakeToCamel(columnName)
      const cell = row[i]

      if (tableName === 'bucket') {
        graphQLBucket[camelColumnName] = cell
      }
      //
      else {
        if (!graphQLBucket[camelTableName]) {
          graphQLBucket[camelTableName] = {}
        }

        graphQLBucket[camelTableName][camelColumnName] = cell
      }
    })

    return graphQLBucket
  })
}
