SELECT menu_id
FROM user_x_liked_menu
WHERE user_x_liked_menu.user_id = $1
  AND user_x_liked_menu.menu_id = $2;