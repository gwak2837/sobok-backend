import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'
import format from 'pg-format'

import { NotImplementedError } from '../../apollo/errors'
import type { ApolloContext } from '../../apollo/server'
import type { user as DatabaseUser } from '../../database/sobok'
import { camelToSnake, removeQuotes, snakeToCamel, tableColumnRegEx } from '../../utils'
import { selectColumnFromField, serializeParameters } from '../../utils/ORM'
import { commentFieldColumnMapping } from '../comment/ORM'
import { feedFieldColumnMapping } from '../feed/ORM'
import type { User as GraphQLUser } from '../generated/graphql'
import { Provider } from '../generated/graphql'
import joinComment from './sql/joinComment.sql'
import joinFeed from './sql/joinFeed.sql'
import joinFollower from './sql/joinFollower.sql'
import joinFollowing from './sql/joinFollowing.sql'

const privateUserField = new Set([
  'creationTime',
  'modificationTime',
  'email',
  'name',
  'phone',
  'isEmailVerified',
  'providers',
])

const fromOtherTable = new Set(['followerCount', 'followingCount'])

// GraphQL fields -> Database columns
export function userFieldColumnMapping(userField: keyof GraphQLUser) {
  if (privateUserField.has(userField)) {
    return ['"user".id', `"user".${camelToSnake(userField)}`]
  } else if (fromOtherTable.has(userField)) {
    return '"user".id'
  }

  switch (userField) {
    case 'providers':
      return ['"user".id', '"user".google_oauth', '"user".naver_oauth', '"user".kakao_oauth']
    default:
      return `"user".${camelToSnake(userField)}`
  }
}

// GraphQL request -> SQL request
export function buildBasicUserQuery(info: GraphQLResolveInfo) {
  let columns = selectColumnFromField(graphqlFields(info), userFieldColumnMapping)

  return `SELECT ${columns} FROM "user"`

  // const firstUserFields = new Set(Object.keys(userFields))
  // let sql = ''
  // const values: unknown[] = []

  // return [`SELECT ${columns} FROM "user" ${serializeParameters(sql)}` as string, values] as const

  // let groupBy = false

  // if (firstUserFields.has('comments')) {
  //   const commentColumns = selectColumnFromField(
  //     userFields.comments,
  //     commentFieldColumnMapping
  //   ).map((column) => `array_agg(${column})`)

  //   sql = `${sql} ${joinComment}`
  //   columns = [...columns, ...commentColumns]
  //   groupBy = true
  // }

  // if (firstUserFields.has('feed')) {
  //   const feedColumns = selectColumnFromField(userFields.feed, feedFieldColumnMapping).map(
  //     (tableColumn) => `array_agg(${tableColumn}) AS ${tableColumn}`
  //   )

  //   sql = `${sql} ${joinFeed}`
  //   columns = [...columns, ...feedColumns]
  //   groupBy = true
  // }

  // if (firstUserFields.has('followings')) {
  //   const userColumns = selectColumnFromField(userFields.followings, userFieldColumnMapping).map(
  //     (tableColumn) => {
  //       const column = tableColumn.split('.')[1]
  //       return `array_agg(following.${column}) AS followings__${column}`
  //     }
  //   )

  //   sql = `${sql} ${joinFollowing}`
  //   columns = [...columns, ...userColumns]
  //   groupBy = true
  // }

  // if (firstUserFields.has('followers')) {
  //   const userColumns = selectColumnFromField(userFields.followers, userFieldColumnMapping).map(
  //     (tableColumn) => {
  //       const column = tableColumn.split('.')[1]
  //       return `array_agg(follower.${column}) AS followers__${column}`
  //     }
  //   )

  //   sql = `${sql} ${joinFollower}`
  //   columns = [...columns, ...userColumns]
  //   groupBy = true
  // }

  // if (firstUserFields.has('likedComments')) {
  //   const userColumns = selectColumnFromField(userFields.followers, userFieldColumnMapping).map(
  //     (column) => `array_agg(DISTINCT follower.${column})`
  //   )

  //   sql = `${sql} ${joinFollower}`
  //   columns = [...columns, ...userColumns]
  //   groupBy = true
  // }

  // if (firstUserFields.has('likedFeed')) {
  //   const userColumns = selectColumnFromField(userFields.followers, userFieldColumnMapping).map(
  //     (column) => `array_agg(DISTINCT follower.${column})`
  //   )

  //   sql = `${sql} ${joinFollower}`
  //   columns = [...columns, ...userColumns]
  //   groupBy = true
  // }

  // const filteredColumns = columns.filter(removeColumnWithAggregateFunction)

  // if (groupBy && filteredColumns.length > 0) {
  //   sql = `${sql} GROUP BY ${filteredColumns}`
  // }
}

// SQL response -> GraphQL response
export function userORM(rows: Record<string, unknown>[]): GraphQLUser[] {
  return rows.map((row) => {
    const graphqlObject: any = {}

    for (const column in row) {
      const value = row[column]

      if (column.includes('__')) {
        const [field, subField] = column.split('__')
        const camelField = snakeToCamel(field)

        if (Array.isArray(value))
          throw new NotImplementedError(`구현되지 않은 필드입니다. ${column} ${value}`)
        // if (!graphqlObject[camelField]) graphqlObject[camelField] = []
        // for (let i = 0; i < value.length; i++) {
        //   const arrayField = graphqlObject[camelField]
        //   if (!arrayField[i]) arrayField[i] = {}
        //   arrayField[i][subField] = value[i]
        // }

        if (!graphqlObject[camelField]) graphqlObject[camelField] = {}
        graphqlObject[camelField][subField] = value
      } else {
        graphqlObject[snakeToCamel(column)] = value
      }
    }

    return graphqlObject
  })
}

export function decodeProviders(user: Partial<DatabaseUser>) {
  const providers = []

  if (user.google_oauth) providers.push(Provider.Google)
  if (user.naver_oauth) providers.push(Provider.Naver)
  if (user.kakao_oauth) providers.push(Provider.Kakao)
  if (providers.length === 0) providers.push(Provider.Sobok)

  return providers
}
