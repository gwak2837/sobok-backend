import { connectDatabase } from './database/postgres'
import { startApolloExpressServer } from './common/express'
import { connectRedis } from './common/redis'

connectDatabase()

connectRedis()

startApolloExpressServer()
