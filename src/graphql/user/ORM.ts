import type { user } from 'src/database/sobok'
import type { User } from 'src/graphql/generated/graphql'
import { Gender, Provider } from '../generated/graphql'
import { camelToSnake, snakeKeyToCamelKey } from '../../utils/commons'

export function userFieldColumnMapping(userField: keyof User) {
  switch (userField) {
    case 'providers':
      return ['google_oauth', 'naver_oauth', 'kakao_oauth']
    default:
      return camelToSnake(userField)
  }
}

export function userORM(user: user): any {
  return {
    ...snakeKeyToCamelKey(user),
    providers: decodeProviders(user),
    gender: decodeGender(user),
  }
}

function decodeProviders(user: user) {
  const providers = []

  if (user.google_oauth) providers.push(Provider.Google)
  if (user.naver_oauth) providers.push(Provider.Naver)
  if (user.kakao_oauth) providers.push(Provider.Kakao)
  if (providers.length === 0) providers.push(Provider.Sobok)

  return providers
}

export function encodeGender(gender: Gender) {
  switch (gender) {
    case Gender.Other:
      return 0
    case Gender.Male:
      return 1
    case Gender.Female:
      return 2
    default:
      return null
  }
}

function decodeGender(user: user) {
  switch (user.gender) {
    case 0:
      return Gender.Other
    case 1:
      return Gender.Male
    case 2:
      return Gender.Female
    default:
      return null
  }
}
