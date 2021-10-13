import { ApolloError } from 'apollo-server-errors'

export class DatabaseQueryError extends ApolloError {
  constructor(message: string) {
    super(message, 'DATABASE_QUERY_ERROR')
  }
}

export class NotImplementedError extends ApolloError {
  constructor(message: string) {
    super(message, 'NOT_IMPLEMENTED_ERROR')
  }
}

export class NotFoundError extends ApolloError {
  constructor(message: string) {
    super(message, '404_NOT_FOUND')
  }
}
