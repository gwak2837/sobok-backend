SELECT
  % I
FROM
  menu
  JOIN user_x_favorite_menu ON user_x_favorite_menu.menu_id = menu.id
    AND user_x_favorite_menu.user_id = $1;

