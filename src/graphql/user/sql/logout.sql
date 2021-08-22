UPDATE "user"
SET modification_time = NOW(),
  logout_time = NOW()
WHERE id = $1;