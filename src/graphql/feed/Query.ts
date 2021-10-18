import { AuthenticationError, UserInputError } from 'apollo-server-express'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { applyPaginationAndSorting, spliceSQL } from '../common/ORM'
import { FeedOptions, QueryResolvers } from '../generated/graphql'
import { buildBasicFeedQuery, feedORM } from './ORM'
import byId from './sql/byId.sql'
import byStarUser from './sql/byStarUser.sql'
import byStoreId from './sql/byStoreId.sql'
import joinFollowingUser from './sql/joinFollowingUser.sql'
import joinHashtag from './sql/joinHashtag.sql'
import joinStarUser from './sql/joinStarUser.sql'
import joinStoreOnTown from './sql/joinStoreOnTown.sql'
import onHashtagName from './sql/onHashtagName.sql'
import onTown from './sql/onTown.sql'

const joinHashtagShort = 'JOIN hashtag ON hashtag.id = feed_x_hashtag.hashtag_id'

export const FeedOrderBy = {
  CREATION_TIME: 'creation_time',
}

export const Query: QueryResolvers<ApolloContext> = {
  feed: async (_, { id }, { userId }, info) => {
    let [sql, columns, values] = await buildBasicFeedQuery(info, userId)

    sql = spliceSQL(sql, byId, 'GROUP BY')
    values.push(id)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return feedORM(rows, columns)[0]
  },

  feedListByStore: async (_, { storeId }, { userId }, info) => {
    let [sql, columns, values] = await buildBasicFeedQuery(info, userId)

    sql = spliceSQL(sql, byStoreId, 'GROUP BY')
    values.push(storeId)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return feedORM(rows, columns)
  },

  feedListByTown: async (_, { town, option }, { userId }, info) => {
    if (option === FeedOptions.FollowingUser || option === FeedOptions.StarUser) {
      if (!userId)
        throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')
    }

    let [sql, columns, values] = await buildBasicFeedQuery(info, userId)

    if (town) {
      if (sql.includes('JOIN store')) {
        sql = spliceSQL(sql, onTown, 'JOIN store ON store.id = feed.store_id', true)
      } else {
        sql = spliceSQL(sql, joinStoreOnTown, 'JOIN')
      }
      values.push(town)
    }

    if (option === FeedOptions.FollowingUser) {
      sql = spliceSQL(sql, joinFollowingUser, 'WHERE')
      values.push(userId)
    } else if (option === FeedOptions.StarUser) {
      if (sql.includes('JOIN "user"')) {
        sql = spliceSQL(sql, byStarUser, 'GROUP BY')
      } else {
        sql = spliceSQL(sql, joinStarUser, 'WHERE')
      }
      values.push(userId)
    }

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })
    if (rowCount === 0) return null

    return feedORM(rows, columns)
  },

  searchFeedList: async (_, { hashtags, order, pagination }, { userId }, info) => {
    if (hashtags.length === 0) throw new UserInputError('해시태그 배열은 비어있을 수 없습니다.')

    let [sql, columns, values] = await buildBasicFeedQuery(info, userId)

    if (sql.includes(joinHashtagShort)) {
      sql = spliceSQL(sql, onHashtagName, joinHashtagShort, true)
    } else {
      sql = spliceSQL(sql, `${joinHashtag} ${onHashtagName}`, 'GROUP BY')
    }
    values.push(hashtags)

    sql = applyPaginationAndSorting(sql, values, 'feed', order, pagination)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })
    if (rowCount === 0) return null

    return feedORM(rows, columns)
  },
}
