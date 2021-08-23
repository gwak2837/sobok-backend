SELECT %I
FROM store
WHERE town = $1
  AND category = ANY($2);