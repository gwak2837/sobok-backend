LEFT JOIN user_x_liked_feed ON user_x_liked_feed.feed_id = feed.id
AND user_x_liked_feed.user_id = $1