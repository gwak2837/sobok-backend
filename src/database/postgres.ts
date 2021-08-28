import { Pool, PoolClient } from 'pg'
import { DatabaseQueryError } from '../apollo/errors'
import { formatDate, sleep } from '../utils/commons'

export const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
})

export async function poolQuery<RowResult extends Record<string, any>>(
  query: string,
  values?: unknown[]
) {
  console.log(formatDate(new Date()), '-', query, values)
  return pool.query<Partial<RowResult>>(query, values).catch((error) => {
    if (process.env.NODE_ENV === 'production') throw new DatabaseQueryError('Database query error')
    else throw new DatabaseQueryError(error)
  })
}

export async function transactionQuery(client: PoolClient, sql: string, values?: unknown[]) {
  return client.query(sql, values).catch(async (error) => {
    await client.query('ROLLBACK')
    client.release()
    if (process.env.NODE_ENV === 'production') throw new DatabaseQueryError('Database query error')
    else throw new DatabaseQueryError(error)
  })
}

export async function connectDatabase() {
  while (true) {
    try {
      await pool.query('SELECT NOW()')
      console.log('Connected to the PostgreSQL server')
      break
    } catch (error) {
      console.warn(error)
      await sleep(5000)
    }
  }
}
