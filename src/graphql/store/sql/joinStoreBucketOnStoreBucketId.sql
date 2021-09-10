JOIN bucket_x_store ON bucket_x_store.store_id = store.id
JOIN bucket ON bucket_x_store.bucket_id = bucket.id
AND bucket.type = 0
AND bucket.id = $1
AND bucket.user_id = $2