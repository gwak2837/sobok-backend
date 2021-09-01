import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeResolvers } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
import { readFileSync } from 'fs'
import { join } from 'path'

const typeDefs = readFileSync(join(__dirname, 'generated/schema.graphql')).toString('utf-8')

// loadFilesSync 실행 시 *.resolver.* 파일에서 모듈을 절대 경로로 불러오면 오류 발생, 꼭 상대 경로로 모듈을 불러와야 함
const resolversArray = loadFilesSync(join(__dirname, '**/*.resolver.*'))
const resolvers = mergeResolvers(resolversArray)

const schema = makeExecutableSchema({ typeDefs, resolvers })

export default schema
