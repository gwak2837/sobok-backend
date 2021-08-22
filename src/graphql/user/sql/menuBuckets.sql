SELECT %I
FROM bucket
WHERE user_id = $1
  AND "type" = 1;