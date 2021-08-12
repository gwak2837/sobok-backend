import { Provider, User } from '../generated/graphql'
import { camelToSnake } from '../../utils/commons'

export const user: User = {
  id: '',
  creationTime: '',
  modificationTime: '',
  email: '',
  providers: [Provider.DessertFit],
  point: 0,
  isEmailVerified: false,
}

export function userFieldColumnMapping(userField: keyof User) {
  switch (userField) {
    case 'providers':
      return ['google_oauth', 'naver_oauth', 'kakao_oauth']
    case 'representativeDeliveryAddress':
      return ['representative_delivery_address', 'delivery_addresses']
    case 'favoriteMenus':
      return ''
    case 'favoriteStores':
      return ''
    case 'preferences':
      return ''
    case 'regularStores':
      return ''
    default:
      return camelToSnake(userField)
  }
}

export function userORM(user: Record<string, any>): User {
  return {
    id: user.id,
    creationTime: user.creation_date,
    modificationTime: user.modification_date,
    email: user.email,
    providers: getProviders(user),
    point: user.point,
    isEmailVerified: user.is_email_verified,
    name: user.name,
    phoneNumber: user.phone_number,
    gender: user.gender,
    birthDate: user.birth_date,
    imageUrls: user.image_urls,
    deliveryAddresses: user.delivery_addresses,
    representativeDeliveryAddress:
      user.representative_delivery_address &&
      user.delivery_addresses[user.representative_delivery_address],
  }
}

function getProviders(user: Record<string, any>) {
  const providers = []

  if (user.google_oauth) providers.push(Provider.Google)
  if (user.naver_oauth) providers.push(Provider.Naver)
  if (user.kakao_oauth) providers.push(Provider.Kakao)

  return providers
}
