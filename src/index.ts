/* eslint-disable import/first */
import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') dotenv.config({ path: '.env.development' })
dotenv.config()

import { connectDatabase } from './database/postgres'
import { startApolloExpressServer } from './common/express'
import { connectRedis } from './common/redis'

connectDatabase()

connectRedis()

startApolloExpressServer()
