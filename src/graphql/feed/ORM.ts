import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'
import format from 'pg-format'

import type { ApolloContext } from '../../apollo/server'
import { camelToSnake, removeQuotes, snakeToCamel, tableColumnRegEx } from '../../utils'
import { commentFieldColumnMapping } from '../comment/ORM'
import { selectColumnFromField, serializeParameters } from '../common/ORM'
import type { Feed as GraphQLFeed } from '../generated/graphql'
import { menuFieldColumnMapping } from '../menu/ORM'
import { userFieldColumnMapping } from '../user/ORM'
import feedList from './sql/feedList.sql'
import joinComment from './sql/joinComment.sql'
import joinHashtag from './sql/joinHashtag.sql'
import joinLikedFeed from './sql/joinLikedFeed.sql'
import joinMenu from './sql/joinMenu.sql'
import joinStore from './sql/joinStore.sql'
import joinUser from './sql/joinUser.sql'

const feedFieldsFromOtherTable = new Set([
  'isLiked',
  'store',
  'user',
  'comments',
  'hashtags',
  'menus',
])

// GraphQL fields -> Database columns
export function feedFieldColumnMapping(feedField: keyof GraphQLFeed) {
  if (feedFieldsFromOtherTable.has(feedField)) {
    return 'feed.id'
  }

  return `feed.${camelToSnake(feedField)}`
}

// GraphQL fields -> SQL
export async function buildBasicFeedQuery(
  info: GraphQLResolveInfo,
  userId: ApolloContext['userId'],
  selectColumns = true
) {
  const feedFields = graphqlFields(info) as Record<string, any>
  const firstFeedFields = new Set(Object.keys(feedFields))

  let sql = feedList
  let columns = selectColumns ? selectColumnFromField(feedFields, feedFieldColumnMapping) : []
  const values: unknown[] = []
  let groupBy = false

  if (firstFeedFields.has('isLiked')) {
    if (userId) {
      sql = `${sql} ${joinLikedFeed}`
      columns.push('user_x_liked_feed.user_id')
      values.push(userId)
    }
  }

  // if (firstFeedFields.has('store')) {
  //   const storeColumns = selectColumnFromField(feedFields.store, storeFieldColumnMapping)

  //   sql = `${sql} ${joinStore}`
  //   columns = [...columns, ...storeColumns]
  // }

  if (firstFeedFields.has('user')) {
    const userColumns = selectColumnFromField(feedFields.user, userFieldColumnMapping)

    sql = `${sql} ${joinUser}`
    columns = [...columns, ...userColumns]
  }

  if (firstFeedFields.has('comments')) {
    const commentColumns = selectColumnFromField(
      feedFields.comments,
      commentFieldColumnMapping
    ).map((column) =>
      column === 'comment.id' ? `array_agg(DISTINCT ${column})` : `array_agg(${column})`
    )

    sql = `${sql} ${joinComment}`
    columns = [...columns, ...commentColumns]
    groupBy = true
  }

  if (firstFeedFields.has('hashtags')) {
    sql = `${sql} ${joinHashtag}`
    columns.push('array_agg(DISTINCT hashtag.name)')
    groupBy = true
  }

  if (firstFeedFields.has('menus')) {
    const menuColumns = selectColumnFromField(feedFields.menus, menuFieldColumnMapping).map(
      (column) => `array_agg(${column})`
    )

    sql = `${sql} ${joinMenu}`
    columns = [...columns, ...menuColumns]
    groupBy = true
  }

  // const filteredColumns = columns.filter(removeColumnWithAggregateFunction)

  // if (groupBy && filteredColumns.length > 0) {
  //   sql = `${sql} GROUP BY ${filteredColumns}`
  // }

  return [format(serializeParameters(sql), columns), columns, values] as const
}

// Database records -> GraphQL fields
export function feedORM(rows: unknown[][], selectedColumns: string[]): GraphQLFeed[] {
  return rows.map((row) => {
    const graphQLNews: any = {}

    selectedColumns.forEach((selectedColumn, i) => {
      const [_, __] = (selectedColumn.match(tableColumnRegEx) ?? [''])[0].split('.')
      const tableName = removeQuotes(_)
      const columnName = removeQuotes(__)
      const camelTableName = snakeToCamel(tableName)
      const camelColumnName = snakeToCamel(columnName)
      const cell = row[i]

      if (tableName === 'feed') {
        graphQLNews[camelColumnName] = cell
      }
      //
      else if (tableName === 'user_x_liked_feed') {
        if (cell) {
          graphQLNews.isLiked = true
        }
      }
      //
      else if (tableName === 'comment') {
        if (!graphQLNews.comments) {
          graphQLNews.comments = []
        }

        const comments = cell as unknown[]

        comments.forEach((comment, j) => {
          if (!graphQLNews.comments[j]) {
            graphQLNews.comments[j] = {}
          }

          graphQLNews.comments[j][camelColumnName] = comment
        })
      }
      //
      else if (tableName === 'hashtag') {
        graphQLNews.hashtags = cell
      }
      //
      else if (tableName === 'menu') {
        if (!graphQLNews.menus) {
          graphQLNews.menus = []
        }

        const menus = cell as unknown[]

        menus.forEach((menu, j) => {
          if (!graphQLNews.menus[j]) {
            graphQLNews.menus[j] = {}
          }

          graphQLNews.menus[j][camelColumnName] = menu
        })
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

export function encodeRating(ratings: string) {
  switch (ratings) {
    case '맛있어요':
      return 3
    case '괜찮아요':
      return 2
    case '별로에요':
      return 1
    default:
      return null
  }
}

export function decodeRating(code: number) {
  switch (code) {
    case 3:
      return '맛있어요'
    case 2:
      return '괜찮아요'
    case 1:
      return '별로에요'
    default:
      return null
  }
}
