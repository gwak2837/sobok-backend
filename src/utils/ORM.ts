import { UserInputError } from 'apollo-server-core'

import { Maybe, OrderDirection, Pagination } from '../graphql/generated/graphql'
import { snakeToCamel } from '.'

/**
 * 선택된 GraphQL 필드를 처리하기 위해 필요한 데이터베이스 테이블 컬럼 목록을 반환한다.
 * @param subFields
 * @param fieldColumnMapping GraphQL 필드 이름과 선택할 테이블 컬럼 이름의 맵핑 함수
 * @returns 데이터베이스에서 선택할 컬럼 이름 배열
 */
export function selectColumnFromField(
  subFields: Record<string, unknown>,
  fieldColumnMapping: (field: any) => string | string[]
) {
  return [
    ...new Set(
      Object.keys(subFields)
        .filter((field) => field !== '__typename')
        .map(fieldColumnMapping)
        .filter((field) => field !== '')
        .flat()
    ),
  ]
}

export function serializeParameters(sql: string) {
  let i = 1
  return sql.replace(/\$\d+/g, () => `$${i++}`)
}

/**
 * `sql`의 `targetString` 시작 (또는 끝) 지점에 `sql2`를 끼워 넣는다.
 */
export function spliceSQL(
  sourceSQL: string,
  insertingSQL: string,
  targetString?: string,
  endIndex = false
) {
  let foundIndex
  if (targetString) {
    const found = sourceSQL.indexOf(targetString)
    foundIndex = found !== -1 ? (endIndex ? found + targetString.length : found) : sourceSQL.length
  } else {
    foundIndex = sourceSQL.length
  }
  let parameterStartNumber = (sourceSQL.match(/\$\d+/g)?.length ?? 0) + 1
  const formattedSQL = insertingSQL.replace(/\$\d+/g, () => `$${parameterStartNumber++}`)
  return `${sourceSQL.slice(0, foundIndex)} ${formattedSQL} ${sourceSQL.slice(foundIndex)}`
}

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

// Database records -> GraphQL fields
export function objectRelationMapping(rows: Record<string, unknown>[]) {
  return rows.map((row) => {
    const graphqlObject: any = {}
    for (const column in row) {
      graphqlObject[snakeToCamel(column)] = row[column]
    }
    return graphqlObject
  })
}

type Order = {
  by?: unknown
  direction?: Maybe<OrderDirection>
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
