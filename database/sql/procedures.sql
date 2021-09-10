DO language plpgsql $$
DECLARE r boolean;

DECLARE t text;

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

CALL toggle_following_user(1, 2, t);

call toggle_following_user(1, 3, t);

call toggle_following_user(1, 4, t);

call toggle_following_user(2, 3, t);

call toggle_following_user(2, 4, t);

call toggle_following_user(2, 5, t);

call toggle_store_bucket_list(1, 1, 1, t);

call toggle_store_bucket_list(1, 2, 1, t);

call toggle_store_bucket_list(1, 3, 1, t);

call toggle_menu_bucket_list(1, 1, 2, t);

call toggle_menu_bucket_list(1, 2, 2, t);

call toggle_menu_bucket_list(1, 3, 2, t);

call toggle_store_bucket_list(2, 4, 3, t);

call toggle_store_bucket_list(2, 5, 3, t);

call toggle_store_bucket_list(2, 6, 3, t);

call toggle_menu_bucket_list(2, 4, 4, t);

call toggle_menu_bucket_list(2, 5, 4, t);

call toggle_menu_bucket_list(2, 6, 4, t);

END $$;