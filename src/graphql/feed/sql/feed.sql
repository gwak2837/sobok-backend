SELECT feed.id,
  feed.creation_time,
  feed.contents,
  feed.image_urls,
  feed.like_count,
  feed.comment_count,
  "user".id AS user__id,
  "user".nickname AS user__nickname,
  "user".image_url AS user__image_urls,
  store.id AS store__id,
  store.name AS store__name,
  store.image_urls AS store__image_urls,
  store.point AS store__point,
  user_x_liked_feed.user_id AS is_liked,
  array_agg(hashtag.name) AS hashtags
FROM feed
  JOIN "user" ON feed.user_id = "user".id
  JOIN store ON store.id = feed.store_id
  LEFT JOIN user_x_liked_feed ON user_x_liked_feed.feed_id = feed.id
  AND user_x_liked_feed.user_id = '189914cf-e73f-453c-900c-4e46ad64cf05'
  LEFT JOIN feed_x_hashtag ON feed_x_hashtag.feed_id = feed.id
  JOIN hashtag ON hashtag.id = feed_x_hashtag.hashtag_id
WHERE feed.id = 1
GROUP BY feed.id,
  "user".id,
  store.id,
  user_x_liked_feed.user_id