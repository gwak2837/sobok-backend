import { UserInputError } from 'apollo-server-express'

import { NotFoundError } from '../../apollo/errors'
import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { applyPaginationAndSorting, buildSQL, spliceSQL } from '../../utils/ORM'
import { QueryResolvers } from '../generated/graphql'
import { buildBasicMenuQuery, menuORM, validateMenuCategory } from './ORM'
import joinHashtag from './sql/joinHashtag.sql'
import joinMenuBucketOnMenuBucketId from './sql/joinMenuBucketOnMenuBucketId.sql'
import menusByTownAndCategory from './sql/menusByTownAndCategory.sql'
import verifyUserBucket from './sql/verifyUserBucket.sql'
import whereCategory from './sql/whereCategory.sql'
import whereTown from './sql/whereTown.sql'
import whereTownAndCategory from './sql/whereTownAndCategory.sql'

const joinHashtagShort = 'JOIN hashtag ON hashtag.id = menu_x_hashtag.hashtag_id'

export const MenuOrderBy = {
  NAME: 'name',
  PRICE: 'price',
}

export const Query: QueryResolvers<ApolloContext> = {
  menu: async (_, { id }, { userId }, info) => {
    let [sql, columns, values] = await buildBasicMenuQuery(info, userId)

    sql = buildSQL(sql, 'WHERE', 'menu.id = $1')
    values.push(id)

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당 id의 매장을 찾을 수 없습니다.')

    return menuORM(rows[0])
  },

  menuByName: async (_, { storeId, name }, { userId }, info) => {
    let [sql, columns, values] = await buildBasicMenuQuery(info, userId)

    sql = buildSQL(sql, 'WHERE', 'menu.store_id = $1 AND menu.name = $2')
    values.push(storeId, name)

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당 id의 매장을 찾을 수 없습니다.')

    return menuORM(rows[0])
  },

  menusByTownAndCategory: async (_, { town, category }, { userId }) => {
    const encodedCategory = validateMenuCategory(category)

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

    const { rowCount, rows } = await poolQuery(sql, values)
    if (rowCount === 0) throw new NotFoundError('해당 id의 매장을 찾을 수 없습니다.')

    return rows.map((row) => menuORM(row))
  },

  menusByStore: async (_, { storeId }, { userId }, info) => {
    let [sql, columns, values] = await buildBasicMenuQuery(info, userId)

    sql = buildSQL(sql, 'WHERE', 'menu.store_id = $1')
    values.push(storeId)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })
    if (rowCount === 0) return null

    return rows.map((row) => menuORM(row))
  },

  menusInBucket: async (_, { bucketId, userUniqueName }, { userId }, info) => {
    const response = await poolQuery(verifyUserBucket, [bucketId, userUniqueName, userId])

    const result = response.rows[0].verify_user_bucket

    if (result === '1') throw new UserInputError('입력한 버킷 ID가 존재하지 않습니다.')
    if (result === '2') throw new UserInputError('입력한 버킷이 메뉴 버킷이 아닙니다.')
    if (result === '3')
      throw new UserInputError('해당 사용자가 해당 버킷을 소유하고 있지 않습니다.')

    const publicBucketOnly = result === '4' // TODO: 공개/비공개 버킷을 적절히 구분해서 응답

    let [sql, columns, values] = await buildBasicMenuQuery(info, userId)

    if (sql.includes('LEFT JOIN bucket')) {
      sql = buildSQL(sql, 'WHERE', 'bucket.type = 1 AND bucket.id = $1')
    } else {
      sql = buildSQL(sql, 'JOIN', joinMenuBucketOnMenuBucketId)
    }
    values.push(bucketId)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })
    if (rowCount === 0) return null

    return rows.map((row) => menuORM(row))
  },

  searchMenus: async (_, { hashtags, order, pagination }, { userId }, info) => {
    if (hashtags.length === 0) throw new UserInputError('hashtags 배열은 비어있을 수 없습니다.')
    if (order && !order.by && !order.direction)
      throw new UserInputError('order 객체는 비어있을 수 없습니다.')
    if (!pagination.lastId && pagination.lastValue)
      throw new UserInputError('pagination.lastId가 존재해야 합니다.')

    let [sql, columns, values] = await buildBasicMenuQuery(info, userId)

    if (sql.includes(joinHashtagShort)) {
      sql = spliceSQL(sql, 'AND hashtag.name = ANY($1)', joinHashtagShort, true)
    } else {
      sql = buildSQL(sql, 'JOIN', `${joinHashtag} AND hashtag.name = ANY($1)`)
    }
    values.push(hashtags)

    sql = applyPaginationAndSorting(sql, values, 'menu', order, pagination)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })
    if (rowCount === 0) return null

    return rows.map((row) => menuORM(row))
  },
}
