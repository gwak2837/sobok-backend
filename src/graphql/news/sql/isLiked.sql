SELECT news_id
FROM user_x_liked_news
WHERE user_x_liked_news.user_id = $1
  AND user_x_liked_news.news_id = $2;