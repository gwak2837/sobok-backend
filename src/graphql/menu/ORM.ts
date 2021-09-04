import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'
import format from 'pg-format'
import type { ApolloContext } from 'src/apollo/server'
import type { Menu as GraphQLMenu } from 'src/graphql/generated/graphql'
import {
  selectColumnFromSubField,
  removeColumnWithAggregateFunction,
  serializeSQLParameters,
} from '../../utils/ORM'
import {
  camelToSnake,
  importSQL,
  removeQuotes,
  snakeToCamel,
  tableColumnRegEx,
} from '../../utils/commons'
import { storeFieldColumnMapping } from '../store/ORM'

const joinHashtag = importSQL(__dirname, 'sql/joinHashtag.sql')
const joinLikedMenu = importSQL(__dirname, 'sql/joinLikedMenu.sql')
const joinMenuBucket = importSQL(__dirname, 'sql/joinMenuBucket.sql')
const joinStore = importSQL(__dirname, 'sql/joinStore.sql')
const menus = importSQL(__dirname, 'sql/menus.sql')

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
  user: ApolloContext['user'],
  selectColumns = true
) {
  const menuFields = graphqlFields(info) as Record<string, any>
  const firstMenuFields = new Set(Object.keys(menuFields))

  let sql = await menus
  let columns = selectColumns ? selectColumnFromSubField(menuFields, menuFieldColumnMapping) : []
  const values: unknown[] = []
  let groupBy = false

  if (firstMenuFields.has('isInBucket')) {
    if (user) {
      sql = `${sql} ${await joinMenuBucket}`
      columns.push('bucket.id')
      values.push(user.id)
    }
  }

  if (firstMenuFields.has('isLiked')) {
    if (user) {
      sql = `${sql} ${await joinLikedMenu}`
      columns.push('user_x_liked_menu.user_id')
      values.push(user.id)
    }
  }

  if (firstMenuFields.has('store')) {
    const storeColumns = selectColumnFromSubField(menuFields.store, storeFieldColumnMapping)

    sql = `${sql} ${await joinStore}`
    columns = [...columns, ...storeColumns]
  }

  if (firstMenuFields.has('hashtags')) {
    sql = `${sql} ${await joinHashtag}`
    columns.push('array_agg(hashtag.name)')
    groupBy = true
  }

  const filteredColumns = columns.filter(removeColumnWithAggregateFunction)

  if (groupBy && filteredColumns.length > 0) {
    sql = `${sql} GROUP BY ${filteredColumns}`
  }

  return [format(serializeSQLParameters(sql), columns), columns, values] as const
}

// Database records -> GraphQL fields
export function menuORM(rows: unknown[][], selectedColumns: string[]): GraphQLMenu[] {
  return rows.map((row) => {
    const graphQLMenu: any = {}

    selectedColumns.forEach((selectedColumn, i) => {
      const [_, __] = (selectedColumn.match(tableColumnRegEx) ?? [''])[0].split('.')
      const tableName = removeQuotes(_)
      const columnName = removeQuotes(__)
      const camelTableName = snakeToCamel(tableName)
      const camelColumnName = snakeToCamel(columnName)
      const cell = row[i]

      if (tableName === 'menu') {
        graphQLMenu[camelColumnName] = cell
      }
      //
      else if (tableName === 'isInBuckeet') {
        if (cell) {
          graphQLMenu.isInBucket = true
        }
      }
      //
      else if (tableName === 'user_x_liked_menu') {
        if (cell) {
          graphQLMenu.isLiked = true
        }
      }
      //
      else if (tableName === 'hashtag') {
        graphQLMenu.hashtags = cell
      }
      //
      else {
        if (!graphQLMenu[camelTableName]) {
          graphQLMenu[camelTableName] = {}
        }

        graphQLMenu[camelTableName][camelColumnName] = cell
      }
    })

    return graphQLMenu
  })
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
