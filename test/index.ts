import { connectDatabase, poolQuery } from '../src/database/postgres'
import { importSQL } from '../src/utils/commons'

const test = importSQL(__dirname, 'sql/test.sql')

;(async () => {
  await connectDatabase()
  const { rows } = await poolQuery(await test, [null, 1])

  console.log(rows)
})()
