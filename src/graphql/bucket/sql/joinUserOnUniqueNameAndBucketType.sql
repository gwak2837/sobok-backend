JOIN "user" ON "user".id = bucket.user_id
AND "user".unique_name = $1
AND bucket.type = $2