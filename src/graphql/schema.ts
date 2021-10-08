import { mergeResolvers } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'

import * as bucketResolver from './bucket/Query.resolver'
import typeDefs from './generated/schema.graphql'

// loadFilesSync 실행 시 *.resolver.* 파일에서 모듈을 절대 경로로 불러오면 오류 발생, 꼭 상대 경로로 모듈을 불러와야 함
const resolversArray = [bucketResolver] // loadFilesSync(join(__dirname, '**/*.resolver.*'))
console.log(resolversArray)

const resolvers = mergeResolvers(resolversArray)
console.log(resolvers)

const schema = makeExecutableSchema({ typeDefs, resolvers })

export default schema
