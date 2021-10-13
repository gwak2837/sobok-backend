import { mergeResolvers } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'

// import * as bucketObjectResolver from './bucket/Object.resolver'
// import * as bucketQueryResolver from './bucket/Query.resolver'
// import * as commentObjectResolver from './comment/Object.resolver'
import * as commentQueryResolver from './comment/Query.resolver'
import * as commonResolver from './common/common.resolver'
// import * as feedObjectResolver from './feed/Object.resolver'
// import * as feedQueryResolver from './feed/Query.resolver'
import typeDefs from './generated/schema.graphql'
// import * as menuObjectResolver from './menu/Object.resolver'
// import * as menuQueryResolver from './menu/Query.resolver'
// import * as newsObjectResolver from './news/Object.resolver'
// import * as newsQueryResolver from './news/Query.resolver'
import * as storeObjectResolver from './store/Object.resolver'
import * as storeQueryResolver from './store/Query.resolver'

// import * as userMutationResolver from './user/Mutation.resolver'
// import * as userObjectResolver from './user/Object.resolver'
// import * as userQueryResolver from './user/Query.resolver'

const resolversArray = [
  // bucketObjectResolver,
  // bucketQueryResolver,
  commonResolver,
  commentQueryResolver,
  // feedObjectResolver,
  // feedQueryResolver,
  // menuObjectResolver,
  // menuQueryResolver,
  // newsObjectResolver,
  // newsQueryResolver,
  storeObjectResolver,
  storeQueryResolver,
  // userMutationResolver,
  // userObjectResolver,
  // userQueryResolver,
]

const resolvers = mergeResolvers(resolversArray)

const schema = makeExecutableSchema({ typeDefs, resolvers })

export default schema
