/* eslint-disable prefer-promise-reject-errors */
import dotenv from 'dotenv'

import { readFileSynchronously, requestGraphql } from './utils'

dotenv.config({ path: '.env.test' })

test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3)
})

test('NODE_ENV', () => {
  expect(process.env.NODE_ENV).toBe('test')
})

test('POSTGRES_HOST', () => {
  expect(process.env.POSTGRES_HOST).toBe('localhost')
})

test('the data is peanut butter', async () => {
  await expect(new Promise((resolve) => resolve('peanut butter'))).resolves.toBe('peanut butter')
})

test('the fetch fails with an error', async () => {
  await expect(new Promise((resolve, reject) => reject('error'))).rejects.toMatch('error')
})

const feed = readFileSynchronously(__dirname, './graphql/feed.graphql')

test('graphql request feed', async () => {
  const feed0 = await requestGraphql(feed, { feedId: '0' })
  expect(feed0.errors).toBeDefined()

  const feed1 = await requestGraphql(feed, { feedId: '1' })
  expect(feed1.data).not.toBeNull()
})

const store = readFileSynchronously(__dirname, './graphql/store.graphql')

test('graphql request store', async () => {
  const store0 = await requestGraphql(store, { storeId: '0' })
  expect(store0.errors).not.toBeNull()

  const store1 = await requestGraphql(store, { storeId: '1' })
  expect(store1.data).not.toBeNull()
})

const storesByTownAndCategories = readFileSynchronously(
  __dirname,
  './graphql/StoresByTownAndCategories.graphql'
)

test('graphql request storesByTownAndCategories', async () => {
  await expect(requestGraphql(storesByTownAndCategories, {})).rejects.toThrow()

  const store1 = await requestGraphql(storesByTownAndCategories, {
    town: '흑석동',
    pagination: { limit: 10 },
  })
  expect(store1.data).not.toBeNull()
})
