SELECT
  % I
FROM
  store
  JOIN user_x_favorite_store ON user_x_favorite_store.store_id = store.id
    AND user_x_favorite_store.user_id = $1;

