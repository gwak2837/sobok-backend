SELECT %I
FROM "comment"
  JOIN user_x_liked_comment ON user_x_liked_comment.comment_id = "comment".id
WHERE user_x_liked_comment.user_id = $1;