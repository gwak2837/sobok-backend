/* eslint-disable prefer-promise-reject-errors */
import fs from 'fs'
import path from 'path'

import dotenv from 'dotenv'

import { requestGraphql } from './utils'

dotenv.config({ path: '.env.test' })

const feed = fs.readFileSync(path.join(__dirname, './graphql/feed.graphql')).toString('utf-8')

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

test('requestGraphql feed', async () => {
  const { data } = await requestGraphql(feed, { feedId: '1' })
  console.log('👀 - data', data)

  return expect(data).not.toBeNull()
})
