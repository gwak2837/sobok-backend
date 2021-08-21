import format from 'pg-format'
import { commentFieldColumnMapping, commentORM } from '../comment/ORM'
import { feedFieldColumnMapping } from '../feed/ORM'
import { UserResolvers } from '../generated/graphql'
import { storeFieldColumnMapping, storeORM } from '../store/ORM'
import { poolQuery } from '../../database/postgres'
import { importSQL, removeDoubleQuotesAround } from '../../utils/commons'
import { selectColumnFromField } from '../../utils/ORM'
import { bucketFieldColumnMapping, bucketORM } from '../bucket/ORM'

const comments = importSQL(__dirname, 'sql/comments.sql')
const feed = importSQL(__dirname, 'sql/feed.sql')
const menuBuckets = importSQL(__dirname, 'sql/menuBuckets.sql')
const storeBuckets = importSQL(__dirname, 'sql/storeBuckets.sql')
const likedStores = importSQL(__dirname, 'sql/likedStores.sql')

export const User: UserResolvers = {
  comments: async ({ id }, _, __, info) => {
    const columns = selectColumnFromField(info, commentFieldColumnMapping)

    const { rows } = await poolQuery(format(await comments, columns), [id])

    return rows.map((row) => commentORM(row))
  },

  feed: async ({ id }, _, __, info) => {
    const columns = selectColumnFromField(info, feedFieldColumnMapping)

    const { rows } = await poolQuery(format(await feed, columns), [id])

    return rows.map((row) => commentORM(row))
  },

  menuBuckets: async ({ id }, _, __, info) => {
    const columns = selectColumnFromField(info, bucketFieldColumnMapping)

    const { rows } = await poolQuery(format(await menuBuckets, columns), [id])

    return rows.map((row) => bucketORM(row))
  },

  storeBuckets: async ({ id }, _, __, info) => {
    const columns = selectColumnFromField(info, bucketFieldColumnMapping)

    const { rows } = await poolQuery(format(await storeBuckets, columns), [id])

    return rows.map((row) => bucketORM(row))
  },

  likedStores: async ({ id }, _, __, info) => {
    // 좋아하는 매장을 수정하지 않았다면 레디스 캐시에서 가져오기

    const columns = selectColumnFromField(info, storeFieldColumnMapping).map((column) =>
      column === 'user_id' ? 'store.user_id' : column
    )

    const formattedSQL = removeDoubleQuotesAround(
      ['store.user_id'],
      format(await likedStores, columns)
    )

    const { rows } = await poolQuery(formattedSQL, [id])

    return rows.map((row) => storeORM(row))
  },
}
