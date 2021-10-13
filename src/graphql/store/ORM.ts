import { UserInputError } from 'apollo-server-errors'
import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

import { ApolloContext } from '../../apollo/server'
import { camelToSnake, removeQuotes, snakeToCamel, tableColumnRegEx } from '../../utils'
import { selectColumnFromField, serializeParameters } from '../../utils/ORM'
import type { Store as GraphQLStore, QueryStoresByTownAndCategoryArgs } from '../generated/graphql'
import { menuFieldColumnMapping } from '../menu/ORM'
import { newsFieldColumnMapping } from '../news/ORM'
import { userFieldColumnMapping } from '../user/ORM'
import joinHashtag from './sql/joinHashtag.sql'
import joinLikedStore from './sql/joinLikedStore.sql'
import joinMenu from './sql/joinMenu.sql'
import joinNews from './sql/joinNews.sql'
import joinStoreBucket from './sql/joinStoreBucket.sql'
import joinUser from './sql/joinUser.sql'

const storeFieldsFromOtherTable = new Set([
  'isInBucket',
  'isLiked',
  'menus',
  'hashtags',
  'news',
  'user',
])

export function storeFieldColumnMapping(storeField: keyof GraphQLStore) {
  if (storeFieldsFromOtherTable.has(storeField)) {
    return 'store.id'
  }

  switch (storeField) {
    case 'latitude':
    case 'longitude':
      return 'store.point'
    default:
      return `store.${camelToSnake(storeField)}`
  }
}

// GraphQL fields -> SQL
export async function buildBasicStoreQuery(
  info: GraphQLResolveInfo,
  userId: ApolloContext['userId']
) {
  const storeFields = graphqlFields(info) as Record<string, any>
  const storeFieldsSet = new Set(Object.keys(storeFields))

  let sql = ''
  let columns = selectColumnFromField(storeFields, storeFieldColumnMapping)
  const values: unknown[] = []
  let groupBy = false

  if (storeFieldsSet.has('isInBucket')) {
    if (userId) {
      sql = `${sql} ${joinStoreBucket}`
      columns.push('bucket.id')
      values.push(userId)
    }
  }

  if (storeFieldsSet.has('isLiked')) {
    if (userId) {
      sql = `${sql} ${joinLikedStore}`
      columns.push('user_x_liked_store.user_id')
      values.push(userId)
    }
  }

  if (storeFieldsSet.has('menus')) {
    const menuColumns = selectColumnFromField(storeFields.menus, menuFieldColumnMapping).map(
      (column) => `array_agg(DISTINCT ${column})`
    )

    sql = `${sql} ${joinMenu}`
    columns = [...columns, ...menuColumns]
    groupBy = true
  }

  if (storeFieldsSet.has('hashtags')) {
    sql = `${sql} ${joinHashtag}`
    columns.push('array_agg(DISTINCT hashtag.name)')
    groupBy = true
  }

  if (storeFieldsSet.has('news')) {
    const newsColumns = selectColumnFromField(storeFields.news, newsFieldColumnMapping).map(
      (column) => `array_agg(DISTINCT ${column})`
    )

    sql = `${sql} ${joinNews}`
    columns = [...columns, ...newsColumns]
    groupBy = true
  }

  if (storeFieldsSet.has('user')) {
    const userColumns = selectColumnFromField(storeFields.user, userFieldColumnMapping)

    sql = `${sql} ${joinUser}`
    columns = [...columns, ...userColumns]
  }

  // const filteredColumns = columns
  //   .filter(removeColumnWithAggregateFunction)
  //   .filter((column) => column !== 'store.point')

  // if (groupBy && filteredColumns.length > 0) {
  //   sql = `${sql} GROUP BY ${filteredColumns}`
  // }

  return [
    `SELECT ${columns} FROM store ${serializeParameters(sql)}` as string,
    columns,
    values,
  ] as const
}

export function validateStoreCategories(
  categories: QueryStoresByTownAndCategoryArgs['categories']
) {
  if (categories) {
    if (categories.length === 0) throw new UserInputError('카테고리 배열은 비어있을 수 없습니다.')
    const encodedCategories = encodeCategories(categories)
    if (encodedCategories.some((encodeCategory) => encodeCategory === null))
      throw new UserInputError('카테고리 값은 null이 될 수 없습니다.')
    return encodedCategories
  }
}

export function encodeCategories(categories: string[]) {
  return categories.map((category) => {
    switch (category) {
      case '콘센트':
        return 0
      case '넓은테이블':
        return 1
      case '편한의자':
        return 2
      case '애견동반':
        return 3
      case '통유리':
        return 4
      case '흡연실':
        return 5
      case '노키즈존':
        return 6
      case '주차장':
        return 7
      case '루프탑':
        return 8
      case '야외석':
        return 9
      case '포장 전용':
        return 10
      default:
        return null
    }
  })
}

export function decodeCategories(ids: number[]) {
  return ids.map((id) => {
    switch (id) {
      case 0:
        return '콘센트'
      case 1:
        return '넓은테이블'
      case 2:
        return '편한의자'
      case 3:
        return '애견동반'
      case 4:
        return '통유리'
      case 5:
        return '흡연실'
      case 6:
        return '노키즈존'
      case 7:
        return '주차장'
      case 8:
        return '루프탑'
      case 9:
        return '야외석'
      case 10:
        return '포장 전용'
      default:
        return ''
    }
  })
}
