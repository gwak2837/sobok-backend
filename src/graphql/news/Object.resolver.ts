import format from 'pg-format'
import type { NewsResolvers } from 'src/graphql/generated/graphql'
import type { store as Store } from 'src/database/sobok'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { selectColumnFromField } from '../../utils/ORM'
import { storeFieldColumnMapping, storeORM } from '../store/ORM'

const isLiked = importSQL(__dirname, 'sql/isLiked.sql')
const store = importSQL(__dirname, 'sql/store.sql')

export const News: NewsResolvers = {
  isLiked: async ({ id, isLiked: isLikedFromParent }, __, { user }) => {
    if (isLikedFromParent) return isLikedFromParent

    if (user === null) return false

    const { rowCount } = await poolQuery(await isLiked, [user.id, id])

    return rowCount === 1
  },

  store: async ({ storeId, store: storeFromParent }, __, ___, info) => {
    if (storeFromParent) return storeFromParent

    const columns = selectColumnFromField(info, storeFieldColumnMapping)

    const { rows } = await poolQuery<Store>(format(await store, columns), [storeId])

    return storeORM(rows[0])
  },
}
