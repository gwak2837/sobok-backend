import { ApolloError } from 'apollo-server-express'

export class DatabaseQueryError extends ApolloError {
  constructor(message: string) {
    super(message, 'DATABASE_QUERY_ERROR')
  }
}
