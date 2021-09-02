LEFT JOIN bucket_x_menu ON bucket_x_menu.menu_id = menu.id
LEFT JOIN bucket ON bucket_x_menu.bucket_id = bucket.id
AND bucket.user_id = $1
/* left join 1개만 가능? */