import { AuthenticationError } from 'apollo-server-express'
import format from 'pg-format'
import { QueryResolvers } from 'src/graphql/generated/graphql'
import { selectColumnFromField } from '../../utils/ORM'
import { poolQuery } from '../../database/postgres'
import { importSQL } from '../../utils/commons'
import { userFieldColumnMapping, userORM } from './ORM'

const userSQL = importSQL(__dirname, 'sql/user.sql')
const verifyUniqueEmail = importSQL(__dirname, 'sql/verifyUniqueEmail.sql')

export const Query: QueryResolvers = {
  me: async (_, __, { user }, info) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    const columns = selectColumnFromField(info, userFieldColumnMapping)

    const { rows } = await poolQuery(format(await userSQL, columns), [user.id])

    return userORM(rows[0])
  },

  verifyUniqueEmail: async (_, { email }) => {
    const { rowCount } = await poolQuery(await verifyUniqueEmail, [email])

    return rowCount === 0
  },
}
