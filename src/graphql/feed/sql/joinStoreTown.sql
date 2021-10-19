JOIN store ON store.id = feed.store_id
AND store.town = $1