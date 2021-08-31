import format from 'pg-format'
import type { MenuResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { selectColumnFromField } from '../../utils/ORM'
import { storeFieldColumnMapping, storeORM } from '../store/ORM'

const hashtags = importSQL(__dirname, 'sql/hashtags.sql')
const isLiked = importSQL(__dirname, 'sql/isLiked.sql')
const store = importSQL(__dirname, 'sql/store.sql')

export const Menu: MenuResolvers = {
  hashtags: async ({ id }, __) => {
    const { rows } = await poolQuery(await hashtags, [id])

    return rows.map((row) => row.name)
  },

  isLiked: async ({ id }, __, { user }) => {
    if (user === null) return false

    const { rowCount } = await poolQuery(await isLiked, [user.id, id])

    return rowCount === 1
  },

  store: async ({ storeId }, __, ___, info) => {
    const columns = selectColumnFromField(info, storeFieldColumnMapping)

    const { rows } = await poolQuery(format(await store, columns), [storeId])

    return storeORM(rows[0])
  },
}
