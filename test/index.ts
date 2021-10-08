import fs from 'fs'
import path from 'path'

import { pool, poolQuery } from '../src/database/postgres'

const test = fs.readFileSync(path.join(__dirname, './sql/test.sql')).toString('utf-8')

;(async () => {
  await pool.query('SELECT NOW()')

  console.log('PostgreSQL 서버에 접속했습니다.')

  const { rows } = await poolQuery(test, [null, 1])

  console.log(rows)
})()
