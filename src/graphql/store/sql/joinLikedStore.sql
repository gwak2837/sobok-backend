LEFT JOIN user_x_liked_store ON user_x_liked_store.store_id = store.id
AND user_x_liked_store.user_id = $1