LEFT JOIN bucket_x_store ON bucket_x_store.store_id = store.id
LEFT JOIN bucket ON bucket_x_store.bucket_id = bucket.id
AND bucket.user_id = $1