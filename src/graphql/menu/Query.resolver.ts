import { BucketType, QueryResolvers } from '../generated/graphql'
import { importSQL } from '../../utils/commons'
import { poolQuery } from '../../database/postgres'
import { spliceSQL } from '../../utils/ORM'
import { buildBasicMenuQuery, encodeCategory, menuORM } from './ORM'
import { UserInputError } from 'apollo-server-express'
import type { ApolloContext } from 'src/apollo/server'

const byCategory = importSQL(__dirname, 'sql/byCategory.sql')
const byId = importSQL(__dirname, 'sql/byId.sql')
const byMenuBucketId = importSQL(__dirname, 'sql/byMenuBucketId.sql')
const byName = importSQL(__dirname, 'sql/byName.sql')
const byStoreId = importSQL(__dirname, 'sql/byStoreId.sql')
const joinMenuBucketOnMenuBucketId = importSQL(__dirname, 'sql/joinMenuBucketOnMenuBucketId.sql')
const joinStoreOnTown = importSQL(__dirname, 'sql/joinStoreOnTown.sql')
const joinStoreOnTownAndCategory = importSQL(__dirname, 'sql/joinStoreOnTownAndCategory.sql')
const onTown = importSQL(__dirname, 'sql/onTown.sql')
const onTownAndCategory = importSQL(__dirname, 'sql/onTownAndCategory.sql')
const verifyUserBucket = importSQL(__dirname, 'sql/verifyUserBucket.sql')

export const Query: QueryResolvers<ApolloContext> = {
  menu: async (_, { id }, { user }, info) => {
    let [sql, columns, values] = await buildBasicMenuQuery(info, user)

    sql = spliceSQL(sql, await byId, 'GROUP BY')
    values.push(id)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return menuORM(rows, columns)[0]
  },

  menuByName: async (_, { storeId, name }, { user }, info) => {
    let [sql, columns, values] = await buildBasicMenuQuery(info, user)

    sql = spliceSQL(sql, await byName, 'GROUP BY')
    values.push(storeId, name)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return menuORM(rows, columns)[0]
  },

  menusByTownAndCategory: async (_, { town, category }, { user }, info) => {
    let encodedCategory

    if (category) {
      encodedCategory = encodeCategory(category)

      if (encodedCategory === null) throw new UserInputError('Invalid category value')
    }

    let [sql, columns, values] = await buildBasicMenuQuery(info, user)

    if (town && category) {
      if (sql.includes('JOIN store')) {
        sql = spliceSQL(
          sql,
          await onTownAndCategory,
          'JOIN store ON store.id = menu.store_id',
          true
        )
      } else {
        sql = spliceSQL(sql, await joinStoreOnTownAndCategory, 'JOIN')
      }

      values.push(town, encodedCategory)
    }
    //
    else if (town) {
      if (sql.includes('JOIN store')) {
        sql = spliceSQL(sql, await onTown, 'JOIN store ON store.id = menu.store_id', true)
      } else {
        sql = spliceSQL(sql, await joinStoreOnTown, 'JOIN')
      }

      values.push(town)
    }
    //
    else if (category) {
      sql = spliceSQL(sql, await byCategory, 'GROUP BY')
      values.push(encodedCategory)
    }

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return menuORM(rows, columns)
  },

  menusByStore: async (_, { storeId }, { user }, info) => {
    let [sql, columns, values] = await buildBasicMenuQuery(info, user)

    sql = spliceSQL(sql, await byStoreId, 'GROUP BY')
    values.push(storeId)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return menuORM(rows, columns)
  },

  menusInBucket: async (_, { bucketId, userUniqueName }, { user }, info) => {
    const response = await poolQuery(await verifyUserBucket, [bucketId, userUniqueName, user?.id])

    const result = response.rows[0].verify_user_bucket

    if (result === '1') throw new UserInputError('입력한 버킷 ID가 존재하지 않습니다.')
    if (result === '2') throw new UserInputError('입력한 버킷이 메뉴 버킷이 아닙니다.')
    if (result === '3')
      throw new UserInputError('해당 사용자가 해당 버킷을 소유하고 있지 않습니다.')

    const publicBucketOnly = result === '4' // TODO: 공개/비공개 버킷을 적절히 구분해서 응답

    let [sql, columns, values] = await buildBasicMenuQuery(info, user)

    if (sql.includes('LEFT JOIN bucket')) {
      sql = spliceSQL(sql, await byMenuBucketId, 'GROUP BY')
    } else {
      sql = spliceSQL(sql, await joinMenuBucketOnMenuBucketId, 'GROUP BY')
    }

    values.push(bucketId)

    const { rowCount, rows } = await poolQuery({ text: sql, values, rowMode: 'array' })

    if (rowCount === 0) return null

    return menuORM(rows, columns)
  },
}
