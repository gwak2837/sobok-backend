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

export function decodeCategory(id?: number) {
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
