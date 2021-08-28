import format from 'pg-format'
import { commentFieldColumnMapping, commentORM } from '../comment/ORM'
import { feedFieldColumnMapping, feedORM } from '../feed/ORM'
import { UserResolvers } from '../generated/graphql'
import { storeFieldColumnMapping, storeORM } from '../store/ORM'
import { poolQuery } from '../../database/postgres'
import { importSQL, removeDoubleQuotesAround } from '../../utils/commons'
import { selectColumnFromField } from '../../utils/ORM'
import { bucketFieldColumnMapping, bucketORM } from '../bucket/ORM'
import { AuthenticationError } from 'apollo-server-express'
import { menuFieldColumnMapping, menuORM } from '../menu/ORM'
import { newsFieldColumnMapping, newsORM } from '../news/ORM'
import { trendFieldColumnMapping, trendORM } from '../trend/ORM'
import { userFieldColumnMapping, userORM } from './ORM'
import type {
  comment as Comment,
  feed as Feed,
  user as TUser,
  menu as Menu,
  store as Store,
  news as News,
  bucket as Bucket,
  trend as Trend,
} from 'src/database/sobok'

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

export const User: UserResolvers = {
  comments: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, commentFieldColumnMapping)

    const { rows } = await poolQuery<Comment>(format(await comments, columns), [user.id])

    return rows.map((row) => commentORM(row))
  },

  feed: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, feedFieldColumnMapping)

    const { rows } = await poolQuery<Feed>(format(await feed, columns), [user.id])

    return rows.map((row) => feedORM(row))
  },

  followers: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, userFieldColumnMapping)

    const { rows } = await poolQuery<TUser>(format(await followers, columns), [user.id])

    return rows.map((row) => userORM(row))
  },

  followings: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, userFieldColumnMapping)

    const { rows } = await poolQuery<TUser>(format(await followings, columns), [user.id])

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

    const { rows } = await poolQuery<Comment>(formattedSQL, [user.id])

    return rows.map((row) => commentORM(row))
  },

  likedFeed: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, feedFieldColumnMapping).map((column) =>
      column === 'user_id' ? 'feed.user_id' : column
    )

    const formattedSQL = removeDoubleQuotesAround(
      ['feed.user_id'],
      format(await likedFeed, columns)
    )

    const { rows } = await poolQuery<Feed>(formattedSQL, [user.id])

    return rows.map((row) => feedORM(row))
  },

  likedMenus: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    // 좋아하는 메뉴를 수정하지 않았다면 레디스 캐시에서 가져오기

    const columns = selectColumnFromField(info, menuFieldColumnMapping)

    const { rows } = await poolQuery<Menu>(format(await likedMenus, columns), [user.id])

    return rows.map((row) => menuORM(row))
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

    const { rows } = await poolQuery<News>(formattedSQL, [user.id])

    return rows.map((row) => newsORM(row))
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

    const { rows } = await poolQuery<Store>(formattedSQL, [user.id])

    return rows.map((row) => storeORM(row))
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

    const { rows } = await poolQuery<Trend>(formattedSQL, [user.id])

    return rows.map((row) => trendORM(row))
  },

  menuBuckets: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, bucketFieldColumnMapping)

    const { rows } = await poolQuery<Bucket>(format(await menuBuckets, columns), [user.id])

    return rows.map((row) => bucketORM(row))
  },

  storeBuckets: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, bucketFieldColumnMapping)

    const { rows } = await poolQuery<Bucket>(format(await storeBuckets, columns), [user.id])

    return rows.map((row) => bucketORM(row))
  },
}
