import format from 'pg-format'
import type { ApolloContext } from 'src/apollo/server'
import { commentFieldColumnMapping, commentORM } from '../comment/ORM'
import { feedFieldColumnMapping, feedORM } from '../feed/ORM'
import { UserResolvers } from '../generated/graphql'
import { storeFieldColumnMapping, storeORM } from '../store/ORM'
import { poolQuery } from '../../database/postgres'
import { importSQL, removeDoubleQuotesAround } from '../../utils/commons'
import { selectColumnFromField } from '../../utils/ORM'
import { bucketFieldColumnMapping, bucketORM } from '../bucket/ORM'
import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import { menuFieldColumnMapping, menuORM } from '../menu/ORM'
import { newsFieldColumnMapping, newsORM } from '../news/ORM'
import { trendFieldColumnMapping, trendORM } from '../trend/ORM'
import { decodeProviders, userFieldColumnMapping, userORM } from './ORM'

const comments = importSQL(__dirname, 'sql/comments.sql')
const feed = importSQL(__dirname, 'sql/feed.sql')
const followers = importSQL(__dirname, 'sql/followers.sql')
const followings = importSQL(__dirname, 'sql/followings.sql')
const likedComments = importSQL(__dirname, 'sql/likedComments.sql')
const likedFeed = importSQL(__dirname, 'sql/likedFeed.sql')
const likedMenus = importSQL(__dirname, 'sql/likedMenus.sql')
const likedNews = importSQL(__dirname, 'sql/likedNews.sql')
const likedStores = importSQL(__dirname, 'sql/likedStores.sql')
const likedTrends = importSQL(__dirname, 'sql/likedTrends.sql')
const menuBuckets = importSQL(__dirname, 'sql/menuBuckets.sql')
const storeBuckets = importSQL(__dirname, 'sql/storeBuckets.sql')

export const Gender = {
  OTHER: 0,
  MALE: 1,
  FEMALE: 2,
}

function authenticateUser(loginedUser: ApolloContext['user'], targetUserId: string) {
  if (!loginedUser) throw new AuthenticationError('개인정보를 확인하려면 로그인 후 시도해주세요.')

  if (loginedUser.id !== targetUserId)
    throw new ForbiddenError('다른 사용자의 개인정보는 조회할 수 없습니다.')
}

export const User: UserResolvers<ApolloContext> = {
  creationTime: async ({ id, creationTime }, __, { user }) => {
    authenticateUser(user, id)
    return creationTime
  },

  modificationTime: async ({ id, modificationTime }, __, { user }) => {
    authenticateUser(user, id)
    return modificationTime
  },

  email: async ({ id, email }, __, { user }) => {
    authenticateUser(user, id)
    return email
  },

  name: async ({ id, name }, __, { user }) => {
    authenticateUser(user, id)
    return name
  },

  phone: async ({ id, phone }, __, { user }) => {
    authenticateUser(user, id)
    return phone
  },

  isEmailVerified: async ({ id, isEmailVerified }, __, { user }) => {
    authenticateUser(user, id)
    return isEmailVerified
  },

  providers: (parent, __, { user }) => {
    authenticateUser(user, parent.id)
    return decodeProviders(parent as any)
  },

  comments: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, commentFieldColumnMapping)

    const { rows } = await poolQuery(format(await comments, columns), [user.id])

    return rows.map((row) => commentORM(row))
  },

  feed: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, feedFieldColumnMapping)

    const { rows } = await poolQuery(format(await feed, columns), [user.id])

    return rows.map((row) => feedORM(row, columns)[0]) //
  },

  followers: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, userFieldColumnMapping)

    const { rows } = await poolQuery(format(await followers, columns), [user.id])

    return rows.map((row) => userORM(row))
  },

  followings: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, userFieldColumnMapping)

    const { rows } = await poolQuery(format(await followings, columns), [user.id])

    return rows.map((row) => userORM(row))
  },

  likedComments: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, commentFieldColumnMapping).map((column) =>
      column === 'user_id' ? 'comment.user_id' : column
    )

    const formattedSQL = removeDoubleQuotesAround(
      ['comment.user_id'],
      format(await likedComments, columns)
    )

    const { rows } = await poolQuery(formattedSQL, [user.id])

    return rows.map((row) => commentORM(row))
  },

  likedFeed: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, feedFieldColumnMapping)

    const formattedSQL = removeDoubleQuotesAround(
      ['feed.user_id'],
      format(await likedFeed, columns)
    )

    const { rows } = await poolQuery(formattedSQL, [user.id])

    return rows.map((row) => feedORM(row, columns)[0]) //
  },

  likedMenus: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    // 좋아하는 메뉴를 수정하지 않았다면 레디스 캐시에서 가져오기

    const columns = selectColumnFromField(info, menuFieldColumnMapping)

    const { rows } = await poolQuery(format(await likedMenus, columns), [user.id])

    return rows.map((row) => menuORM(row, columns)[0])
  },

  likedNews: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, newsFieldColumnMapping).map((column) =>
      column === 'user_id' ? 'news.user_id' : column
    )

    const formattedSQL = removeDoubleQuotesAround(
      ['news.user_id'],
      format(await likedNews, columns)
    )

    const { rows } = await poolQuery(formattedSQL, [user.id])

    return rows.map((row) => newsORM(row, columns)[0])
  },

  likedStores: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    // 좋아하는 매장을 수정하지 않았다면 레디스 캐시에서 가져오기

    const columns = selectColumnFromField(info, storeFieldColumnMapping).map((column) =>
      column === 'user_id' ? 'store.user_id' : column
    )

    const formattedSQL = removeDoubleQuotesAround(
      ['store.user_id'],
      format(await likedStores, columns)
    )

    const { rows } = await poolQuery(formattedSQL, [user.id])

    return storeORM(rows, columns)
  },

  likedTrends: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, trendFieldColumnMapping).map((column) =>
      column === 'user_id' ? 'trend.user_id' : column
    )

    const formattedSQL = removeDoubleQuotesAround(
      ['trend.user_id'],
      format(await likedTrends, columns)
    )

    const { rows } = await poolQuery(formattedSQL, [user.id])

    return rows.map((row) => trendORM(row))
  },

  menuBuckets: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, bucketFieldColumnMapping)

    const { rows } = await poolQuery(format(await menuBuckets, columns), [user.id])

    return rows.map((row) => bucketORM(row))
  },

  storeBuckets: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, bucketFieldColumnMapping)

    const { rows } = await poolQuery(format(await storeBuckets, columns), [user.id])

    return rows.map((row) => bucketORM(row))
  },
}
