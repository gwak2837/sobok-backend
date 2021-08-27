SELECT store_id
FROM user_x_liked_store
WHERE user_x_liked_store.user_id = $1
  AND user_x_liked_store.store_id = $2;