import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import { compare, genSalt, hash } from 'bcryptjs'
import { MutationResolvers } from 'src/graphql/generated/graphql'
import { generateJWT } from '../../utils/jwt'
import { poolQuery } from '../../database/postgres'
import { importSQL } from '../../utils/commons'
import { encodeGender } from './ORM'

const login = importSQL(__dirname, 'sql/login.sql')
const logout = importSQL(__dirname, 'sql/logout.sql')
const register = importSQL(__dirname, 'sql/register.sql')
const unregister = importSQL(__dirname, 'sql/unregister.sql')

export const Mutation: MutationResolvers = {
  login: async (_, { uniqueNameOrEmail, passwordHash }, { user }) => {
    if (user) throw new ForbiddenError('이미 로그인되어 있습니다. 로그아웃 후 시도해주세요.')

    const { rowCount, rows } = await poolQuery(await login, [uniqueNameOrEmail])

    if (rowCount === 0)
      throw new AuthenticationError('로그인에 실패했어요. 이메일 또는 비밀번호를 확인해주세요.')

    const authenticationSuceed = await compare(passwordHash, rows[0].password_hash)

    if (!authenticationSuceed)
      throw new AuthenticationError('로그인에 실패했어요. 이메일 또는 비밀번호를 확인해주세요.')

    return await generateJWT({ userId: rows[0].id, lastLoginDate: new Date() })
  },

  logout: async (_, __, { user }) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    await poolQuery(await logout, [user.id])

    return true
  },

  register: async (_, { input }, { user }) => {
    if (user) throw new ForbiddenError('이미 로그인되어 있습니다. 로그아웃 후 시도해주세요.')

    // 경고: uniqueName 를 다른 사람 이메일로 하면 로그인이 될 수 있음 -> 걸러줘야 함

    const passwordHashWithSalt = await hash(input.passwordHash, await genSalt())

    const registerValues = [
      input.uniqueName,
      input.email,
      passwordHashWithSalt,
      input.name,
      input.phone,
      encodeGender(input.gender),
      input.bio,
      input.birth,
      input.imageUrl,
    ]

    const { rows } = await poolQuery(await register, registerValues)

    return await generateJWT({ userId: rows[0].id, lastLoginDate: new Date() })
  },

  unregister: async (_, __, { user }) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    await poolQuery(await unregister, [user.id])

    return true
  },
}
