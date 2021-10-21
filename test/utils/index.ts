import fs from 'fs'
import path from 'path'

import axios from 'axios'

export async function requestGraphql<Result extends any>(
  query: string,
  variables: Record<string, unknown>
) {
  const { data } = await axios.post<Result>(`${process.env.BACKEND_URL}/graphql`, {
    query,
    variables,
  })
  return data
}

export function readFileSynchronously(__dirname: string, filePath: string) {
  return fs.readFileSync(path.join(__dirname, filePath)).toString('utf-8')
}
