SELECT id
FROM "user"
WHERE id = $1
  AND logout_time < $2;