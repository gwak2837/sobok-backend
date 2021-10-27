/* eslint-disable no-console */
import { startApolloServer } from './apollo/server'
import { pool } from './database/postgres'

pool
  .query('SELECT NOW()')
  .then(({ rows }) =>
    console.log('🚅 Connected to PostgreSQL server at ' + new Date(rows[0].now).toLocaleString())
  )
  .catch((error) => {
    console.log(error)
    throw new Error('PostgreSQL 서버에 접속할 수 없습니다.')
  })

startApolloServer()
  .then((url) => console.log(`🚀 Server ready at ${url}`))
  .catch((error) => {
    console.log(error)
    throw new Error('Apollo 서버를 실행할 수 없습니다.')
  })
