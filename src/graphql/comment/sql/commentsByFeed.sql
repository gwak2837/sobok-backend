SELECT "comment".id,
  "comment".creation_time,
  "comment".modification_time,
  "comment".contents,
  "user".id AS user__id,
  "user".image_url AS user__image_url,
  "user".nickname AS user__nickname
FROM "comment"
  JOIN "user" ON "user".id = "comment".user_id
WHERE "comment".feed_id = $1