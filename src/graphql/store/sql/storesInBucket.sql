SELECT store.id,
  store.image_urls,
  store.name,
  store.categories,
  store.point,
  user_x_liked_store.user_id AS is_liked,
  array_agg(hashtag.name) AS hashtags
FROM store
  LEFT JOIN store_x_hashtag ON store_x_hashtag.store_id = store.id
  JOIN hashtag ON hashtag.id = store_x_hashtag.hashtag_id
  LEFT JOIN user_x_liked_store ON user_x_liked_store.store_id = store.id
  AND user_x_liked_store.user_id = $1
  JOIN bucket_x_store ON bucket_x_store.store_id = store.id
  JOIN bucket ON bucket.id = bucket_x_store.bucket_id
  AND bucket.type = 0
  AND bucket.id = $2
GROUP BY store.id,
  user_x_liked_store.user_id