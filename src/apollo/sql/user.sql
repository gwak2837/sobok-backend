SELECT id
FROM "user"
WHERE id = $1
  AND valid_authentication_date <= $2;