UPDATE
  "user"
SET
  name = CASE WHEN $2 <> NULL THEN
    $2
  ELSE
    name
  END,
  phone_number = CASE WHEN $2 <> NULL THEN
    $2
  ELSE
    phone_number
  END,
  gender = CASE WHEN $2 <> NULL THEN
    $2
  ELSE
    gender
  END,
  birth_date = CASE WHEN $2 <> NULL THEN
    $2
  ELSE
    birth_date
  END
WHERE
  id = $1
