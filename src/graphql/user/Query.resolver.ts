import { AuthenticationError } from 'apollo-server-express'
import format from 'pg-format'
import { QueryResolvers } from 'src/graphql/generated/graphql'
import { selectColumnFromField } from '../../utils/ORM'
import { poolQuery } from '../../database/postgres'
import { importSQL } from '../../utils/commons'
import { userFieldColumnMapping, userORM } from './ORM'

const me = importSQL(__dirname, 'sql/me.sql')
const isEmailUnique = importSQL(__dirname, 'sql/isEmailUnique.sql')
const isUniqueNameUnique = importSQL(__dirname, 'sql/isUniqueNameUnique.sql')

export const Query: QueryResolvers = {
  me: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    // 사용자 정보는 레디스 캐시에 넣어 두기

    const columns = selectColumnFromField(info, userFieldColumnMapping)

    const { rows } = await poolQuery(format(await me, columns), [user.id])

    return userORM(rows[0])
  },

  isEmailUnique: async (_, { email }) => {
    const { rowCount } = await poolQuery(await isEmailUnique, [email])

    return rowCount === 0
  },

  isUniqueNameUnique: async (_, { uniqueName }) => {
    const { rowCount } = await poolQuery(await isUniqueNameUnique, [uniqueName])

    return rowCount === 0
  },
}
