import type { user as DatabaseUser } from '../../database/sobok'
import { camelToSnake } from '../../utils'
import type { User as GraphQLUser } from '../generated/graphql'
import { Provider } from '../generated/graphql'

// GraphQL fields -> Database columns
export function userFieldColumnMapping(userField: keyof GraphQLUser) {
  switch (userField) {
    // private field
    case 'creationTime':
    case 'modificationTime':
    case 'email':
    case 'name':
    case 'phone':
    case 'isEmailVerified':
      return ['"user".id', `"user".${camelToSnake(userField)}`]
    case 'followerCount':
    case 'followingCount':
      return '"user".id'
    // graphql only field
    case 'providers':
      return ['"user".id', '"user".google_oauth', '"user".naver_oauth', '"user".kakao_oauth']
    default:
      return `"user".${camelToSnake(userField)}`
  }
}

export function decodeProviders(user: Partial<DatabaseUser>) {
  const providers = []

  if (user.google_oauth) providers.push(Provider.Google)
  if (user.naver_oauth) providers.push(Provider.Naver)
  if (user.kakao_oauth) providers.push(Provider.Kakao)
  if (providers.length === 0) providers.push(Provider.Sobok)

  return providers
}
