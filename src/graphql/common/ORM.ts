import { UserInputError } from 'apollo-server-core'

import { feed, menu, store, user } from '../../database/sobok'
import { snakeToCamel } from '../../utils'
import { Maybe, OrderDirection, Pagination } from '../generated/graphql'

/**
 * 선택된 GraphQL 필드를 처리하기 위해 필요한 데이터베이스 테이블 컬럼 목록을 반환한다.
 * @param fields
 * @param fieldColumnMapping GraphQL 필드 이름과 선택할 테이블 컬럼 이름의 맵핑 함수
 * @returns 데이터베이스에서 선택할 컬럼 이름 배열
 */
export function getColumnsFromFields(
  fields: Record<string, unknown>,
  fieldColumnMapping: (field: any) => string | string[]
) {
  return [
    ...new Set(
      Object.keys(fields)
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

// 각 파일로 분리시키기
export const orm: Record<string, any> = {
  store: (databaseStore: store) => {
    const graphqlStore: Record<string, any> = {}
    for (const column in databaseStore) {
      if (column === 'point') {
        graphqlStore.latitude = databaseStore.point.x
        graphqlStore.longitude = databaseStore.point.y
      } else {
        graphqlStore[snakeToCamel(column)] = databaseStore[column as keyof store]
      }
    }
    return graphqlStore
  },
  menu: (databaseMenu: menu) => {
    const graphQLMenu: Record<string, unknown> = {}
    for (const column in databaseMenu) {
      graphQLMenu[snakeToCamel(column)] = databaseMenu[column as keyof menu]
    }
    return graphQLMenu
  },
  feed: (databaseFeed: feed) => {
    const graphQLMenu: Record<string, unknown> = {}
    for (const column in databaseFeed) {
      graphQLMenu[snakeToCamel(column)] = databaseFeed[column as keyof feed]
    }
    return graphQLMenu
  },
  user: (databaseUser: user) => {
    const graphQLMenu: Record<string, unknown> = {}
    for (const column in databaseUser) {
      graphQLMenu[snakeToCamel(column)] = databaseUser[column as keyof user]
    }
    return graphQLMenu
  },
}

/** Database columns -> GraphQL fields */
export function columnFieldMapping(databaseRow: Record<string, unknown>) {
  const graphqlObject: any = {}

  for (const column in databaseRow) {
    const value = databaseRow[column]
    if (column.includes('__')) {
      if (value) {
        const [snakeTable, snakeColumn] = column.split('__')
        const camelTable = snakeToCamel(snakeTable)
        const camelColumn = snakeToCamel(snakeColumn)
        if (!graphqlObject[camelTable]) graphqlObject[camelTable] = {}
        graphqlObject[camelTable][camelColumn] = value
      }
    } else {
      graphqlObject[snakeToCamel(column)] = value
    }
  }

  for (const field in graphqlObject) {
    if (orm[field]) graphqlObject[field] = orm[field](graphqlObject[field])
  }

  return graphqlObject
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
