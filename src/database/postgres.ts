import { Pool } from 'pg'

import { DatabaseQueryError } from '../apollo/errors'
import { formatDate } from '../utils'

export const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function poolQuery(query: string, values?: unknown[]) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(formatDate(new Date()), '-', query, values)
  }

  return pool.query(query, values).catch((error) => {
    if (process.env.NODE_ENV === 'production') {
      throw new DatabaseQueryError('Database query error')
    } else {
      throw new DatabaseQueryError(error)
    }
  })
}

// export async function transactionQuery(client: PoolClient, sql: string, values?: unknown[]) {
//   return client.query(sql, values).catch(async (error) => {
//     await client.query('ROLLBACK')
//     client.release()
//     if (process.env.NODE_ENV === 'production') throw new DatabaseQueryError('Database query error')
//     else throw new DatabaseQueryError(error)
//   })
// }
