SELECT id,
  name
FROM menu
WHERE (name, id) < ('아메리카노', 1)
ORDER BY name DESC,
  id DESC
FETCH FIRST 5 ROWS ONLY;

SELECT id,
  name,
  price
FROM menu
WHERE id > 1
ORDER BY price
FETCH FIRST 5
  /* =limit */
  ROWS ONLY