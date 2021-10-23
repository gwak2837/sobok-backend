import { store } from '../../database/sobok'
import { snakeToCamel } from '../../utils'

type ObjectRelationMapping = (a: any) => Record<string, unknown>

const orm: Record<string, ObjectRelationMapping> = {
  store: (storeRow: store) => {
    const graphqlStore: Record<string, unknown> = {}
    for (const column in storeRow) {
      if (column === 'point') {
        graphqlStore.latitude = storeRow.point.x
        graphqlStore.longitude = storeRow.point.y
      } else {
        graphqlStore[snakeToCamel(column)] = storeRow[column as keyof store]
      }
    }
    return graphqlStore
  },
  default: (row: Record<string, unknown>) => {
    const graphql: Record<string, unknown> = {}
    for (const column in row) {
      graphql[snakeToCamel(column)] = row[column]
    }
    return graphql
  },
}

/** Database columns -> GraphQL fields */
export function graphqlRelationMapping(row: Record<string, unknown>, tableName: string) {
  let selfTable: Record<string, unknown> = {}
  const otherTables: Record<string, Record<string, unknown>> = {}

  for (const column in row) {
    const value = row[column]
    if (column.includes('__')) {
      const [snakeTable, snakeColumn] = column.split('__')
      if (!otherTables[snakeTable]) otherTables[snakeTable] = {}
      otherTables[snakeTable][snakeColumn] = value
    } else {
      selfTable[column] = value
    }
  }

  selfTable = (orm[tableName] ?? orm.default)(selfTable)

  for (const otherTable in otherTables) {
    otherTables[otherTable] = (orm[otherTable] ?? orm.default)(otherTables[otherTable])
  }

  return { ...selfTable, ...otherTables } as any
}
