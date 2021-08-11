import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { join } from 'path'

// loadFilesSync 실행 시 *.resolver.* 파일에서 모듈을 절대 경로로 불러오면 오류 발생, 꼭 상대 경로로 모듈을 불러와야 함
const typeDefsArray = loadFilesSync(join(__dirname, '**/*.graphql'))
const resolversArray = loadFilesSync(join(__dirname, '**/*.resolver.*'))

const typeDefs = mergeTypeDefs(typeDefsArray)
const resolvers = mergeResolvers(resolversArray)

const schema = makeExecutableSchema({ typeDefs, resolvers })

export default schema
