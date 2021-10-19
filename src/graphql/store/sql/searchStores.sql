SELECT store.id,
  store.image_urls,
  store.name,
  store.categories,
  store.point,
  user_x_liked_store.user_id AS is_liked,
  array_agg(hashtag.name) AS hashtags
FROM store
  JOIN store_x_hashtag ON store_x_hashtag.store_id = store.id
  JOIN hashtag ON hashtag.id = store_x_hashtag.hashtag_id
  AND hashtag.name = ANY($1)
  LEFT JOIN user_x_liked_store ON user_x_liked_store.store_id = store.id
  AND user_x_liked_store.user_id = $2
GROUP BY store.id,
  user_x_liked_store.user_id