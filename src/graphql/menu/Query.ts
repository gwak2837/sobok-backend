import { UserInputError } from 'apollo-server-errors'

import { NotFoundError } from '../../apollo/errors'
import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { applyPaginationAndSorting, buildSQL, validatePaginationAndSorting } from '../../utils/sql'
import { graphqlRelationMapping } from '../common/ORM'
import { QueryResolvers } from '../generated/graphql'
import { validateMenuCategory } from './ORM'
import menu from './sql/menu.sql'
import menuByName from './sql/menuByName.sql'
import menusByStore from './sql/menusByStore.sql'
import menusByTownAndCategory from './sql/menusByTownAndCategory.sql'
import menusInBucket from './sql/menusInBucket.sql'
import searchMenus from './sql/searchMenus.sql'
import verifyUserBucket from './sql/verifyUserBucket.sql'
import whereCategory from './sql/whereCategory.sql'
import whereTown from './sql/whereTown.sql'
import whereTownAndCategory from './sql/whereTownAndCategory.sql'

export const MenuOrderBy = {
  NAME: 'name',
  PRICE: 'price',
}

export const Query: QueryResolvers<ApolloContext> = {
  menu: async (_, { id }, { userId }) => {
    let sql = menu
    const values = [userId, id]

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당 id의 메뉴를 찾을 수 없습니다.')

    return graphqlRelationMapping(rows[0], 'menu')
  },

  menuByName: async (_, { storeId, name }, { userId }) => {
    let sql = menuByName
    const values = [userId, storeId, name]

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당 이름의 메뉴를 찾을 수 없습니다.')

    return graphqlRelationMapping(rows[0], 'menu')
  },

  menusByStore: async (_, { storeId }, { userId }) => {
    let sql = menusByStore
    const values = [userId, storeId]

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0)
      throw new NotFoundError('storeId의 매장이 없거나 해당 매장에 메뉴가 존재하지 않습니다.')

    return rows.map((row) => graphqlRelationMapping(row, 'menu'))
  },

  menusByTownAndCategory: async (_, { town, category, order, pagination }, { userId }) => {
    const encodedCategory = validateMenuCategory(category)
    validatePaginationAndSorting(order, pagination)

    let sql = menusByTownAndCategory
    const values: unknown[] = [userId]

    if (town && category) {
      sql = buildSQL(sql, 'WHERE', whereTownAndCategory)
      values.push(town, encodedCategory)
    } else if (town) {
      sql = buildSQL(sql, 'WHERE', whereTown)
      values.push(town)
    } else if (category) {
      sql = buildSQL(sql, 'WHERE', whereCategory)
      values.push(encodedCategory)
    }

    sql = applyPaginationAndSorting(sql, values, 'menu', order, pagination)

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당하는 메뉴를 찾을 수 없습니다.')

    return rows.map((row) => graphqlRelationMapping(row, 'menu'))
  },

  menusInBucket: async (_, { bucketId, userUniqueName }, { userId }) => {
    const response = await poolQuery(verifyUserBucket, [bucketId, userUniqueName, userId])

    const result = response.rows[0].verify_user_bucket

    if (result === '1') throw new UserInputError('입력한 버킷 ID가 존재하지 않습니다.')
    if (result === '2') throw new UserInputError('입력한 버킷이 메뉴 버킷이 아닙니다.')
    if (result === '3')
      throw new UserInputError('해당 사용자가 해당 버킷을 소유하고 있지 않습니다.')

    const publicBucketOnly = result === '4' // TODO: 공개/비공개 버킷을 적절히 구분해서 응답

    let sql = menusInBucket
    const values: unknown[] = [userId, bucketId]

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당 id의 버킷에 메뉴가 존재하지 않습니다.')

    return rows.map((row) => graphqlRelationMapping(row, 'menu'))
  },

  searchMenus: async (_, { hashtags, order, pagination }, { userId }) => {
    if (hashtags.length === 0) throw new UserInputError('hashtags 배열은 비어있을 수 없습니다.')
    validatePaginationAndSorting(order, pagination)

    let sql = searchMenus
    const values = [userId, hashtags]

    sql = applyPaginationAndSorting(sql, values, 'menu', order, pagination)

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당 hashtags가 포함된 메뉴를 찾을 수 없습니다.')

    return rows.map((row) => graphqlRelationMapping(row, 'menu'))
  },
}
