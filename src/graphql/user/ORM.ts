import { Gender, Provider, User } from '../generated/graphql'
import { camelToSnake } from '../../utils/commons'

export const user: User = {
  id: '',
  creationTime: '',
  modificationTime: '',
  uniqueName: '',
  email: '',
  name: '',
  phone: '',
  gender: Gender.Other,
  isEmailVerified: false,
  isStarUser: false,
  providers: [Provider.Sobok],
}

export function userFieldColumnMapping(userField: keyof User) {
  switch (userField) {
    case 'providers':
      return ['google_oauth', 'naver_oauth', 'kakao_oauth']
    default:
      return camelToSnake(userField)
  }
}

export function userORM(user: Record<string, any>): User {
  return {
    id: user.id,
    creationTime: user.creation_time,
    modificationTime: user.modification_time,
    uniqueName: user.unique_name,
    email: user.email,
    name: user.name,
    phone: user.phone,
    gender: user.gender,
    isEmailVerified: user.is_email_verified,
    isStarUser: user.is_star_user,
    providers: getProviders(user),
    bio: user.bio,
    birth: user.birth,
    imageUrl: user.image_url,
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
