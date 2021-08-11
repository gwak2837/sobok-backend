SELECT
  name
FROM
  hashtag
  JOIN user_x_hashtag ON user_id = $1
    AND user_x_hashtag.hashtag_id = hashtag.id
