SELECT news.id,
  news.title,
  news.contents,
  news.category,
  news.image_urls,
  news.store_id,
  store.id,
  store.name,
  store.image_urls,
  user_x_liked_news.user_id
FROM news
  JOIN store ON news.store_id = store.id
  LEFT JOIN user_x_liked_news ON user_x_liked_news.news_id = news.id
  AND user_x_liked_news.user_id = $2;