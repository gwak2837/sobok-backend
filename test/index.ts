import { connectDatabase, poolQuery } from '../src/database/postgres'
import { importSQL } from '../src/utils/commons'

const test = importSQL(__dirname, 'sql/test.sql')

;(async () => {
  await connectDatabase()
  const a = await poolQuery(await test, [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
  ])

  console.log(a.rows)
})()
