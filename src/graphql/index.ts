import { mergeResolvers } from '@graphql-tools/merge'

import * as bucketObjectResolver from './bucket/Object'
import * as bucketQueryResolver from './bucket/Query'
// import * as commentObjectResolver from './comment/Object'
import * as commentQueryResolver from './comment/Query'
import * as commonResolver from './common/common'
import * as feedObjectResolver from './feed/Object'
import * as feedQueryResolver from './feed/Query'
import * as menuObjectResolver from './menu/Object'
import * as menuQueryResolver from './menu/Query'
import * as newsObjectResolver from './news/Object'
import * as newsQueryResolver from './news/Query'
import * as storeMutationResolver from './store/Mutation'
import * as storeObjectResolver from './store/Object'
import * as storeQueryResolver from './store/Query'
import * as userMutationResolver from './user/Mutation'
import * as userObjectResolver from './user/Object'
import * as userQueryResolver from './user/Query'

const resolversArray = [
  bucketObjectResolver,
  bucketQueryResolver,
  commonResolver,
  commentQueryResolver,
  feedObjectResolver,
  feedQueryResolver,
  menuObjectResolver,
  menuQueryResolver,
  newsObjectResolver,
  newsQueryResolver,
  storeMutationResolver,
  storeObjectResolver,
  storeQueryResolver,
  userMutationResolver,
  userObjectResolver,
  userQueryResolver,
]

export const resolvers = mergeResolvers(resolversArray)
