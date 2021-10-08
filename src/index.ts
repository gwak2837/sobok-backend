import { pool } from './database/postgres'
import { startApolloServer } from './apollo/server'

pool
  .query('SELECT NOW()')
  .then(({ rows }) => console.log('PostgreSQL 서버에 접속했습니다. 접속 시각: ' + rows[0].now))
  .catch(() => {
    throw new Error('PostgreSQL 서버에 접속할 수 없습니다.')
  })

startApolloServer()
