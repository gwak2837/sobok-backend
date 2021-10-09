/* eslint-disable no-console */
import { startApolloServer } from './apollo/server'
import { pool } from './database/postgres'

pool
  .query('SELECT NOW()')
  .then(({ rows }) =>
    console.log('🚅 PostgreSQL 서버에 접속했습니다. ' + new Date(rows[0].now).toLocaleString())
  )
  .catch(() => {
    throw new Error('PostgreSQL 서버에 접속할 수 없습니다.')
  })

startApolloServer()
