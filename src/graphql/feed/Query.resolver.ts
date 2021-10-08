import { AuthenticationError, UserInputError } from 'apollo-server-express'
import { FeedOptions, QueryResolvers } from '../../graphql/generated/graphql'
import { buildBasicFeedQuery, feedORM } from './ORM'

import type { ApolloContext } from 'src/apollo/server'
import { importSQL } from '../../utils'
import { poolQuery } from '../../database/postgres'
import { spliceSQL } from '../../utils/ORM'

const byId = importSQL(__dirname, 'sql/byId.sql')
const byStarUser = importSQL(__dirname, 'sql/byStarUser.sql')
const byStoreId = importSQL(__dirname, 'sql/byStoreId.sql')
const joinFollowingUser = importSQL(__dirname, 'sql/joinFollowingUser.sql')
const joinHashtag = importSQL(__dirname, 'sql/joinHashtag.sql')
const joinStoreOnTown = importSQL(__dirname, 'sql/joinStoreOnTown.sql')
const joinStarUser = importSQL(__dirname, 'sql/joinStarUser.sql')
const onHashtagName = importSQL(__dirname, 'sql/onHashtagName.sql')
const onTown = importSQL(__dirname, 'sql/onTown.sql')

const joinHashtagShort = 'JOIN hashtag ON hashtag.id = feed_x_hashtag.hashtag_id'

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
    if (option === FeedOptions.FollowingUser || option === FeedOptions.StarUser) {
      if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')
    }

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
      sql = spliceSQL(sql, await joinFollowingUser, 'WHERE')
      values.push(user!.id)
    }
    //
    else if (option === FeedOptions.StarUser) {
      if (sql.includes('JOIN "user"')) {
        sql = spliceSQL(sql, await byStarUser, 'GROUP BY')
      } else {
        sql = spliceSQL(sql, await joinStarUser, 'WHERE')
      }

      values.push(user!.id)
    }

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return feedORM(rows, columns)
  },

  searchFeedList: async (_, { hashtags }, { user }, info) => {
    if (hashtags.length === 0) throw new UserInputError('해시태그 배열은 비어있을 수 없습니다.')

    let [sql, columns, values] = await buildBasicFeedQuery(info, user)

    if (sql.includes(joinHashtagShort)) {
      sql = spliceSQL(sql, await onHashtagName, joinHashtagShort, true)
    } else {
      sql = spliceSQL(sql, `${await joinHashtag} ${await onHashtagName}`, 'GROUP BY')
    }

    values.push(hashtags)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return feedORM(rows, columns)
  },
}
