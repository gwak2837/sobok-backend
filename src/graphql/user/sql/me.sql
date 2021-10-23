SELECT id,
  email,
  name,
  nickname
FROM "user"
WHERE id = $1