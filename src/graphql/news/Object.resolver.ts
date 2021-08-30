import graphqlFields from 'graphql-fields'
import format from 'pg-format'
import { poolQuery } from 'src/database/postgres'
import type { NewsResolvers } from 'src/graphql/generated/graphql'
import { serializeSQLParameters } from 'src/utils/ORM'
import { isThereIntersection } from '../../utils/commons'
import { storeFieldsFetchedFromOtherTable } from '../store/ORM'
import { decodeCategory } from './ORM'

export const News: NewsResolvers = {
  category: ({ category }) => {
    return decodeCategory(category)
  },

  isLiked: ({ isLiked }) => {
    return !!isLiked
  },

  store: async ({ store }, __, { user }, info) => {
    // const storeFields = Object.keys(graphqlFields(info))

    // if (!isThereIntersection(new Set(storeFields), storeFieldsFetchedFromOtherTable)) {
    return store
    // }

    // const [sql, columns, values] = await buildBasicStoreQuery(info, user, false)

    // const { rows } = await poolQuery({
    //   text: format(serializeSQLParameters(sql), columns),
    //   values,
    //   rowMode: 'array',
    // })

    // const newStore = storeORMv2(rows, columns)

    // return { ...store, ...newStore }
  },
}
