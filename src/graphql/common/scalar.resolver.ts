import {
  DateResolver,
  DateTimeResolver,
  EmailAddressResolver,
  JWTResolver,
  NonEmptyStringResolver,
  URLResolver,
} from 'graphql-scalars'

export const Date = DateResolver
export const DateTime = DateTimeResolver
export const EmailAddress = EmailAddressResolver
export const JWT = JWTResolver
export const URL = URLResolver
export const NonEmptyString = NonEmptyStringResolver
