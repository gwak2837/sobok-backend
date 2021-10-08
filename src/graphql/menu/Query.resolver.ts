import { UserInputError } from 'apollo-server-express'

import type { ApolloContext } from '../../apollo/server'
import { poolQuery } from '../../database/postgres'
import { spliceSQL } from '../../utils/ORM'
import type { QueryResolvers } from '../generated/graphql'
import { buildBasicMenuQuery, encodeCategory, menuORM } from './ORM'
import byCategory from './sql/byCategory.sql'
import byId from './sql/byId.sql'
import byMenuBucketId from './sql/byMenuBucketId.sql'
import byName from './sql/byName.sql'
import byStoreId from './sql/byStoreId.sql'
import joinHashtag from './sql/joinHashtag.sql'
import joinMenuBucketOnMenuBucketId from './sql/joinMenuBucketOnMenuBucketId.sql'
import joinStoreOnTown from './sql/joinStoreOnTown.sql'
import joinStoreOnTownAndCategory from './sql/joinStoreOnTownAndCategory.sql'
import onHashtagName from './sql/onHashtagName.sql'
import onTown from './sql/onTown.sql'
import onTownAndCategory from './sql/onTownAndCategory.sql'
import verifyUserBucket from './sql/verifyUserBucket.sql'

const joinHashtagShort = 'JOIN hashtag ON hashtag.id = menu_x_hashtag.hashtag_id'

export const MenuOrder = {
  NAME: 0,
  NAME_DESC: 1,
}

export const Query: QueryResolvers<ApolloContext> = {
  menu: async (_, { id }, { userId }, info) => {
    let [sql, columns, values] = await buildBasicMenuQuery(info, userId)

    sql = spliceSQL(sql, byId, 'GROUP BY')
    values.push(id)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return menuORM(rows, columns)[0]
  },

  menuByName: async (_, { storeId, name }, { userId }, info) => {
    let [sql, columns, values] = await buildBasicMenuQuery(info, userId)

    sql = spliceSQL(sql, byName, 'GROUP BY')
    values.push(storeId, name)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return menuORM(rows, columns)[0]
  },

  menusByTownAndCategory: async (_, { town, category }, { userId }, info) => {
    let encodedCategory

    if (category) {
      encodedCategory = encodeCategory(category)

      if (encodedCategory === null) throw new UserInputError('Invalid category value')
    }

    let [sql, columns, values] = await buildBasicMenuQuery(info, userId)

    if (town && category) {
      if (sql.includes('JOIN store')) {
        sql = spliceSQL(
          sql,
          await onTownAndCategory,
          'JOIN store ON store.id = menu.store_id',
          true
        )
      } else {
        sql = spliceSQL(sql, joinStoreOnTownAndCategory, 'JOIN')
      }

      values.push(town, encodedCategory)
    }
    //
    else if (town) {
      if (sql.includes('JOIN store')) {
        sql = spliceSQL(sql, onTown, 'JOIN store ON store.id = menu.store_id', true)
      } else {
        sql = spliceSQL(sql, joinStoreOnTown, 'JOIN')
      }

      values.push(town)
    }
    //
    else if (category) {
      sql = spliceSQL(sql, byCategory, 'GROUP BY')
      values.push(encodedCategory)
    }

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return menuORM(rows, columns)
  },

  menusByStore: async (_, { storeId }, { userId }, info) => {
    let [sql, columns, values] = await buildBasicMenuQuery(info, userId)

    sql = spliceSQL(sql, byStoreId, 'GROUP BY')
    values.push(storeId)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return menuORM(rows, columns)
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
      sql = spliceSQL(sql, byMenuBucketId, 'GROUP BY')
    } else {
      sql = spliceSQL(sql, joinMenuBucketOnMenuBucketId, 'GROUP BY')
    }

    values.push(bucketId)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return menuORM(rows, columns)
  },

  searchMenus: async (_, { hashtags, order, pagination }, { userId }, info) => {
    if (hashtags.length === 0) throw new UserInputError('해시태그 배열은 비어있을 수 없습니다.')
    if ((pagination.endValue && !pagination.endId) || (!pagination.endValue && pagination.endId))
      throw new UserInputError('Pagination의 endValue와 endId를 모두 입력해주세요.')

    let [sql, columns, values] = await buildBasicMenuQuery(info, userId)

    if (sql.includes(joinHashtagShort)) {
      sql = spliceSQL(sql, onHashtagName, joinHashtagShort, true)
    } else {
      sql = spliceSQL(sql, `${joinHashtag} ${onHashtagName}`, 'GROUP BY')
    }

    values.push(hashtags)

    if (pagination.endValue && pagination.endId) {
      if (sql.includes('WHERE')) {
        sql = spliceSQL(sql, `(, id) < ($1, $2)`, 'WHERE', true)
      } else {
        sql = spliceSQL(sql, `WHERE (, id) < ($1, $2)`, 'GROUP BY')
      }
    }

    values.push(pagination.endValue, pagination.endId)

    let a = 'ORDER BY created_on DESC, id DESC'

    sql = `${sql} FETCH FIRST ${pagination.limit} ROWS ONLY`

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return menuORM(rows, columns)
  },
}
