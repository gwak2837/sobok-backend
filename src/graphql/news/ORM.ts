import type { news } from 'src/database/sobok'
import type { News } from 'src/graphql/generated/graphql'
import { camelToSnake, snakeKeyToCamelKey } from '../../utils/commons'

// All GraphQL fields -> Database columns
export function newsFieldColumnMapping(newsField: keyof News) {
  switch (newsField) {
    case 'isLiked':
      return 'id'
    case 'store':
      return 'store_id'
    default:
      return camelToSnake(newsField)
  }
}

// All database columns -> GraphQL fields
export function newsORM(news: news): any {
  return {
    ...snakeKeyToCamelKey(news),
    category: decodeCategory(news.category),
  }
}

export function encodeCategory(category: string) {
  switch (category) {
    case '오늘의라인업':
      return 0
    case '신메뉴소식':
      return 1
    case '할인/이벤트':
      return 2
    case '공지사항':
      return 3
    case '품절':
      return 4
    default:
      return null
  }
}

function decodeCategory(id: number) {
  switch (id) {
    case 0:
      return '오늘의라인업'
    case 1:
      return '신메뉴소식'
    case 2:
      return '할인/이벤트'
    case 3:
      return '공지사항'
    case 4:
      return '품절'
    default:
      return null
  }
}
