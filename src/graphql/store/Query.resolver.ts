import format from 'pg-format'
import { QueryResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { selectColumnFromField } from '../../utils/ORM'
import { storeFieldColumnMapping, storeORM } from './ORM'

const storesByTown = importSQL(__dirname, 'sql/storesByTown.sql')

export const Query: QueryResolvers = {
  storesByTown: async (_, __, ___, info) => {
    const columns = selectColumnFromField(info, storeFieldColumnMapping)

    const { rows } = await poolQuery(format(await storesByTown, columns))

    return rows.map((row) => storeORM(row))
  },
}
