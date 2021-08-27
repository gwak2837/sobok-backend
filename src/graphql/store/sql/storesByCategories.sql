SELECT %I
FROM store
WHERE categories && $1;