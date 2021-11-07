/* eslint-disable no-console */
import { startApolloServer } from './apollo/server'
import { pool } from './database/postgres'

pool
  .query('SELECT CURRENT_TIMESTAMP')
  .then(({ rows }) =>
    console.log(
      `🚅 Connected to ${process.env.CONNECTION_STRING} at ${new Date(
        rows[0].current_timestamp
      ).toLocaleString()}`
    )
  )
  .catch((error) => {
    throw new Error('PostgreSQL 서버에 접속할 수 없습니다. ' + error)
  })

startApolloServer()
  .then((url) => console.log(`🚀 Server ready at ${url}`))
  .catch((error) => {
    throw new Error('Apollo 서버를 실행할 수 없습니다. ' + error)
  })
