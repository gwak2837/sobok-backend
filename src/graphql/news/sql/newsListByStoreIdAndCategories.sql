SELECT %I
FROM news
WHERE store_id = $1
  AND category = ANY($2);