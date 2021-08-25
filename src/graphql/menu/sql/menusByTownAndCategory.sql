SELECT %s
FROM menu
  JOIN store ON store.id = menu.store_id
WHERE town = $1
  AND category = $2;