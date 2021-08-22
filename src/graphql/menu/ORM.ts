import type { menu } from 'src/database/sobok'
import type { Menu } from 'src/graphql/generated/graphql'
import { camelToSnake, snakeKeyToCamelKey } from '../../utils/commons'

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

export function menuORM(menu: menu): any {
  return {
    ...snakeKeyToCamelKey(menu),
    category: decodeCategory(menu.category),
  }
}

function decodeCategory(id: number) {
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
