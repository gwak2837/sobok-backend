import { UserInputError } from 'apollo-server-errors'
import { Maybe } from 'graphql/jsutils/Maybe'

import { OrderDirection, Pagination } from '../graphql/generated/graphql'

const keywords = ['JOIN', 'WHERE', 'GROUP BY', 'ORDER BY', 'FETCH'] as const
type Keyword = typeof keywords[number]

function findInsertingPosition(sourceSQL: string, keyword: Keyword) {
  for (let i = keywords.indexOf(keyword) + 1; i < keywords.length; i++) {
    const position = sourceSQL.indexOf(keywords[i])
    if (position !== -1) return position
  }
  return sourceSQL.length
}

export function buildSQL(sourceSQL: string, keyword: Keyword, insertingSQL: string) {
  let parameterIndex = (sourceSQL.match(/\$\d+/g)?.length ?? 0) + 1
  const formattedSQL = insertingSQL.replace(/\$\d+/g, () => `$${parameterIndex++}`)

  const keywordIndex = sourceSQL.indexOf(keyword)
  const insertionIndex = findInsertingPosition(sourceSQL, keyword)
  const firstSourceSQL = sourceSQL.slice(0, insertionIndex)
  const lastSourceSQL = sourceSQL.slice(insertionIndex)

  if (keywordIndex === -1) {
    return `${firstSourceSQL} ${keyword} ${formattedSQL} ${lastSourceSQL}`
  }

  switch (keyword) {
    case 'JOIN':
      return `${firstSourceSQL} ${formattedSQL} ${lastSourceSQL}`
    case 'WHERE':
      return `${firstSourceSQL} AND ${formattedSQL} ${lastSourceSQL}`
    case 'GROUP BY':
      return `${firstSourceSQL},${formattedSQL} ${lastSourceSQL}`
    case 'ORDER BY':
      throw new Error('ORDER BY already existed on source SQL.')
    case 'FETCH':
      throw new Error('FETCH already existed on source SQL.')
  }
}

type Order = {
  by?: unknown
  direction?: Maybe<OrderDirection>
}

export function validatePaginationAndSorting(
  order: Maybe<Order> | undefined,
  pagination: Pagination
) {
  if (order && !order.by && !order.direction)
    throw new UserInputError('order 객체는 비어있을 수 없습니다.')
  if (!pagination.lastId && pagination.lastValue)
    throw new UserInputError('pagination.lastId가 존재해야 합니다.')
}

export function applyPaginationAndSorting(
  sql: string,
  values: unknown[],
  tableName: string,
  order: Maybe<Order> | undefined,
  pagination: Pagination
) {
  // Pagination
  if (pagination.lastId) {
    const inequalitySign = order?.direction === OrderDirection.Asc ? '>' : '<'
    if (pagination.lastValue) {
      if (!order?.by)
        throw new UserInputError('pagination.lastValue와 order.by가 모두 존재해야 합니다.')
      const keysetPagination = `(${tableName}.${order.by}, ${tableName}.id) ${inequalitySign} ($1, $2)`
      sql = buildSQL(sql, 'WHERE', keysetPagination)
      values.push(pagination.lastValue, pagination.lastId)
    } else {
      const idPagination = `${tableName}.id ${inequalitySign} $1`
      sql = buildSQL(sql, 'WHERE', idPagination)
      values.push(pagination.lastId)
    }
  }

  // ORDER BY
  const orderDirection = order?.direction === OrderDirection.Asc ? '' : 'DESC'
  if (order?.by) {
    const columnOrdering = `${tableName}.${order.by} ${orderDirection}, ${tableName}.id ${orderDirection}`
    sql = buildSQL(sql, 'ORDER BY', columnOrdering)
  } else {
    const idOrdering = `${tableName}.id ${orderDirection}`
    sql = buildSQL(sql, 'ORDER BY', idOrdering)
  }

  // FETCH
  sql = buildSQL(sql, 'FETCH', 'FIRST $1 ROWS ONLY')
  values.push(pagination.limit)

  return sql
}
