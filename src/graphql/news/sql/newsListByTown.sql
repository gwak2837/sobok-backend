SELECT news.id,
  news.creation_time,
  news.title,
  news.contents,
  news.category,
  store.id AS store__id,
  store.name AS store__name,
  store.image_urls AS store__image_urls
FROM news
  JOIN store ON store.id = news.store_id