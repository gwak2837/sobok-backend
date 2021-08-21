import { Provider, User } from '../generated/graphql'
import { camelToSnake, snakeKeyToCamelKey } from '../../utils/commons'

export function userFieldColumnMapping(userField: keyof User) {
  switch (userField) {
    case 'providers':
      return ['google_oauth', 'naver_oauth', 'kakao_oauth']
    default:
      return camelToSnake(userField)
  }
}

export function userORM(user: Record<string, any>): any {
  return {
    ...snakeKeyToCamelKey(user),
    providers: getProviders(user),
  }
}

function getProviders(user: Record<string, any>) {
  const providers = []

  if (user.google_oauth) providers.push(Provider.Google)
  if (user.naver_oauth) providers.push(Provider.Naver)
  if (user.kakao_oauth) providers.push(Provider.Kakao)
  if (providers.length === 0) providers.push(Provider.Sobok)

  return providers
}
