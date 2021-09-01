import format from 'pg-format'
import type { StoreResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'

const hashtags = importSQL(__dirname, 'sql/hashtags.sql')
const isLiked = importSQL(__dirname, 'sql/isLiked.sql')

export const Store: StoreResolvers = {
  hashtags: async ({ id }, __) => {
    const { rows } = await poolQuery(await hashtags, [id])

    return rows.map((row) => row.name)
  },

  isLiked: async ({ id }, __, { user }) => {
    if (user === null) return false

    const { rowCount } = await poolQuery(await isLiked, [user.id, id])

    return rowCount === 1
  },
}
