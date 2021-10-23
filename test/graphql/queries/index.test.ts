import { readFileSynchronously, requestGraphql } from '../../utils'

const feed = readFileSynchronously(__dirname, './feed.graphql')
const store = readFileSynchronously(__dirname, './store.graphql')
const storesByTownAndCategories = readFileSynchronously(
  __dirname,
  './storesByTownAndCategories.graphql'
)

describe('graphql query', () => {
  test('feed', async () => {
    await expect(requestGraphql(feed, {})).rejects.toThrow()

    const feed0 = await requestGraphql(feed, { feedId: '0' })
    expect(feed0.errors).toBeDefined()

    const feed1 = await requestGraphql(feed, { feedId: '1' })
    expect(feed1.data).not.toBeNull()
  })

  test('store', async () => {
    await expect(requestGraphql(store, {})).rejects.toThrow()

    const store0 = await requestGraphql(store, { storeId: '0' })
    expect(store0.errors).not.toBeNull()

    const store1 = await requestGraphql(store, { storeId: '1' })
    expect(store1.data).not.toBeNull()
  })

  test('storesByTownAndCategories', async () => {
    await expect(requestGraphql(storesByTownAndCategories, {})).rejects.toThrow()

    const store1 = await requestGraphql(storesByTownAndCategories, {
      town: '흑석동',
      pagination: { limit: 10 },
    })
    expect(store1.data).not.toBeNull()
  })
})
