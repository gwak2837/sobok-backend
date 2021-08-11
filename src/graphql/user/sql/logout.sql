UPDATE
  "user"
SET
  modification_date = NOW(),
  valid_authentication_date = NOW()
WHERE
  id = $1;

