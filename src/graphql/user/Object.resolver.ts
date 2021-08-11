import format from 'pg-format'
import { poolQuery } from '../../database/postgres'
import { UserResolvers } from '../generated/graphql'
import { storeFieldColumnMapping, storeORM } from '../store/ORM'
import { importSQL, removeDoubleQuotesAround } from '../../utils/commons'
import { selectColumnFromField } from '../../utils/ORM'

const userFavoriteStores = importSQL(__dirname, 'sql/userFavoriteStores.sql')

export const User: UserResolvers = {
  favoriteStores: async ({ id }, _, __, info) => {
    const columns = selectColumnFromField(info, storeFieldColumnMapping).map((column) =>
      column === 'user_id' ? 'store.user_id' : column
    )

    const formattedSQL = removeDoubleQuotesAround(
      ['store.user_id'],
      format(await userFavoriteStores, columns)
    )

    const { rows } = await poolQuery(formattedSQL, [id])

    return rows.map((row) => storeORM(row))
  },
}
