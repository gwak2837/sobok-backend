DO language plpgsql $$
DECLARE r boolean;

BEGIN CALL toggle_liked_store (1, 2, r);

CALL toggle_liked_store (1, 3, r);

CALL toggle_liked_store (1, 7, r);

CALL toggle_liked_store (2, 2, r);

CALL toggle_liked_store (3, 3, r);

CALL toggle_liked_store (4, 4, r);

CALL toggle_liked_store (5, 5, r);

CALL toggle_liked_store (6, 6, r);

CALL toggle_liked_store (7, 7, r);

CALL toggle_liked_store (8, 8, r);

CALL toggle_liked_store (9, 9, r);

CALL toggle_liked_store (10, 10, r);

CALL toggle_liked_menu (1, 1, r);

CALL toggle_liked_menu (2, 2, r);

CALL toggle_liked_menu (3, 3, r);

CALL toggle_liked_menu (4, 4, r);

CALL toggle_liked_menu (5, 5, r);

CALL toggle_liked_menu (6, 6, r);

CALL toggle_liked_menu (7, 7, r);

CALL toggle_liked_menu (8, 8, r);

CALL toggle_liked_menu (9, 9, r);

CALL toggle_liked_menu (10, 10, r);

END $$;