import { ApolloError, UserInputError } from 'apollo-server-errors'

import type { QueryStoresByTownAndCategoryArgs } from '../generated/graphql'

export function validateStoreCategories(
  categories: QueryStoresByTownAndCategoryArgs['categories']
) {
  if (categories) {
    if (categories.length === 0) throw new UserInputError('categories 배열은 비어있을 수 없습니다.')
    return encodeStoreCategories(categories)
  }
}

export function encodeStoreCategories(storeCategories: string[]) {
  return storeCategories.map((category) => {
    switch (category) {
      case '콘센트':
        return 0
      case '넓은테이블':
        return 1
      case '편한의자':
        return 2
      case '애견동반':
        return 3
      case '통유리':
        return 4
      case '흡연실':
        return 5
      case '노키즈존':
        return 6
      case '주차장':
        return 7
      case '루프탑':
        return 8
      case '야외석':
        return 9
      case '포장 전용':
        return 10
      default:
        throw new UserInputError(`categories 배열 항목 중 \`${category}\` 는 유효하지 않습니다.`)
    }
  })
}

export function decodeStoreCategories(encodedStoreCategories: number[]) {
  return encodedStoreCategories.map((encodedStoreCategory) => {
    switch (encodedStoreCategory) {
      case 0:
        return '콘센트'
      case 1:
        return '넓은테이블'
      case 2:
        return '편한의자'
      case 3:
        return '애견동반'
      case 4:
        return '통유리'
      case 5:
        return '흡연실'
      case 6:
        return '노키즈존'
      case 7:
        return '주차장'
      case 8:
        return '루프탑'
      case 9:
        return '야외석'
      case 10:
        return '포장 전용'
      default:
        throw new ApolloError(
          `encodedCategories 배열 항목 중 \`${encodedStoreCategory}\` 는 유효하지 않습니다.`
        )
    }
  })
}
