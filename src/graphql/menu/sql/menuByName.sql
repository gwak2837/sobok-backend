SELECT %I
FROM menu
WHERE store_id = $1
  AND name = $2;