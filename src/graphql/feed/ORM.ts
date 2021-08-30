import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'
import type { feed } from 'src/database/sobok'
import type { Feed as GraphQLFeed } from 'src/graphql/generated/graphql'
import { commentFieldColumnMapping } from '../comment/ORM'
import { storeFieldColumnMapping } from '../store/ORM'
import { userFieldColumnMapping } from '../user/ORM'
import {
  camelToSnake,
  importSQL,
  removeDoubleQuotes,
  snakeKeyToCamelKey,
  snakeToCamel,
} from '../../utils/commons'
import { selectColumnFromSubField } from '../../utils/ORM'

const feedList = importSQL(__dirname, 'sql/feedList.sql')
const joinComment = importSQL(__dirname, 'sql/joinComment.sql')
const joinHashtag = importSQL(__dirname, 'sql/joinHashtag.sql')
const joinLikedFeed = importSQL(__dirname, 'sql/joinLikedFeed.sql')
const joinStore = importSQL(__dirname, 'sql/joinStore.sql')
const joinUser = importSQL(__dirname, 'sql/joinUser.sql')

const feedFieldsThatNeedGroupBy = new Set(['comments', 'hashtags'])

// GraphQL fields -> Database columns
export function feedFieldColumnMapping(feedField: keyof GraphQLFeed) {
  switch (feedField) {
    case 'isLiked':
      return ''
    case 'store':
      return ''
    case 'user':
      return ''
    case 'comments':
      return ''
    case 'hashtags':
      return ''
    case 'menus':
      return ''
    default:
      return camelToSnake(feedField)
  }
}

export async function buildBasicFeedQuery(
  info: GraphQLResolveInfo,
  user: any,
  selectColumns = true
) {
  const feedFields = graphqlFields(info) as Record<string, any>
  const firstFeedFields = Object.keys(feedFields)

  let sql = await feedList
  let columns = selectColumns
    ? selectColumnFromSubField(feedFields, feedFieldColumnMapping).map((column) => `feed.${column}`)
    : []
  const values = []
  let groupBy = false

  if (firstFeedFields.includes('store')) {
    const storeColumns = selectColumnFromSubField(feedFields.store, storeFieldColumnMapping).map(
      (column) => `store.${column}`
    )

    sql = `${sql} ${await joinStore}`
    columns = [...columns, ...storeColumns]
  }

  if (firstFeedFields.includes('isLiked')) {
    if (user) {
      sql = `${sql} ${await joinLikedFeed}`
      columns.push('user_x_liked_feed.user_id')
      values.push(user.id)
    }
  }

  if (firstFeedFields.includes('user')) {
    const userColumns = selectColumnFromSubField(feedFields.user, userFieldColumnMapping).map(
      (column) => `"user".${column}`
    )

    sql = `${sql} ${await joinUser}`
    columns = [...columns, ...userColumns]
  }

  if (firstFeedFields.includes('comments')) {
    const commentColumns = selectColumnFromSubField(
      feedFields.comments,
      commentFieldColumnMapping
    ).map((column) => `comment.${column}`)

    sql = `${sql} ${await joinComment}`
    columns = [...columns, ...commentColumns]
    groupBy = true
  }

  if (firstFeedFields.includes('hashtags')) {
    sql = `${sql} ${await joinHashtag}`
    columns.push('hashtag.name')
    groupBy = true
  }

  if (groupBy) {
    sql = `${sql} GROUP BY ${columns.filter((column) => !feedFieldsThatNeedGroupBy.has(column))}`
  }

  return [sql, columns, values] as const
}

// Database record -> GraphQL fields
export function feedORM(feed: Partial<feed>): any {
  return {
    ...snakeKeyToCamelKey(feed),
  }
}

// Database record -> GraphQL fields
export function feedORMv2(rows: unknown[][], tableColumns: string[]): GraphQLFeed[] {
  return rows.map((row) => {
    const graphQLNews: any = {}

    tableColumns.forEach((tableColumn, i) => {
      if (tableColumn.startsWith('feed')) {
        const [, column] = tableColumn.split('.')
        const camelColumn = snakeToCamel(column)

        graphQLNews[camelColumn] = row[i]
      } else if (tableColumn.startsWith('user_x_liked_feed')) {
        if (row[i]) {
          graphQLNews.isLiked = true
        }
      } else {
        const [table, column] = tableColumn.split('.')
        const camelTable = removeDoubleQuotes(snakeToCamel(table))
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
