UPDATE
  "user"
SET
  modification_date = NOW(),
  point = 0,
  is_unregistered = TRUE,
  password_hash_hash = '',
  image_url = '',
  name = '',
  phone_number = ''
WHERE
  id = $1
RETURNING
  id;

