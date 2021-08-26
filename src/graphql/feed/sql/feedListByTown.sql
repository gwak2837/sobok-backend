SELECT %s
FROM feed
  JOIN store ON feed.store_id = store.id
WHERE store.town = $1;