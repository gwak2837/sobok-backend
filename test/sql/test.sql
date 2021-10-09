SELECT store.id,
  store.name
FROM store
  JOIN store_x_hashtag ON store_x_hashtag.store_id = store.id
  JOIN hashtag ON hashtag.id = store_x_hashtag.hashtag_id
  AND hashtag.name = ANY(ARRAY ['케이크', '통유리'])