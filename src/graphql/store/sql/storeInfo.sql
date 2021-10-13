SELECT store.id,
  store.tel,
  store.address,
  store.business_hours,
  store.categories,
  array_agg(hashtag.name) AS hashtags
FROM store
  LEFT JOIN store_x_hashtag ON store_x_hashtag.store_id = store.id
  JOIN hashtag ON hashtag.id = store_x_hashtag.hashtag_id
WHERE store.id = $1
GROUP BY store.id,
  store.tel,
  store.address,
  store.business_hours,
  store.categories