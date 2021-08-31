import type { store } from 'src/database/sobok'
import type { Store } from 'src/graphql/generated/graphql'
import { camelToSnake, snakeKeyToCamelKey } from '../../utils/commons'

export function storeFieldColumnMapping(storeField: keyof Store) {
  switch (storeField) {
    case 'isInBucket':
      return 'id'
    case 'isLiked':
      return 'id'
    case 'menus':
      return 'id'
    case 'hashtags':
      return 'id'
    case 'user':
      return 'user_id'
    default:
      return `store.${camelToSnake(storeField)}`
  }
}

export function storeORM(store: Partial<store>): any {
  return {
    ...snakeKeyToCamelKey(store),
    categories: decodeCategories(store.categories),
  }
}

export const storeFieldsFetchedFromOtherTable = new Set([
  'isInBucket',
  'isLiked',
  'menus',
  'hashtags',
  'news',
  'user',
])

export function encodeCategories(categories?: string[]) {
  return categories?.map((category) => {
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

function decodeCategories(ids?: number[]) {
  return ids?.map((id) => {
    switch (id) {
      case 0:
        return '콘센트'
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
