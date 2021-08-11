SELECT
  id,
  password_hash_hash
FROM
  "user"
WHERE
  email = $1;

