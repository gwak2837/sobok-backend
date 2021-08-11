SELECT
  % I
FROM
  store
  JOIN user_x_regular_store ON user_x_regular_store.store_id = store.id
    AND user_x_regular_store.user_id = $1;

