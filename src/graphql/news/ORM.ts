import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'
import format from 'pg-format'

import type { ApolloContext } from '../../apollo/server'
import { camelToSnake, removeQuotes, snakeToCamel, tableColumnRegEx } from '../../utils'
import { selectColumnFromSubField, serializeParameters } from '../../utils/ORM'
import type { News as GraphQLNews } from '../generated/graphql'
import { storeFieldColumnMapping } from '../store/ORM'
import joinLikedNews from './sql/joinLikedNews.sql'
import joinStore from './sql/joinStore.sql'
import newsList from './sql/newsList.sql'

const newsFieldsFromOtherTable = new Set(['isLiked', 'store'])

// GraphQL fields -> Database columns
export function newsFieldColumnMapping(newsField: keyof GraphQLNews) {
  if (newsFieldsFromOtherTable.has(newsField)) {
    return 'news.id'
  }

  return `news.${camelToSnake(newsField)}`
}

// GraphQL fields -> SQL
export async function buildBasicNewsQuery(
  info: GraphQLResolveInfo,
  userId: ApolloContext['userId'],
  selectColumns = true
) {
  const newsFields = graphqlFields(info) as Record<string, any>
  const firstNewsFields = Object.keys(newsFields)

  let sql = newsList
  let columns = selectColumns ? selectColumnFromSubField(newsFields, newsFieldColumnMapping) : []
  const values: unknown[] = []

  if (firstNewsFields.includes('isLiked')) {
    if (userId) {
      sql = `${sql} ${joinLikedNews}`
      columns.push('user_x_liked_news.user_id')
      values.push(userId)
    }
  }

  if (firstNewsFields.includes('store')) {
    const storeColumns = selectColumnFromSubField(newsFields.store, storeFieldColumnMapping)

    sql = `${sql} ${joinStore}`
    columns = [...columns, ...storeColumns]
  }

  return [format(serializeParameters(sql), columns), columns, values] as const
}

// Database record -> GraphQL fields
export function newsORM(rows: unknown[][], selectedColumns: string[]): GraphQLNews[] {
  return rows.map((row) => {
    const graphQLNews: any = {}

    selectedColumns.forEach((selectedColumn, i) => {
      const [_, __] = (selectedColumn.match(tableColumnRegEx) ?? [''])[0].split('.')
      const tableName = removeQuotes(_)
      const camelTableName = snakeToCamel(tableName)
      const camelColumnName = snakeToCamel(removeQuotes(__))
      const cell = row[i]

      if (tableName === 'news') {
        graphQLNews[camelColumnName] = cell
      }
      //
      else if (tableName === 'user_x_liked_feed') {
        if (cell) {
          graphQLNews.isLiked = true
        }
      }
      //
      else {
        if (!graphQLNews[camelTableName]) {
          graphQLNews[camelTableName] = {}
        }

        graphQLNews[camelTableName][camelColumnName] = cell
      }
    })

    return graphQLNews
  })
}

export function encodeCategory(category: string) {
  switch (category) {
    case '오늘의라인업':
      return 0
    case '신메뉴소식':
      return 1
    case '할인/이벤트':
      return 2
    case '공지사항':
      return 3
    case '품절':
      return 4
    default:
      return null
  }
}

export function decodeCategory(id?: number) {
  switch (id) {
    case 0:
      return '오늘의라인업'
    case 1:
      return '신메뉴소식'
    case 2:
      return '할인/이벤트'
    case 3:
      return '공지사항'
    case 4:
      return '품절'
    default:
      return null
  }
}
