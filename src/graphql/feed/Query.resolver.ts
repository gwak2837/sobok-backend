import type { ApolloContext } from 'src/apollo/server'
import { FeedOptions, QueryResolvers } from '../../graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { buildBasicFeedQuery, feedORM } from './ORM'
import { spliceSQL } from '../../utils/ORM'
import { AuthenticationError } from 'apollo-server-express'

const byId = importSQL(__dirname, 'sql/byId.sql')
const byStarUser = importSQL(__dirname, 'sql/byStarUser.sql')
const byStoreId = importSQL(__dirname, 'sql/byStoreId.sql')
const joinFollowingUser = importSQL(__dirname, 'sql/joinFollowingUser.sql')
const joinStoreOnTown = importSQL(__dirname, 'sql/joinStoreOnTown.sql')
const joinStarUser = importSQL(__dirname, 'sql/joinStarUser.sql')
const onTown = importSQL(__dirname, 'sql/onTown.sql')

export const Query: QueryResolvers<ApolloContext> = {
  feed: async (_, { id }, { user }, info) => {
    let [sql, columns, values] = await buildBasicFeedQuery(info, user)

    sql = spliceSQL(sql, await byId, 'GROUP BY')
    values.push(id)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return feedORM(rows, columns)[0]
  },

  feedListByStore: async (_, { storeId }, { user }, info) => {
    let [sql, columns, values] = await buildBasicFeedQuery(info, user)

    sql = spliceSQL(sql, await byStoreId, 'GROUP BY')
    values.push(storeId)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return feedORM(rows, columns)
  },

  feedListByTown: async (_, { town, option }, { user }, info) => {
    let [sql, columns, values] = await buildBasicFeedQuery(info, user)

    if (town) {
      if (sql.includes('JOIN store')) {
        sql = spliceSQL(sql, await onTown, 'JOIN store ON store.id = feed.store_id', true)
      } else {
        sql = spliceSQL(sql, await joinStoreOnTown, 'JOIN')
      }

      values.push(town)
    }

    if (option === FeedOptions.FollowingUser) {
      if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

      sql = spliceSQL(sql, await joinFollowingUser, 'WHERE')
      values.push(user.id)
    }
    //
    else if (option === FeedOptions.StarUser) {
      if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

      if (sql.includes('JOIN "user"')) {
        sql = spliceSQL(sql, await byStarUser, 'GROUP BY')
      } else {
        sql = spliceSQL(sql, await joinStarUser, 'WHERE')
      }

      values.push(user.id)
    }

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return feedORM(rows, columns)
  },
}
