import { mergeResolvers } from '@graphql-tools/merge'

// import * as bucketObjectResolver from './bucket/Object.resolver'
// import * as bucketQueryResolver from './bucket/Query.resolver'
// import * as commentObjectResolver from './comment/Object.resolver'
import * as commentQueryResolver from './comment/Query'
import * as commonResolver from './common/common.resolver'
// import * as menuObjectResolver from './menu/Object.resolver'
// import * as menuQueryResolver from './menu/Query.resolver'
// import * as newsObjectResolver from './news/Object.resolver'
// import * as newsQueryResolver from './news/Query.resolver'
import * as storeObjectResolver from './store/Object'
import * as storeQueryResolver from './store/Query'

// import { makeExecutableSchema } from '@graphql-tools/schema'

// import * as feedObjectResolver from './feed/Object.resolver'
// import * as feedQueryResolver from './feed/Query.resolver'

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

export const resolvers = mergeResolvers(resolversArray)
