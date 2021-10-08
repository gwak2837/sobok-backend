import { mergeResolvers } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'

import * as bucketObjectResolver from './bucket/Object.resolver'
import * as bucketQueryResolver from './bucket/Query.resolver'
import * as scalarResolver from './common/scalar.resolver'
import typeDefs from './generated/schema.graphql'

const resolversArray = [bucketQueryResolver, bucketObjectResolver, scalarResolver]

const resolvers = mergeResolvers(resolversArray)

const schema = makeExecutableSchema({ typeDefs, resolvers })

export default schema
