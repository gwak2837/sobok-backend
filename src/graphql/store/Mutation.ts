import { AuthenticationError } from 'apollo-server-errors'

import { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { MutationResolvers, Store } from '../generated/graphql'
import toggleLikedStore from './sql/toggleLikedStore.sql'

export const Mutation: MutationResolvers<ApolloContext> = {
  toggleLikedStore: async (_, { id }, { userId }) => {
    if (!userId) throw new AuthenticationError('로그인 후 시도해주세요.')

    const { rows } = await poolQuery(toggleLikedStore, [userId, id])

    return { id, isLiked: rows[0].result } as Store
  },
}
