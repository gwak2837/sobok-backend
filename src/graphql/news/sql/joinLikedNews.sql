LEFT JOIN user_x_liked_news ON user_x_liked_news.news_id = news.id
AND user_x_liked_news.user_id = $1