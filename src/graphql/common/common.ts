import { GraphQLScalarType, Kind } from 'graphql'
import {
  DateResolver,
  DateTimeResolver,
  EmailAddressResolver,
  JWTResolver,
  LatitudeResolver,
  LongitudeResolver,
  NonEmptyStringResolver,
  PositiveIntResolver,
  URLResolver,
  UUIDResolver,
} from 'graphql-scalars'

export const Date = DateResolver
export const DateTime = DateTimeResolver
export const EmailAddress = EmailAddressResolver
export const JWT = JWTResolver
export const Latitude = LatitudeResolver
export const Longitude = LongitudeResolver
export const NonEmptyString = NonEmptyStringResolver
export const PositiveInt = PositiveIntResolver
export const URL = URLResolver
export const UUID = UUIDResolver

export const LastValue = new GraphQLScalarType({
  name: 'LastValue',
  description: 'Last value of pagination',
  parseValue: (value) => value,
  parseLiteral: (ast) => {
    switch (ast.kind) {
      case Kind.BOOLEAN:
      case Kind.STRING:
        return ast.value
      case Kind.INT:
      case Kind.FLOAT:
        return Number(ast.value)
      default:
        throw new Error(`Unexpected kind in parseLiteral: ${ast.kind}`)
    }
  },
  serialize: (value) => value,
})
