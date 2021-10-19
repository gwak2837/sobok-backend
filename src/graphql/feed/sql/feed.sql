SELECT feed.id,
  feed.creation_time,
  feed.contents,
  feed.image_urls,
  feed.like_count,
  feed.comment_count,
  "user".id AS user__id,
  "user".nickname AS user__nickname,
  "user".image_url AS user__image_urls,
  user_x_liked_feed.user_id AS is_liked
FROM feed
  JOIN "user" ON feed.user_id = "user".id
  LEFT JOIN user_x_liked_feed ON user_x_liked_feed.feed_id = feed.id
  AND user_x_liked_feed.user_id = $1 --'189914cf-e73f-453c-900c-4e46ad64cf05'
WHERE feed.id = $2