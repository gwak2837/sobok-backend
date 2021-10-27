SELECT menu.id,
  menu.name,
  menu.image_urls,
  menu.description,
  user_x_liked_menu.user_id AS is_liked
FROM menu
  LEFT JOIN user_x_liked_menu ON user_x_liked_menu.menu_id = menu.id
  AND user_x_liked_menu.user_id = $1
WHERE menu.id = $2