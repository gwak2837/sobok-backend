import type { user } from 'src/database/sobok'
import type { User } from 'src/graphql/generated/graphql'
import { Provider } from '../generated/graphql'
import { camelToSnake, snakeKeyToCamelKey } from '../../utils/commons'

export function userFieldColumnMapping(userField: keyof User) {
  switch (userField) {
    case 'providers':
      return ['google_oauth', 'naver_oauth', 'kakao_oauth']
    case 'comments':
      return ''
    case 'feed':
      return ''
    case 'followings':
      return ''
    case 'followers':
      return ''
    case 'likedComments':
      return ''
    case 'likedFeed':
      return ''
    case 'likedMenus':
      return ''
    case 'likedNews':
      return ''
    case 'likedStores':
      return ''
    case 'likedTrends':
      return ''
    case 'menuBuckets':
      return ''
    case 'storeBuckets':
      return ''
    default:
      return ['"user".id', `"user".${camelToSnake(userField)}`]
  }
}

export function userORM(user: Partial<user>): any {
  return {
    ...snakeKeyToCamelKey(user),
    providers: decodeProviders(user),
  }
}

function decodeProviders(user: Partial<user>) {
  const providers = []

  if (user.google_oauth) providers.push(Provider.Google)
  if (user.naver_oauth) providers.push(Provider.Naver)
  if (user.kakao_oauth) providers.push(Provider.Kakao)
  if (providers.length === 0) providers.push(Provider.Sobok)

  return providers
}
