SELECT name
FROM hashtag
  JOIN store_x_hashtag ON hashtag.id = store_x_hashtag.hashtag_id
WHERE store_x_hashtag.store_id = $1;