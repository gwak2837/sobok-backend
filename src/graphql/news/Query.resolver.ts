import { AuthenticationError, UserInputError } from 'apollo-server-express'
import type { ApolloContext } from 'src/apollo/server'
import { NewsOptions, QueryResolvers } from '../../graphql/generated/graphql'
import { encodeCategory, buildBasicNewsQuery, newsORM } from './ORM'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { spliceSQL } from '../../utils/ORM'

const byId = importSQL(__dirname, 'sql/byId.sql')
const byStoreId = importSQL(__dirname, 'sql/byStoreId.sql')
const byStoreIdAndCategories = importSQL(__dirname, 'sql/byStoreIdAndCategories.sql')
const joinLikedStore = importSQL(__dirname, 'sql/joinLikedStore.sql')
const joinStoreOnTown = importSQL(__dirname, 'sql/joinStoreOnTown.sql')

export const Query: QueryResolvers<ApolloContext> = {
  news: async (_, { id }, { user }, info) => {
    let [sql, columns, values] = await buildBasicNewsQuery(info, user)

    const i = sql.indexOf('GROUP BY')
    const groupbyIndex = i !== -1 ? i : null

    sql = spliceSQL(sql, await byId, groupbyIndex ?? sql.length)
    values.push(id)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return newsORM(rows, columns)[0]
  },

  newsListByStore: async (_, { storeId, categories }, { user }, info) => {
    let encodedCategories

    if (categories) {
      if (categories?.length === 0) throw new UserInputError('Invalid categories value')

      encodedCategories = categories.map((category) => encodeCategory(category))

      if (encodedCategories.some((encodeCategory) => encodeCategory === null))
        throw new UserInputError('Invalid categories value')
    }

    let [sql, columns, values] = await buildBasicNewsQuery(info, user)

    const i = sql.indexOf('GROUP BY')
    const groupbyIndex = i !== -1 ? i : null

    if (categories) {
      sql = spliceSQL(sql, await byStoreIdAndCategories, groupbyIndex ?? sql.length)
      values.push(storeId, encodedCategories)
    } else {
      sql = spliceSQL(sql, await byStoreId, groupbyIndex ?? sql.length)
      values.push(storeId)
    }

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return newsORM(rows, columns)
  },

  newsListByTown: async (_, { town, option }, { user }, info) => {
    let [sql, columns, values] = await buildBasicNewsQuery(info, user)

    const i = sql.indexOf('WHERE')
    const whereIndex = i !== -1 ? i : null

    if (town) {
      sql = spliceSQL(sql, await joinStoreOnTown, whereIndex ?? sql.length)
      values.push(town)
    }

    if (option === NewsOptions.LikedStore) {
      if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

      sql = spliceSQL(sql, await joinLikedStore, whereIndex ?? sql.length)
      values.push(user.id)
    }

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return newsORM(rows, columns)
  },
}
