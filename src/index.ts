/* eslint-disable import/first */
import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') dotenv.config({ path: '.env.development' })
dotenv.config()

console.log(process.env.FRONTEND_URL)

import { connectDatabase } from './database/postgres'
import { startApolloExpressServer } from './common/express'

connectDatabase()

startApolloExpressServer()
