INSERT INTO "user" (
  email,
  password_hash_hash,
  name,
  phone_number,
  gender,
  birth_date,
  image_urls,
  delivery_addresses,
  representative_delivery_address,
  google_oauth,
  naver_oauth,
  kakao_oauth)
VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  ARRAY[$7],
  ARRAY[$8],
  $9,
  $10,
  $11,
  $12)
RETURNING
  id;

