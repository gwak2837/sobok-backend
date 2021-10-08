import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'
import format from 'pg-format'

import type { ApolloContext } from '../../apollo/server'
import type { user as DatabaseUser } from '../../database/sobok'
import { camelToSnake, removeQuotes, snakeToCamel, tableColumnRegEx } from '../../utils'
import {
  removeColumnWithAggregateFunction,
  selectColumnFromSubField,
  serializeSQLParameters,
} from '../../utils/ORM'
import { commentFieldColumnMapping } from '../comment/ORM'
import { feedFieldColumnMapping } from '../feed/ORM'
import type { User as GraphQLUser } from '../generated/graphql'
import { Provider } from '../generated/graphql'
import fromUser from './sql/fromUser.sql'
import joinComment from './sql/joinComment.sql'
import joinFeed from './sql/joinFeed.sql'
import joinFollower from './sql/joinFollower.sql'
import joinFollowing from './sql/joinFollowing.sql'

const userFieldsFromOtherTable = new Set([
  'comments',
  'feed',
  'followings',
  'followers',
  'likedComments',
  'likedFeed',
  'likedMenus',
  'likedNews',
  'likedStores',
  'likedTrends',
  'menuBuckets',
  'storeBuckets',
])

const privateUserField = new Set([
  'creationTime',
  'modificationTime',
  'email',
  'name',
  'phone',
  'isEmailVerified',
  'providers',
])

// GraphQL fields -> Database columns
export function userFieldColumnMapping(userField: keyof GraphQLUser) {
  if (userField === 'providers') {
    return ['"user".id', '"user".google_oauth', '"user".naver_oauth', '"user".kakao_oauth']
  }
  //
  else if (userFieldsFromOtherTable.has(userField)) {
    return '"user".id'
  }
  //
  else if (privateUserField.has(userField)) {
    return ['"user".id', `"user".${camelToSnake(userField)}`]
  }

  return `"user".${camelToSnake(userField)}`
}

// GraphQL fields -> SQL
export async function buildBasicUserQuery(
  info: GraphQLResolveInfo,
  userId: ApolloContext['userId'],
  selectColumns = true
) {
  const userFields = graphqlFields(info) as Record<string, any>
  const firstUserFields = new Set(Object.keys(userFields))

  let sql = await fromUser
  let columns = selectColumns ? selectColumnFromSubField(userFields, userFieldColumnMapping) : []
  const values: unknown[] = []
  let groupBy = false

  if (firstUserFields.has('comments')) {
    const commentColumns = selectColumnFromSubField(
      userFields.comments,
      commentFieldColumnMapping
    ).map((column) => `array_agg(${column})`)

    sql = `${sql} ${await joinComment}`
    columns = [...columns, ...commentColumns]
    groupBy = true
  }

  if (firstUserFields.has('feed')) {
    const feedColumns = selectColumnFromSubField(userFields.feed, feedFieldColumnMapping).map(
      (column) => `array_agg(${column})`
    )

    sql = `${sql} ${await joinFeed}`
    columns = [...columns, ...feedColumns]
    groupBy = true
  }

  if (firstUserFields.has('followings')) {
    const userColumns = selectColumnFromSubField(userFields.followings, userFieldColumnMapping).map(
      (column) => `array_agg(DISTINCT following.${column})`
    )

    sql = `${sql} ${await joinFollowing}`
    columns = [...columns, ...userColumns]
    groupBy = true
  }

  if (firstUserFields.has('followers')) {
    const userColumns = selectColumnFromSubField(userFields.followers, userFieldColumnMapping).map(
      (column) => `array_agg(DISTINCT follower.${column})`
    )

    sql = `${sql} ${await joinFollower}`
    columns = [...columns, ...userColumns]
    groupBy = true
  }

  const filteredColumns = columns.filter(removeColumnWithAggregateFunction)

  if (groupBy && filteredColumns.length > 0) {
    sql = `${sql} GROUP BY ${filteredColumns}`
  }

  return [format(serializeSQLParameters(sql), columns), columns, values] as const
}

// Database records -> GraphQL fields
export function userORM(rows: unknown[][], selectedColumns: string[]): GraphQLUser[] {
  return rows.map((row) => {
    const graphQLUser: any = {}

    selectedColumns.forEach((selectedColumn, i) => {
      const [_, __] = (selectedColumn.match(tableColumnRegEx) ?? [''])[0].split('.')
      const tableName = removeQuotes(_)
      const columnName = removeQuotes(__)
      const camelTableName = snakeToCamel(tableName)
      const camelColumnName = snakeToCamel(columnName)
      const cell = row[i]

      if (tableName === 'user') {
        graphQLUser[camelColumnName] = cell
      }
      //
      else if (tableName === 'isInBuckeet') {
        if (cell) {
          graphQLUser.isInBucket = true
        }
      }
      //
      else if (tableName === 'user_x_liked_menu') {
        if (cell) {
          graphQLUser.isLiked = true
        }
      }
      //
      else if (tableName === 'hashtag') {
        graphQLUser.hashtags = cell
      }
      //
      else {
        if (!graphQLUser[camelTableName]) {
          graphQLUser[camelTableName] = {}
        }

        graphQLUser[camelTableName][camelColumnName] = cell
      }
    })

    return graphQLUser
  })
}

// export function userORM(user: Partial<DatabaseUser>): any {
//   return {
//     ...snakeKeyToCamelKey(user),
//     providers: decodeProviders(user),
//   }
// }

export function decodeProviders(user: Partial<DatabaseUser>) {
  const providers = []

  if (user.google_oauth) providers.push(Provider.Google)
  if (user.naver_oauth) providers.push(Provider.Naver)
  if (user.kakao_oauth) providers.push(Provider.Kakao)
  if (providers.length === 0) providers.push(Provider.Sobok)

  return providers
}
