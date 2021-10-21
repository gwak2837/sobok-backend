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
