import { UserInputError } from 'apollo-server-errors'

import { store } from '../../database/sobok'
import { snakeToCamel } from '../../utils'
import type { QueryStoresByTownAndCategoryArgs } from '../generated/graphql'

// Database columns -> GraphQL fields
export function storeORM(databaseStore: store) {
  const graphqlStore: any = {}
  for (const column in databaseStore) {
    if (column === 'point') {
      graphqlStore.latitude = databaseStore.point.x
      graphqlStore.longitude = databaseStore.point.y
    } else {
      graphqlStore[snakeToCamel(column)] = databaseStore[column as keyof store]
    }
  }
  return graphqlStore
}

export function validateStoreCategories(
  categories: QueryStoresByTownAndCategoryArgs['categories']
) {
  if (categories) {
    if (categories.length === 0) throw new UserInputError('카테고리 배열은 비어있을 수 없습니다.')
    const encodedCategories = encodeCategories(categories)
    if (encodedCategories.some((encodeCategory) => encodeCategory === null))
      throw new UserInputError('카테고리 값은 null이 될 수 없습니다.')
    return encodedCategories
  }
}

export function encodeCategories(categories: string[]) {
  return categories.map((category) => {
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
        return null
    }
  })
}

export function decodeCategories(ids: number[]) {
  return ids.map((id) => {
    switch (id) {
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
        return ''
    }
  })
}
