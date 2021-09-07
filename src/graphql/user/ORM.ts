import type { user as DatabaseUser } from 'src/database/sobok'
import type { User } from 'src/graphql/generated/graphql'
import { Provider } from '../generated/graphql'
import { camelToSnake, snakeKeyToCamelKey } from '../../utils/commons'

const userFieldsFromOtherTable = new Set([
  'comments',
  'feed',
  'followings',
  'followers',
  'likedComments',
  'likedFeed',
  'likedMenus',
  'likedNews',
  'likedStores',
  'likedTrends',
  'menuBuckets',
  'storeBuckets',
])

const privateUserField = new Set([
  'creationTime',
  'modificationTime',
  'email',
  'name',
  'phone',
  'isEmailVerified',
  'providers',
])

export function userFieldColumnMapping(userField: keyof User) {
  if (userField === 'providers') {
    return ['"user".id', '"user".google_oauth', '"user".naver_oauth', '"user".kakao_oauth']
  }
  //
  else if (userFieldsFromOtherTable.has(userField)) {
    return '"user".id'
  }
  //
  else if (privateUserField.has(userField)) {
    return ['"user".id', `"user".${camelToSnake(userField)}`]
  }

  return `"user".${camelToSnake(userField)}`
}

export function userORM(user: Partial<DatabaseUser>): any {
  return {
    ...snakeKeyToCamelKey(user),
    providers: decodeProviders(user),
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
