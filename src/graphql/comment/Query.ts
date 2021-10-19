import { NotFoundError } from '../../apollo/errors'
import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { columnFieldMapping } from '../common/ORM'
import { QueryResolvers } from '../generated/graphql'
import commentsByFeed from './sql/commentsByFeed.sql'

export const MenuOrderBy = {
  NAME: 'name',
  PRICE: 'price',
}

export const Query: QueryResolvers<ApolloContext> = {
  commentsByFeed: async (_, { feedId }) => {
    let sql = commentsByFeed
    const values = [feedId]

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0)
      throw new NotFoundError('해당 id의 피드를 찾을 수 없거나 해당 피드에 댓글이 없습니다.')

    return rows.map((row) => columnFieldMapping(row))
  },

  myComments: async (_, __, { userId }) => {
    return []
  },
}
