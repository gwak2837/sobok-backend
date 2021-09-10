JOIN bucket_x_menu ON bucket_x_menu.menu_id = menu.id
JOIN bucket ON bucket_x_menu.bucket_id = bucket.id
AND bucket.type = 1
AND bucket.id = $1
AND bucket.user_id = $2