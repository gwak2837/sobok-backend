import { AuthenticationError, ForbiddenError } from 'apollo-server-express'

import type { ApolloContext } from '../../apollo/server'
import { UserResolvers } from '../generated/graphql'
import { decodeProviders } from './ORM'

export const Gender = {
  OTHER: 0,
  MALE: 1,
  FEMALE: 2,
}

function authenticateUser(loginedUserId: ApolloContext['userId'], targetUserId: string) {
  if (!loginedUserId) throw new AuthenticationError('개인정보를 확인하려면 로그인 후 시도해주세요.')

  if (loginedUserId !== targetUserId)
    throw new ForbiddenError('다른 사용자의 정보는 조회할 수 없습니다.')
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
}
