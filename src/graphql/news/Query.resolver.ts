import type { QueryResolvers } from 'src/graphql/generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { encodeCategory, buildBasicNewsQuery, newsORM } from './ORM'
import { AuthenticationError, UserInputError } from 'apollo-server-express'

const byId = importSQL(__dirname, 'sql/byId.sql')
const byStoreId = importSQL(__dirname, 'sql/byStoreId.sql')
const byStoreIdAndCategories = importSQL(__dirname, 'sql/byStoreIdAndCategories.sql')
const joinLikedStore = importSQL(__dirname, 'sql/joinLikedStore.sql')

export const Query: QueryResolvers = {
  news: async (_, { id }, { user }, info) => {
    let [sql, columns, values] = await buildBasicNewsQuery(info, user)

    sql = `${sql} ${await byId}`
    values.push(id)

    const { rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    return newsORM(rows, columns)[0]
  },

  newsByAllStores: async (_, __, { user }, info) => {
    const [sql, columns, values] = await buildBasicNewsQuery(info, user)

    const { rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    return newsORM(rows, columns)
  },

  newsByOneStore: async (_, { storeId, categories }, { user }, info) => {
    let encodedCategories

    if (categories) {
      if (categories?.length === 0) throw new UserInputError('Invalid categories value')

      encodedCategories = categories.map((category) => encodeCategory(category))

      if (encodedCategories.some((encodeCategory) => encodeCategory === null))
        throw new UserInputError('Invalid categories value')
    }

    let [sql, columns, values] = await buildBasicNewsQuery(info, user)

    if (categories) {
      sql = `${sql} ${await byStoreIdAndCategories}`
      values.push(storeId, encodedCategories)
    } else {
      sql = `${sql} ${await byStoreId}`
      values.push(storeId)
    }

    const { rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    return newsORM(rows, columns)
  },

  newsByLikedStores: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    let [sql, columns, values] = await buildBasicNewsQuery(info, user)

    sql = `${sql} ${await joinLikedStore}`
    values.push(user.id)

    const { rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    return newsORM(rows, columns)
  },
}
