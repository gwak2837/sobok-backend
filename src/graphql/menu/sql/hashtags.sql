SELECT name
FROM hashtag
  JOIN menu_x_hashtag ON hashtag.id = menu_x_hashtag.hashtag_id
WHERE menu_x_hashtag.menu_id = $1;