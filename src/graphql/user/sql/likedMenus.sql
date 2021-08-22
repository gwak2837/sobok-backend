SELECT %I
FROM menu
  JOIN user_x_liked_menu ON user_x_liked_menu.user_id = $1
  AND user_x_liked_menu.menu_id = menu.id;