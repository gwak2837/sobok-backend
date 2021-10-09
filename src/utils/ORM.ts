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
