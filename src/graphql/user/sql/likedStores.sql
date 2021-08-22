SELECT %I
FROM store
  JOIN user_x_liked_store ON user_x_liked_store.user_id = $1
  AND user_x_liked_store.store_id = store.id;