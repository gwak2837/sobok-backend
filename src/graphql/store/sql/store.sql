SELECT store.id,
  store.name,
  store.image_urls,
  store.description,
  user_x_liked_store.user_id AS is_liked
FROM store
  LEFT JOIN user_x_liked_store ON user_x_liked_store.store_id = store.id
  AND user_x_liked_store.user_id = $1
WHERE store.id = $2