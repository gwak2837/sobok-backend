import { AuthenticationError, UserInputError } from 'apollo-server-express'

import { NotFoundError } from '../../apollo/errors'
import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { applyPaginationAndSorting, buildSQL, columnFieldMapping } from '../common/ORM'
import { FeedOptions, QueryResolvers } from '../generated/graphql'
import feed from './sql/feed.sql'
import feedListByStore from './sql/feedListByStore.sql'
import feedListByTown from './sql/feedListByTown.sql'
import joinFollowingUser from './sql/joinFollowingUser.sql'
import joinStarUser from './sql/joinStarUser.sql'
import joinStoreTown from './sql/joinStoreTown.sql'
import searchFeedList from './sql/searchFeedList.sql'

export const FeedOrderBy = {
  CREATION_TIME: 'creation_time',
}

export const Query: QueryResolvers<ApolloContext> = {
  feed: async (_, { id }, { userId }) => {
    let sql = feed
    const values = [userId, id]

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당 id의 피드를 찾을 수 없습니다.')

    return columnFieldMapping(rows[0])
  },

  feedListByStore: async (_, { storeId }, { userId }) => {
    let sql = feedListByStore
    const values = [userId, storeId]

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0)
      throw new NotFoundError(
        'storeId의 매장이 존재하지 않거나 해당 매장에 피드가 존재하지 않습니다.'
      )

    return rows.map((row) => columnFieldMapping(row))
  },

  feedListByTown: async (_, { town, option }, { userId }) => {
    if (option === FeedOptions.FollowingUser || option === FeedOptions.StarUser) {
      if (!userId)
        throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')
    }

    let sql = feedListByTown
    const values = [userId]

    if (town) {
      sql = buildSQL(sql, 'JOIN', joinStoreTown)
      values.push(town)
    }

    if (option === FeedOptions.FollowingUser) {
      sql = buildSQL(sql, 'JOIN', joinFollowingUser)
      values.push(userId)
    } else if (option === FeedOptions.StarUser) {
      sql = buildSQL(sql, 'JOIN', joinStarUser)
    }

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당하는 피드를 찾을 수 없습니다.')

    return rows.map((row) => columnFieldMapping(row))
  },

  searchFeedList: async (_, { hashtags, order, pagination }, { userId }, info) => {
    if (hashtags.length === 0) throw new UserInputError('해시태그 배열은 비어있을 수 없습니다.')

    let sql = searchFeedList
    const values: unknown[] = [userId, hashtags]

    sql = applyPaginationAndSorting(sql, values, 'feed', order, pagination)

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당 hashtags가 포함된 피드를 찾을 수 없습니다.')

    return rows.map((row) => columnFieldMapping(row))
  },
}
