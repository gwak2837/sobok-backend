import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import format from 'pg-format'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { removeDoubleQuotesAround } from '../../utils'
import { selectColumnFromField } from '../../utils/ORM'
import { bucketFieldColumnMapping, bucketORM } from '../bucket/ORM'
import { commentFieldColumnMapping, commentORM } from '../comment/ORM'
import { feedFieldColumnMapping, feedORM } from '../feed/ORM'
import { UserResolvers } from '../generated/graphql'
import { menuFieldColumnMapping, menuORM } from '../menu/ORM'
import { newsFieldColumnMapping, newsORM } from '../news/ORM'
import { storeFieldColumnMapping, storeORM } from '../store/ORM'
import { trendFieldColumnMapping, trendORM } from '../trend/ORM'
import { decodeProviders, userFieldColumnMapping, userORM } from './ORM'
import comments from './sql/comments.sql'
import feed from './sql/feed.sql'
import followers from './sql/followers.sql'
import followings from './sql/followings.sql'
import likedComments from './sql/likedComments.sql'
import likedFeed from './sql/likedFeed.sql'
import likedMenus from './sql/likedMenus.sql'
import likedNews from './sql/likedNews.sql'
import likedStores from './sql/likedStores.sql'
import likedTrends from './sql/likedTrends.sql'
import menuBuckets from './sql/menuBuckets.sql'
import storeBuckets from './sql/storeBuckets.sql'

export const Gender = {
  OTHER: 0,
  MALE: 1,
  FEMALE: 2,
}

function authenticateUser(loginedUserId: ApolloContext['userId'], targetUserId: string) {
  if (!loginedUserId) throw new AuthenticationError('개인정보를 확인하려면 로그인 후 시도해주세요.')

  if (loginedUserId !== targetUserId)
    throw new ForbiddenError('다른 사용자의 개인정보는 조회할 수 없습니다.')
}

export const User: UserResolvers<ApolloContext> = {
  creationTime: async ({ id, creationTime }, __, { userId }) => {
    authenticateUser(userId, id)
    return creationTime
  },

  modificationTime: async ({ id, modificationTime }, __, { userId }) => {
    authenticateUser(userId, id)
    return modificationTime
  },

  email: async ({ id, email }, __, { userId }) => {
    authenticateUser(userId, id)
    return email
  },

  name: async ({ id, name }, __, { userId }) => {
    authenticateUser(userId, id)
    return name
  },

  phone: async ({ id, phone }, __, { userId }) => {
    authenticateUser(userId, id)
    return phone
  },

  isEmailVerified: async ({ id, isEmailVerified }, __, { userId }) => {
    authenticateUser(userId, id)
    return isEmailVerified
  },

  providers: (parent, __, { userId }) => {
    authenticateUser(userId, parent.id)
    return decodeProviders(parent as any)
  },

  // comments: async (_, __, { userId }, info) => {
  //   const columns = selectColumnFromField(info, commentFieldColumnMapping)

  //   const { rows } = await poolQuery(format(await comments, columns), [userId])

  //   return rows.map((row) => commentORM(row))
  // },

  // feed: async (_, __, { userId }, info) => {
  //   const columns = selectColumnFromField(info, feedFieldColumnMapping)

  //   const { rows } = await poolQuery(format(await feed, columns), [userId])

  //   return rows.map((row) => feedORM(row, columns)[0]) //
  // },

  // followers: async (_, __, { userId }, info) => {
  //   if (!userId) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

  //   const columns = selectColumnFromField(info, userFieldColumnMapping)

  //   const { rows } = await poolQuery(format(await followers, columns), [userId])

  //   return rows.map((row) => userORM(row))
  // },

  // followings: async (_, __, { userId }, info) => {
  //   if (!userId) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

  //   const columns = selectColumnFromField(info, userFieldColumnMapping)

  //   const { rows } = await poolQuery(format(await followings, columns), [userId])

  //   return rows.map((row) => userORM(row))
  // },

  likedComments: async (_, __, { userId }, info) => {
    if (!userId) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, commentFieldColumnMapping).map((column) =>
      column === 'user_id' ? 'comment.user_id' : column
    )

    const formattedSQL = removeDoubleQuotesAround(
      ['comment.user_id'],
      format(likedComments, columns)
    )

    const { rows } = await poolQuery(formattedSQL, [userId])

    return rows.map((row) => commentORM(row))
  },

  likedFeed: async (_, __, { userId }, info) => {
    if (!userId) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, feedFieldColumnMapping)

    const formattedSQL = removeDoubleQuotesAround(['feed.user_id'], format(likedFeed, columns))

    const { rows } = await poolQuery(formattedSQL, [userId])

    return rows.map((row) => feedORM(row, columns)[0]) //
  },

  likedMenus: async (_, __, { userId }, info) => {
    if (!userId) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    // 좋아하는 메뉴를 수정하지 않았다면 레디스 캐시에서 가져오기

    const columns = selectColumnFromField(info, menuFieldColumnMapping)

    const { rows } = await poolQuery(format(likedMenus, columns), [userId])

    return rows.map((row) => menuORM(row, columns)[0])
  },

  likedNews: async (_, __, { userId }, info) => {
    if (!userId) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, newsFieldColumnMapping).map((column) =>
      column === 'user_id' ? 'news.user_id' : column
    )

    const formattedSQL = removeDoubleQuotesAround(['news.user_id'], format(likedNews, columns))

    const { rows } = await poolQuery(formattedSQL, [userId])

    return rows.map((row) => newsORM(row, columns)[0])
  },

  likedStores: async (_, __, { userId }, info) => {
    if (!userId) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    // 좋아하는 매장을 수정하지 않았다면 레디스 캐시에서 가져오기

    const columns = selectColumnFromField(info, storeFieldColumnMapping).map((column) =>
      column === 'user_id' ? 'store.user_id' : column
    )

    const formattedSQL = removeDoubleQuotesAround(['store.user_id'], format(likedStores, columns))

    const { rows } = await poolQuery(formattedSQL, [userId])

    return storeORM(rows, columns)
  },

  likedTrends: async (_, __, { userId }, info) => {
    if (!userId) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, trendFieldColumnMapping).map((column) =>
      column === 'user_id' ? 'trend.user_id' : column
    )

    const formattedSQL = removeDoubleQuotesAround(['trend.user_id'], format(likedTrends, columns))

    const { rows } = await poolQuery(formattedSQL, [userId])

    return rows.map((row) => trendORM(row))
  },
}
