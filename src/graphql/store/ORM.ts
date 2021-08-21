import { camelToSnake, snakeKeyToCamelKey } from '../../utils/commons'
import { Store } from '../generated/graphql'

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
      return camelToSnake(storeField)
  }
}

export function storeORM(store: Record<string, any>): any {
  return {
    ...snakeKeyToCamelKey(store),
    categories: getCategories(store.categories),
  }
}

function getCategories(ids: number[]) {
  return ids.map((id) => {
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
      default:
        return ''
    }
  })
}
