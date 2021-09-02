import { GraphQLResolveInfo } from 'graphql'
import graphqlFields from 'graphql-fields'

/**
 * 선택된 GraphQL 필드를 처리하기 위해 필요한 데이터베이스 테이블 컬럼 목록을 반환한다.
 * @param info
 * @param fieldColumnMapping GraphQL 필드 이름과 선택할 테이블 컬럼 이름의 맵핑 함수
 * @returns 데이터베이스에서 선택할 컬럼 이름 배열
 */
export function selectColumnFromField(
  info: GraphQLResolveInfo,
  fieldColumnMapping: (field: any) => string | string[]
) {
  return selectColumnFromSubField(graphqlFields(info), fieldColumnMapping)
}

export function selectColumnFromSubField(
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

export function serializeSQLParameters(sql: string) {
  let i = 1
  return sql.replace(/\$\d+/g, () => `$${i++}`)
}

export function removeColumnWithAggregateFunction(column: string) {
  return column.search(/\w+\([\w."` ]+\)/) === -1
}

export function spliceSQL(sql: string, sql2: string, str: string, endIndex = false) {
  const found = sql.indexOf(str)

  const foundIndex = found !== -1 ? (endIndex ? found + str.length : found) : sql.length

  let parameterStartNumber = (sql.match(/\$\d+/g)?.length ?? 0) + 1
  const formattedSQL = sql2.replace(/\$\d+/g, () => `$${parameterStartNumber++}`)

  return `${sql.slice(0, foundIndex)} ${formattedSQL} ${sql.slice(foundIndex)}`
}
