import { ApolloError, UserInputError } from 'apollo-server-errors'

import { camelToSnake } from '../../utils'
import type { Menu as GraphQLMenu } from '../generated/graphql'

// GraphQL fields -> Database columns
export function menuFieldColumnMapping(menuField: keyof GraphQLMenu) {
  switch (menuField) {
    case 'isInBucket':
    case 'isLiked':
    case 'store':
    case 'hashtags':
      return 'menu.id'
    default:
      return `menu.${camelToSnake(menuField)}`
  }
}

export function validateMenuCategory(category: any) {
  if (category) {
    const encodedCategory = encodeMenuCategory(category)
    if (encodedCategory === null) throw new UserInputError('카테고리 값을 잘못 입력했습니다.')
    return encodedCategory
  }
}

export function encodeMenuCategory(menuCategory: string) {
  switch (menuCategory) {
    case '음료':
      return 0
    case '케이크':
      return 1
    case '구움과자':
      return 2
    case '커피':
      return 3
    case '베이커리':
      return 4
    case '마카롱':
      return 5
    case '브런치':
      return 6
    default:
      throw new UserInputError(`${menuCategory} 값을 잘못 입력했습니다.`)
  }
}

export function decodeMenuCategory(encodedCategory?: number) {
  switch (encodedCategory) {
    case 0:
      return '음료'
    case 1:
      return '케이크'
    case 2:
      return '구움과자'
    case 3:
      return '커피'
    case 4:
      return '베이커리'
    case 5:
      return '마카롱'
    case 6:
      return '브런치'
    default:
      throw new ApolloError(`\`${encodedCategory}\` 는 유효하지 않습니다.`)
  }
}
