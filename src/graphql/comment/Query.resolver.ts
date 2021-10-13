import { UserInputError } from 'apollo-server-express'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import {
  applyPaginationAndSorting,
  buildSQL,
  objectRelationMapping,
  spliceSQL,
} from '../../utils/ORM'
import { QueryResolvers } from '../generated/graphql'
import { buildBasicMenuQuery } from '../menu/ORM'
import { buildBasicCommentQuery } from './ORM'
import joinHashtag from './sql/joinHashtag.sql'
import joinMenuBucketOnMenuBucketId from './sql/joinMenuBucketOnMenuBucketId.sql'
import joinStoreOnTown from './sql/joinStoreOnTown.sql'
import joinStoreOnTownAndCategory from './sql/joinStoreOnTownAndCategory.sql'
import verifyUserBucket from './sql/verifyUserBucket.sql'

const joinHashtagShort = 'JOIN hashtag ON hashtag.id = menu_x_hashtag.hashtag_id'
const joinStoreOnId = 'JOIN store ON store.id = menu.store_id'

export const MenuOrderBy = {
  NAME: 'name',
  PRICE: 'price',
}

export const Query: QueryResolvers<ApolloContext> = {
  commentsByFeed: async (_, { feedId }, { userId }, info) => {
    let [sql, values] = buildBasicCommentQuery(info)

    sql = buildSQL(sql, 'WHERE', 'WHERE "comment".feed_id = $1')
    values.push(feedId)

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) return null

    console.log('👀 - rows', rows)

    return objectRelationMapping(rows)
    // return commentORM(rows)[0]
  },

  myComments: async (_, __, { userId }, info) => {
    return []
  },
}
