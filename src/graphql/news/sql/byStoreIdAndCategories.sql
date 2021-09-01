WHERE news.store_id = $1
  AND news.category = ANY($2)