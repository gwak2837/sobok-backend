import { GraphQLResolveInfo } from 'graphql'
import getGraphqlFields from 'graphql-fields'
import type { news as DatabaseNews } from 'src/database/sobok'
import type { News as GraphQLNews } from 'src/graphql/generated/graphql'
import { selectColumnFromField, selectColumnFromSubField } from '../../utils/ORM'
import { camelToSnake, importSQL, snakeKeyToCamelKey, snakeToCamel } from '../../utils/commons'
import { storeFieldColumnMapping } from '../store/ORM'

const joinLikedNews = importSQL(__dirname, 'sql/joinLikedNews.sql')
const joinStore = importSQL(__dirname, 'sql/joinStore.sql')
const newsList = importSQL(__dirname, 'sql/newsList.sql')

// GraphQL fields -> Database columns
export function newsFieldColumnMapping(newsField: keyof GraphQLNews) {
  switch (newsField) {
    case 'isLiked':
      return ''
    case 'store':
      return ''
    default:
      return camelToSnake(newsField)
  }
}

export async function buildBasicNewsQuery(user: any, info: GraphQLResolveInfo) {
  const graphqlFields = getGraphqlFields(info) as Record<string, any>

  let sql = await newsList
  let columns = selectColumnFromField(info, newsFieldColumnMapping).map(
    (column) => `news.${column}`
  )
  const values = []

  if (Object.keys(graphqlFields).includes('store')) {
    const storeColumns = selectColumnFromSubField(graphqlFields.store, storeFieldColumnMapping).map(
      (column) => `store.${column}`
    )

    sql = `${sql} ${await joinStore}`
    columns = [...columns, ...storeColumns]
  }

  if (Object.keys(graphqlFields).includes('isLiked')) {
    if (user) {
      sql = `${sql} ${await joinLikedNews}`
      columns.push('user_x_liked_news.user_id')
      values.push(user.id)
    }
  }

  return [sql, columns, values] as const
}

// Database record -> GraphQL fields
export function newsORM(news: Partial<DatabaseNews>): any {
  return {
    ...snakeKeyToCamelKey(news),
    category: decodeCategory(news.category),
  }
}

// Database record -> GraphQL fields
export function newsORMv2(rows: unknown[][], tableColumns: string[]): GraphQLNews[] {
  return rows.map((row) => {
    const graphQLNews: any = {}

    tableColumns.forEach((tableColumn, i) => {
      if (tableColumn.startsWith('news')) {
        const [, column] = tableColumn.split('.')
        const camelColumn = snakeToCamel(column)

        graphQLNews[camelColumn] = row[i]
      } else if (tableColumn.startsWith('user_x_liked_feed')) {
        if (row[i]) {
          graphQLNews.isLiked = true
        }
      } else {
        const [table, column] = tableColumn.split('.')
        const camelTable = snakeToCamel(table)
        const camelColumn = snakeToCamel(column)

        if (!graphQLNews[camelTable]) {
          graphQLNews[camelTable] = {}
        }

        graphQLNews[camelTable][camelColumn] = row[i]
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
