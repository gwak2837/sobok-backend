import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'
import format from 'pg-format'
import type { Feed as GraphQLFeed } from 'src/graphql/generated/graphql'
import { commentFieldColumnMapping } from '../comment/ORM'
import { storeFieldColumnMapping } from '../store/ORM'
import { userFieldColumnMapping } from '../user/ORM'
import {
  camelToSnake,
  importSQL,
  removeQuotes,
  snakeToCamel,
  tableColumnRegEx,
} from '../../utils/commons'
import {
  removeColumnWithAggregateFunction,
  selectColumnFromSubField,
  serializeSQLParameters,
} from '../../utils/ORM'
import { menuFieldColumnMapping } from '../menu/ORM'
import type { ApolloContext } from 'src/apollo/server'

const feedList = importSQL(__dirname, 'sql/feedList.sql')
const joinComment = importSQL(__dirname, 'sql/joinComment.sql')
const joinHashtag = importSQL(__dirname, 'sql/joinHashtag.sql')
const joinLikedFeed = importSQL(__dirname, 'sql/joinLikedFeed.sql')
const joinMenu = importSQL(__dirname, 'sql/joinMenu.sql')
const joinStore = importSQL(__dirname, 'sql/joinStore.sql')
const joinUser = importSQL(__dirname, 'sql/joinUser.sql')

const newsFieldsFromOtherTable = new Set([
  'isLiked',
  'store',
  'user',
  'comments',
  'hashtags',
  'menus',
])

// GraphQL fields -> Database columns
export function feedFieldColumnMapping(feedField: keyof GraphQLFeed) {
  if (newsFieldsFromOtherTable.has(feedField)) {
    return ''
  }

  return `feed.${camelToSnake(feedField)}`
}

// GraphQL fields -> SQL
export async function buildBasicFeedQuery(
  info: GraphQLResolveInfo,
  user: ApolloContext['user'],
  selectColumns = true
) {
  const feedFields = graphqlFields(info) as Record<string, any>
  const firstFeedFields = new Set(Object.keys(feedFields))

  let sql = await feedList
  let columns = selectColumns ? selectColumnFromSubField(feedFields, feedFieldColumnMapping) : []
  const values = []
  let groupBy = false

  if (firstFeedFields.has('isLiked')) {
    if (user) {
      sql = `${sql} ${await joinLikedFeed}`
      columns.push('user_x_liked_feed.user_id')
      values.push(user.id)
    }
  }

  if (firstFeedFields.has('store')) {
    const storeColumns = selectColumnFromSubField(feedFields.store, storeFieldColumnMapping)

    sql = `${sql} ${await joinStore}`
    columns = [...columns, ...storeColumns]
  }

  if (firstFeedFields.has('user')) {
    const userColumns = selectColumnFromSubField(feedFields.user, userFieldColumnMapping)

    sql = `${sql} ${await joinUser}`
    columns = [...columns, ...userColumns]
  }

  if (firstFeedFields.has('comments')) {
    const commentColumns = selectColumnFromSubField(
      feedFields.comments,
      commentFieldColumnMapping
    ).map((column) => `array_agg(DISTINCT ${column})`)

    sql = `${sql} ${await joinComment}`
    columns = [...columns, ...commentColumns]
    groupBy = true
  }

  if (firstFeedFields.has('hashtags')) {
    sql = `${sql} ${await joinHashtag}`
    columns.push('array_agg(hashtag.name)')
    groupBy = true
  }

  if (firstFeedFields.has('menus')) {
    const menuColumns = selectColumnFromSubField(feedFields.menus, menuFieldColumnMapping).map(
      (column) => `array_agg(DISTINCT ${column})`
    )

    sql = `${sql} ${await joinMenu}`
    columns = [...columns, ...menuColumns]
    groupBy = true
  }

  if (groupBy) {
    sql = `${sql} GROUP BY ${columns.filter(removeColumnWithAggregateFunction)}`
  }

  return [format(serializeSQLParameters(sql), columns), columns, values] as const
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
