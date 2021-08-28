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

export function menuORM(menu: Partial<menu>): any {
  return {
    ...snakeKeyToCamelKey(menu),
    category: decodeCategory(menu.category),
  }
}

export function encodeCategory(id: string) {
  switch (id) {
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
      return null
  }
}

function decodeCategory(id?: number) {
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
