import { camelToSnake, snakeKeyToCamelKey } from '../../utils/commons'
import { Menu } from '../generated/graphql'

export function menuFieldColumnMapping(menuField: keyof Menu) {
  switch (menuField) {
    case 'isInBucket':
      return 'id'
    case 'isLiked':
      return 'id'
    case 'store':
      return 'store_id'
    case 'hashtags':
      return 'id'
    default:
      return camelToSnake(menuField)
  }
}

export function menuORM(menu: Record<string, any>): any {
  return {
    ...snakeKeyToCamelKey(menu),
    category: getCategory(menu.category),
  }
}

function getCategory(id: number) {
  switch (id) {
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
      return ''
  }
}
