import { NotImplementedError } from '../../apollo/errors'
import type { StoreResolvers } from '../generated/graphql'
import { decodeCategories } from './ORM'

export const Store: StoreResolvers = {
  categories: ({ categories }, __) => {
    return decodeCategories(categories)
  },

  isInBucket: ({ isInBucket }) => {
    return !!isInBucket
  },

  isLiked: ({ isLiked }) => {
    return !!isLiked
  },

  menus: ({ menus }) => {
    if (!menus) throw new NotImplementedError('menus 필드 리졸버가 구현되지 않았습니다.')
    return menus
  },

  hashtags: ({ hashtags }) => {
    if (!hashtags) throw new NotImplementedError('hashtags 필드 리졸버가 구현되지 않았습니다.')
    return hashtags
  },
}
