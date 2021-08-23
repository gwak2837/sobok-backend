SELECT %I
FROM store
WHERE categories = ANY($1);