SELECT menu.id,
  menu.name,
  menu.price,
  menu.image_urls,
  store.id AS store__id,
  store.name AS store__name,
  store.point AS store__point,
  user_x_liked_menu.user_id AS is_liked,
  array_agg(hashtag.name) AS hashtags
FROM menu
  JOIN store ON store.id = menu.store_id
  LEFT JOIN menu_x_hashtag ON menu_x_hashtag.menu_id = menu.id
  JOIN hashtag ON hashtag.id = menu_x_hashtag.hashtag_id
  LEFT JOIN user_x_liked_menu ON user_x_liked_menu.menu_id = menu.id
  AND user_x_liked_menu.user_id = '082a8bb3-2eb1-44a3-9efe-bc906827c49f'
GROUP BY menu.id,
  menu.name,
  menu.price,
  menu.image_urls,
  store.id,
  store.name,
  user_x_liked_menu.user_id