DROP PROCEDURE create_order_new;

CREATE PROCEDURE create_order_new (selected_menu_ids int[])
LANGUAGE plpgsql
AS $$
DECLARE
  selected_menus CURSOR FOR
    SELECT
      id,
      price,
      store_id
    FROM
      menu
    WHERE
      id = ANY (selected_menu_ids);
  integer_var int;
  selected_menu record;
  selected_menu_count int = 0;
BEGIN
  OPEN selected_menus;

  /*FOR selected_menu IN
   SELECT
   id,
   price,
   store_id
   FROM
   menu
   WHERE
   id = ANY (selected_menu_ids)
   LOOP
   selected_menu_count = selected_menu_count + 1;
   END LOOP;
   GET DIAGNOSTICS integer_var = ROW_COUNT;
   RAISE NOTICE '% % %', integer_var, selected_menu_count, cardinality(selected_menu_ids);*/
END;
$$;

CALL create_order_new (ARRAY[2, 1, 3]);

