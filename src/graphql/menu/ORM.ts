import { UserInputError } from 'apollo-server-errors'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

import type { ApolloContext } from '../../apollo/server'
import { menu } from '../../database/sobok'
import { camelToSnake, removeQuotes, snakeToCamel, tableColumnRegEx } from '../../utils'
import { selectColumnFromField, serializeParameters } from '../../utils/ORM'
import type { Menu as GraphQLMenu } from '../generated/graphql'
import joinHashtag from './sql/joinHashtag.sql'
import joinLikedMenu from './sql/joinLikedMenu.sql'
import joinMenuBucket from './sql/joinMenuBucket.sql'
import joinStore from './sql/joinStore.sql'

const menuFieldsFromOtherTable = new Set(['isInBucket', 'isLiked', 'store', 'hashtags'])

// GraphQL fields -> Database columns
export function menuFieldColumnMapping(menuField: keyof GraphQLMenu) {
  if (menuFieldsFromOtherTable.has(menuField)) {
    return 'menu.id'
  }

  return `menu.${camelToSnake(menuField)}`
}

// GraphQL fields -> SQL
export async function buildBasicMenuQuery(
  info: GraphQLResolveInfo,
  userId: ApolloContext['userId'],
  selectColumns = true
) {
  const menuFields = graphqlFields(info) as Record<string, any>
  const firstMenuFields = new Set(Object.keys(menuFields))

  let sql = ''
  let columns = selectColumns ? selectColumnFromField(menuFields, menuFieldColumnMapping) : []
  const values: unknown[] = []
  let groupBy = false

  if (firstMenuFields.has('isInBucket')) {
    if (userId) {
      sql = `${sql} ${joinMenuBucket}`
      columns.push('bucket.id')
      values.push(userId)
    }
  }

  if (firstMenuFields.has('isLiked')) {
    if (userId) {
      sql = `${sql} ${joinLikedMenu}`
      columns.push('user_x_liked_menu.user_id')
      values.push(userId)
    }
  }

  // if (firstMenuFields.has('store')) {
  //   const storeColumns = selectColumnFromField(menuFields.store, storeFieldColumnMapping)
  //   sql = `${sql} ${joinStore}`
  //   columns = [...columns, ...storeColumns]
  // }

  if (firstMenuFields.has('hashtags')) {
    sql = `${sql} ${joinHashtag}`
    columns.push('array_agg(DISTINCT hashtag.name)')
    groupBy = true
  }

  // const filteredColumns = columns.filter(removeColumnWithAggregateFunction)

  // if (groupBy && filteredColumns.length > 0) {
  //   sql = `${sql} GROUP BY ${filteredColumns}`
  // }

  return [
    `SELECT ${columns} FROM menu ${serializeParameters(sql)}` as string,
    columns,
    values,
  ] as const
}

// Database columns -> GraphQL fields
export function menuORM(databaseMenu: menu) {
  const graphQLMenu: any = {}

  return graphQLMenu
}

export function validateMenuCategory(category: any) {
  if (category) {
    const encodedCategory = encodeCategory(category)
    if (encodedCategory === null) throw new UserInputError('카테고리 값을 잘못 입력했습니다.')
    return encodedCategory
  }
}

export function encodeCategory(id: string) {
  switch (id) {
    case '음료':
      return 0
    case '케이크':
      return 1
    case '구움과자':
      return 2
    case '커피':
      return 3
    case '베이커리':
      return 4
    case '마카롱':
      return 5
    case '브런치':
      return 6
    default:
      return null
  }
}

export function decodeCategory(id?: number) {
  switch (id) {
    case 0:
      return '음료'
    case 1:
      return '케이크'
    case 2:
      return '구움과자'
    case 3:
      return '커피'
    case 4:
      return '베이커리'
    case 5:
      return '마카롱'
    case 6:
      return '브런치'
    default:
      return ''
  }
}
