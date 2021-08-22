SELECT id,
  password_hash
FROM "user"
WHERE unique_name = $1
  OR email = $1;