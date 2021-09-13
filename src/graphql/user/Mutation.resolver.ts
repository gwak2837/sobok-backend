import { AuthenticationError, ForbiddenError, UserInputError } from 'apollo-server-express'
import { compare, genSalt, hash } from 'bcryptjs'
import { MutationResolvers } from 'src/graphql/generated/graphql'
import { generateJWT } from '../../utils/jwt'
import { poolQuery } from '../../database/postgres'
import { emailRegEx, importSQL } from '../../utils/commons'
import type { ApolloContext } from 'src/apollo/server'

const login = importSQL(__dirname, 'sql/login.sql')
const logout = importSQL(__dirname, 'sql/logout.sql')
const register = importSQL(__dirname, 'sql/register.sql')
const unregister = importSQL(__dirname, 'sql/unregister.sql')

export const Mutation: MutationResolvers<ApolloContext> = {
  login: async (_, { uniqueNameOrEmail, passwordHash }, { user }) => {
    if (user) throw new ForbiddenError('이미 로그인되어 있습니다. 로그아웃 후 시도해주세요.')

    const { rowCount, rows } = await poolQuery(await login, [uniqueNameOrEmail])

    if (rowCount === 0)
      throw new AuthenticationError('로그인에 실패했어요. 이메일 또는 비밀번호를 확인해주세요.')

    const authenticationSuceed = await compare(passwordHash, rows[0].password_hash)

    if (!authenticationSuceed)
      throw new AuthenticationError('로그인에 실패했어요. 이메일 또는 비밀번호를 확인해주세요.')

    return { userUniqueName: rows[0].unique_name, jwt: await generateJWT({ userId: rows[0].id }) }
  },

  logout: async (_, __, { user }) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    await poolQuery(await logout, [user.id])

    return true
  },

  register: async (_, { input }, { user }) => {
    if (user) throw new ForbiddenError('이미 로그인되어 있습니다. 로그아웃 후 시도해주세요.')

    if (emailRegEx.test(input.uniqueName))
      throw new UserInputError('고유 이름은 이메일 형식이 될 수 없습니다.')

    const passwordHashWithSalt = await hash(input.passwordHash, await genSalt())

    const registerValues = [
      input.uniqueName,
      input.email,
      passwordHashWithSalt,
      input.name,
      input.phone,
      input.gender,
      input.bio,
      input.birth,
      input.imageUrl,
    ]

    const { rows } = await poolQuery(await register, registerValues)

    const [userId, userUniqueName] = rows[0].create_user

    if (!userId) throw new UserInputError('이미 존재하는 이메일 또는 고유 이름입니다.')

    return { userUniqueName, jwt: await generateJWT({ userId }) }
  },

  unregister: async (_, __, { user }) => {
    if (!user) throw new AuthenticationError('로그인되어 있지 않습니다. 로그인 후 시도해주세요.')

    await poolQuery(await unregister, [user.id])

    return true
  },
}
