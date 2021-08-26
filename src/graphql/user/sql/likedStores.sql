SELECT %I
FROM store
  JOIN user_x_liked_store ON user_x_liked_store.store_id = store.id
WHERE user_x_liked_store.user_id = $1;