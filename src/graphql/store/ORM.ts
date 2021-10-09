import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'
import format from 'pg-format'

import { ApolloContext } from '../../apollo/server'
import { camelToSnake, removeQuotes, snakeToCamel, tableColumnRegEx } from '../../utils'
import {
  removeColumnWithAggregateFunction,
  selectColumnFromSubField,
  serializeParameters,
} from '../../utils/ORM'
import type { Store as GraphQLStore } from '../generated/graphql'
import { menuFieldColumnMapping } from '../menu/ORM'
import { newsFieldColumnMapping } from '../news/ORM'
import { userFieldColumnMapping } from '../user/ORM'
import joinHashtag from './sql/joinHashtag.sql'
import joinLikedStore from './sql/joinLikedStore.sql'
import joinMenu from './sql/joinMenu.sql'
import joinNews from './sql/joinNews.sql'
import joinStoreBucket from './sql/joinStoreBucket.sql'
import joinUser from './sql/joinUser.sql'
import stores from './sql/stores.sql'

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
  userId: ApolloContext['userId'],
  selectColumns = true
) {
  const storeFields = graphqlFields(info) as Record<string, any>
  const firstMenuFields = new Set(Object.keys(storeFields))

  let sql = stores
  let columns = selectColumns ? selectColumnFromSubField(storeFields, storeFieldColumnMapping) : []
  const values: unknown[] = []
  let groupBy = false

  if (firstMenuFields.has('isInBucket')) {
    if (userId) {
      sql = `${sql} ${joinStoreBucket}`
      columns.push('bucket.id')
      values.push(userId)
    }
  }

  if (firstMenuFields.has('isLiked')) {
    if (userId) {
      sql = `${sql} ${joinLikedStore}`
      columns.push('user_x_liked_store.user_id')
      values.push(userId)
    }
  }

  if (firstMenuFields.has('menus')) {
    const menuColumns = selectColumnFromSubField(storeFields.menus, menuFieldColumnMapping).map(
      (column) => `array_agg(${column})`
    )

    sql = `${sql} ${joinMenu}`
    columns = [...columns, ...menuColumns]
    groupBy = true
  }

  if (firstMenuFields.has('hashtags')) {
    sql = `${sql} ${joinHashtag}`
    columns.push('array_agg(hashtag.name)')
    groupBy = true
  }

  if (firstMenuFields.has('news')) {
    const newsColumns = selectColumnFromSubField(storeFields.news, newsFieldColumnMapping).map(
      (column) => `array_agg(${column})`
    )

    sql = `${sql} ${joinNews}`
    columns = [...columns, ...newsColumns]
    groupBy = true
  }

  if (firstMenuFields.has('user')) {
    const userColumns = selectColumnFromSubField(storeFields.user, userFieldColumnMapping)

    sql = `${sql} ${joinUser}`
    columns = [...columns, ...userColumns]
  }

  const filteredColumns = columns
    .filter(removeColumnWithAggregateFunction)
    .filter((column) => column !== 'store.point')

  if (groupBy && filteredColumns.length > 0) {
    sql = `${sql} GROUP BY ${filteredColumns}`
  }

  return [format(serializeParameters(sql), columns), columns, values] as const
}

// Database records -> GraphQL fields
export function storeORM(rows: any[][], selectedColumns: string[]): GraphQLStore[] {
  return rows.map((row) => {
    const graphQLStore: any = {}

    selectedColumns.forEach((selectedColumn, i) => {
      const [_, __] = (selectedColumn.match(tableColumnRegEx) ?? [''])[0].split('.')
      const tableName = removeQuotes(_)
      const columnName = removeQuotes(__)
      const camelTableName = snakeToCamel(tableName)
      const camelColumnName = snakeToCamel(columnName)
      const cell = row[i]

      if (tableName === 'store') {
        if (columnName === 'point') {
          graphQLStore.latitude = cell.x
          graphQLStore.longitude = cell.y
        }

        graphQLStore[camelColumnName] = cell
      }
      //
      else if (tableName === 'user_x_liked_store') {
        if (cell) {
          graphQLStore.isLiked = true
        }
      }
      //
      else if (tableName === 'isInBuckeet') {
        if (cell) {
          graphQLStore.isLiked = true
        }
      }
      //
      else if (tableName === 'hashtag') {
        graphQLStore.hashtags = cell
      }
      //
      else if (tableName === 'menu') {
        if (!graphQLStore.menus) {
          graphQLStore.menus = []
        }

        const menus = cell as unknown[]

        menus.forEach((menu, j) => {
          if (!graphQLStore.menus[j]) {
            graphQLStore.menus[j] = {}
          }

          graphQLStore.menus[j][camelColumnName] = menu
        })
      }
      //
      else {
        if (!graphQLStore[camelTableName]) {
          graphQLStore[camelTableName] = {}
        }

        graphQLStore[camelTableName][camelColumnName] = cell
      }
    })

    return graphQLStore
  })
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
