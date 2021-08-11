DROP SCHEMA public CASCADE;

CREATE SCHEMA public AUTHORIZATION sindy;

COMMENT ON SCHEMA public IS 'standard public schema';

GRANT ALL ON SCHEMA public TO PUBLIC;

GRANT ALL ON SCHEMA public TO sindy;

DROP SCHEMA deleted CASCADE;

CREATE SCHEMA deleted AUTHORIZATION sindy;

COMMENT ON SCHEMA deleted IS 'deleted records history';

GRANT ALL ON SCHEMA deleted TO sindy;

-- valid_authentication_date 이후의 JWT 토큰만 유효함
CREATE TABLE "user" (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  email varchar(64) NOT NULL UNIQUE,
  point int NOT NULL DEFAULT 0 CHECK (point >= 0),
  is_email_verified boolean NOT NULL DEFAULT FALSE,
  --
  name varchar(64),
  phone_number varchar(32),
  gender varchar(16),
  birth_date timestamptz,
  image_urls text[],
  delivery_addresses varchar(64)[],
  representative_delivery_address int CHECK (representative_delivery_address >= 1),
  google_oauth text UNIQUE,
  naver_oauth text UNIQUE,
  kakao_oauth text UNIQUE,
  --
  password_hash_hash varchar(128) NOT NULL,
  valid_authentication_date timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE deleted."user" (
  id bigint PRIMARY KEY,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  deletion_date timestamptz NOT NULL DEFAULT NOW(),
  --
  email varchar(64) NOT NULL UNIQUE,
  point int NOT NULL DEFAULT 0 CHECK (point >= 0),
  --
  name varchar(64),
  phone_number varchar(32),
  gender varchar(16),
  birth_date timestamptz,
  image_urls text[],
  delivery_addresses varchar(64)[],
  representative_delivery_address int CHECK (representative_delivery_address >= 1)
);

CREATE TABLE store (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  name varchar(64) NOT NULL,
  address varchar(64) NOT NULL,
  business_registration_name varchar(64) NOT NULL,
  business_registration_number varchar(64) NOT NULL,
  business_registration_address varchar(64) NOT NULL,
  business_representative_name varchar(64) NOT NULL,
  is_franchise boolean NOT NULL,
  --
  delivery_charge int NOT NULL DEFAULT 0,
  minimum_delivery_amount int NOT NULL DEFAULT 0,
  delicious_review_count int NOT NULL DEFAULT 0,
  fine_review_count int NOT NULL DEFAULT 0,
  bad_review_count int NOT NULL DEFAULT 0,
  new_order_count int NOT NULL DEFAULT 0,
  reorder_count int NOT NULL DEFAULT 0,
  new_customer_count int NOT NULL DEFAULT 0,
  regular_customer_count int NOT NULL DEFAULT 0,
  favorite_count int NOT NULL DEFAULT 0,
  click_count int NOT NULL DEFAULT 0,
  post_count int NOT NULL DEFAULT 0,
  --
  user_id bigint NOT NULL REFERENCES "user" ON DELETE CASCADE,
  --
  review_event_content text[],
  regular_customer_event_content text[],
  minimum_delivery_time int,
  maximum_delivery_time int,
  image_urls text[]
);

CREATE TABLE menu_category (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  --
  name varchar(32) UNIQUE NOT NULL,
  menu_category_id bigint REFERENCES menu_category ON DELETE CASCADE
);

CREATE TABLE menu_theme (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  --
  name varchar(32) UNIQUE NOT NULL
);

CREATE TABLE menu (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  name varchar(64) NOT NULL,
  price int NOT NULL,
  --
  is_signiture boolean NOT NULL DEFAULT FALSE,
  delicious_review_count int NOT NULL DEFAULT 0,
  fine_review_count int NOT NULL DEFAULT 0,
  bad_review_count int NOT NULL DEFAULT 0,
  new_order_count int NOT NULL DEFAULT 0,
  reorder_count int NOT NULL DEFAULT 0,
  new_customer_count int NOT NULL DEFAULT 0,
  regular_customer_count int NOT NULL DEFAULT 0,
  favorite_count int NOT NULL DEFAULT 0,
  click_count int NOT NULL DEFAULT 0,
  store_post_count int NOT NULL DEFAULT 0,
  is_discounted boolean NOT NULL DEFAULT FALSE,
  can_be_picked boolean NOT NULL DEFAULT FALSE,
  can_be_reserved boolean NOT NULL DEFAULT FALSE,
  --
  category_id bigint NOT NULL REFERENCES menu_category ON DELETE CASCADE,
  store_id bigint NOT NULL REFERENCES store ON DELETE CASCADE,
  --
  image_urls text[],
  content text,
  --
  theme_id bigint REFERENCES menu_theme ON DELETE CASCADE
);

CREATE INDEX menu_store_id ON menu (store_id);

CREATE INDEX menu_category_id ON menu (category_id);

CREATE INDEX menu_theme_id ON menu (theme_id);

-- type: '양자택일형', '단일선택형', '다중선택형', '서술형'
-- xxx_selection_count: '다중선택형'일 때만 사용
-- store_id: 해당 menu_option_category를 소유한 매장
CREATE TABLE menu_option_category (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  name varchar(32) NOT NULL,
  "type" varchar(16) NOT NULL,
  --
  is_necessary boolean NOT NULL DEFAULT FALSE,
  --
  store_id bigint NOT NULL REFERENCES store ON DELETE CASCADE,
  --
  minimum_selection_count int,
  maximum_selection_count int
);

CREATE TABLE menu_x_menu_option_category (
  menu_id bigint REFERENCES menu ON DELETE CASCADE,
  menu_option_category_id bigint REFERENCES menu_option_category ON DELETE CASCADE,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (menu_id, menu_option_category_id)
);

-- category_id: 이 옵션이 어떤 형태에 속하는지
CREATE TABLE menu_option (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  name varchar(32) NOT NULL,
  price int NOT NULL DEFAULT 0,
  --
  category_id bigint NOT NULL REFERENCES menu_option_category ON DELETE CASCADE
);

CREATE TABLE payment (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  name varchar(32) NOT NULL
);

-- type은 '정액형', '정률형'
-- user_id: 쿠폰 소유 사용자
-- store_id: 쿠폰 발행 매장
-- order_id: 쿠폰을 사용한 주문
-- 쿠폰의 유효기간 = 쿠폰 다운로드 가능 기간
CREATE TABLE coupon (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  --
  name varchar(32) NOT NULL,
  "type" varchar(16) NOT NULL,
  discount_amount int NOT NULL CHECK (discount_amount >= 0),
  minimum_order_amount int NOT NULL CHECK (minimum_order_amount >= 0),
  expiration_start_date timestamptz NOT NULL,
  expiration_end_date timestamptz NOT NULL CHECK (expiration_start_date < expiration_end_date),
  --
  is_used boolean NOT NULL DEFAULT FALSE,
  --
  store_id bigint REFERENCES store ON DELETE CASCADE,
  user_id bigint REFERENCES "user" ON DELETE CASCADE
);

-- 쿠폰을 사용할 수 있는 매장 관계
CREATE TABLE store_x_coupon (
  store_id bigint REFERENCES store ON DELETE CASCADE,
  coupon_id bigint REFERENCES coupon ON DELETE CASCADE,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (store_id, coupon_id)
);

CREATE TABLE "order" (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  menu_total int NOT NULL CHECK (menu_total >= 0),
  delivery_charge int NOT NULL CHECK (delivery_charge >= 0),
  payment_date timestamptz NOT NULL,
  delivery_address varchar(64) NOT NULL,
  --
  order_status varchar(16) NOT NULL DEFAULT '접수 대기',
  point_used int NOT NULL DEFAULT 0 CHECK (point_used >= 0),
  point_saved int NOT NULL DEFAULT 0 CHECK (point_saved >= 0),
  --
  user_id bigint NOT NULL REFERENCES "user" ON DELETE CASCADE,
  payment_id bigint NOT NULL REFERENCES payment ON DELETE CASCADE,
  store_id bigint NOT NULL REFERENCES store ON DELETE CASCADE,
  --
  delivery_request varchar(256),
  store_request varchar(256),
  review_reward varchar(256),
  regular_reward varchar(256),
  --
  coupon_id bigint REFERENCES coupon ON DELETE CASCADE
);

ALTER TABLE coupon
  ADD COLUMN order_id bigint REFERENCES "order" ON DELETE CASCADE;

-- 주문할 때 선택한 메뉴
CREATE TABLE order_x_selected_menu (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  --
  "count" int NOT NULL,
  --
  order_id bigint NOT NULL REFERENCES "order" ON DELETE CASCADE,
  menu_id bigint NOT NULL REFERENCES menu ON DELETE CASCADE,
  --
  UNIQUE (order_id, menu_id)
);

-- 주문할 때 선택한 메뉴 옵션
-- text는 메뉴 옵션이 '서술형'일 떄 사용
CREATE TABLE order_x_selected_menu_option (
  order_x_selected_menu_id bigint REFERENCES order_x_selected_menu,
  menu_option_id bigint REFERENCES menu_option,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  --
  text text,
  --
  PRIMARY KEY (order_x_selected_menu_id, menu_option_id)
);

-- CREATE TABLE promotion (
--   id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
--   creation_date timestamptz NOT NULL DEFAULT NOW(),
--   modification_date timestamptz NOT NULL DEFAULT NOW(),
--   --
--   name varchar(32) NOT NULL,
--   operattion varchar(16) NOT NULL,
--   discount_amount int NOT NULL,
--   --
--   order_id bigint REFERENCES menu ON DELETE CASCADE,
--   store_id bigint REFERENCES store ON DELETE CASCADE
-- );
CREATE TABLE review (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  rating varchar(16) NOT NULL,
  --
  user_id bigint NOT NULL REFERENCES "user" ON DELETE CASCADE,
  store_id bigint NOT NULL REFERENCES store ON DELETE CASCADE,
  order_id bigint NOT NULL REFERENCES "order" ON DELETE CASCADE,
  --
  helping_others_count int NOT NULL DEFAULT 0,
  image_urls text[],
  good_point_content text,
  desired_point_content text
);

-- CREATE TABLE post_category (
--   id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
--   creation_date timestamptz NOT NULL DEFAULT NOW(),
--   modification_date timestamptz NOT NULL DEFAULT NOW(),
--   --
--   name varchar(64) NOT NULL
-- );
CREATE TABLE post (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  content text NOT NULL,
  --
  comment_count int NOT NULL DEFAULT 0,
  like_count int NOT NULL DEFAULT 0,
  --
  image_urls text[],
  --
  store_id bigint NOT NULL REFERENCES store ON DELETE CASCADE --,
  -- post_category_id bigint NOT NULL REFERENCES post_category ON DELETE CASCADE
);

CREATE TABLE user_x_liked_post (
  user_id bigint REFERENCES "user" ON DELETE CASCADE,
  post_id bigint REFERENCES post ON DELETE CASCADE,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (user_id, post_id)
);

CREATE TABLE "comment" (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  content varchar(256) NOT NULL,
  --
  user_id bigint NOT NULL REFERENCES "user" ON DELETE CASCADE,
  post_id bigint NOT NULL REFERENCES post ON DELETE CASCADE,
  --
  comment_id bigint REFERENCES "comment" ON DELETE CASCADE
);

CREATE TABLE hashtag (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  --
  name varchar(32) NOT NULL UNIQUE
);

CREATE TABLE banner_advertisement (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  --
  imageUrl text NOT NULL UNIQUE,
  advertisement_start_date timestamptz NOT NULL,
  advertisement_end_date timestamptz NOT NULL CHECK (advertisement_start_date < advertisement_end_date)
);

CREATE UNIQUE INDEX hashtag_name ON hashtag (name);

CREATE TABLE user_x_favorite_store (
  user_id bigint REFERENCES "user" ON DELETE CASCADE,
  store_id bigint REFERENCES store ON DELETE CASCADE,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (user_id, store_id)
);

CREATE TABLE user_x_store_request (
  user_id bigint REFERENCES "user" ON DELETE CASCADE,
  store_id bigint REFERENCES store ON DELETE CASCADE,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  store_request text,
  --
  PRIMARY KEY (user_id, store_id)
);

CREATE TABLE deleted.user_x_favorite_store (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id bigint NOT NULL,
  store_id bigint NOT NULL,
  creation_date timestamptz NOT NULL,
  deletion_date timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE user_x_regular_store (
  user_id bigint REFERENCES "user" ON DELETE CASCADE,
  store_id bigint REFERENCES store ON DELETE CASCADE,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  date_limit_for_regular timestamptz NOT NULL,
  order_count_for_regular int NOT NULL,
  --
  regular_maintenance_date timestamptz,
  --
  PRIMARY KEY (user_id, store_id)
);

CREATE TABLE user_x_favorite_menu (
  user_id bigint REFERENCES "user" ON DELETE CASCADE,
  menu_id bigint REFERENCES menu ON DELETE CASCADE,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (user_id, menu_id)
);

CREATE TABLE deleted.user_x_favorite_menu (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id bigint NOT NULL,
  menu_id bigint NOT NULL,
  creation_date timestamptz NOT NULL,
  deletion_date timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE user_x_hashtag (
  user_id bigint REFERENCES "user" ON DELETE CASCADE,
  hashtag_id bigint REFERENCES hashtag ON DELETE CASCADE,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (user_id, hashtag_id)
);

CREATE TABLE store_x_hashtag (
  store_id bigint REFERENCES store ON DELETE CASCADE,
  hashtag_id bigint REFERENCES hashtag ON DELETE CASCADE,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (store_id, hashtag_id)
);

CREATE TABLE menu_x_review (
  menu_id bigint REFERENCES menu ON DELETE CASCADE,
  review_id bigint REFERENCES review ON DELETE CASCADE,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (menu_id, review_id)
);

CREATE TABLE menu_x_hashtag (
  menu_id bigint REFERENCES menu,
  hashtag_id bigint REFERENCES hashtag,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (menu_id, hashtag_id)
);

CREATE TABLE review_x_hashtag (
  review_id bigint REFERENCES review,
  hashtag_id bigint REFERENCES hashtag,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (review_id, hashtag_id)
);

CREATE TABLE post_x_hashtag (
  post_id bigint REFERENCES post,
  hashtag_id bigint REFERENCES hashtag,
  creation_date timestamptz NOT NULL DEFAULT NOW(),
  modification_date timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (post_id, hashtag_id)
);

CREATE OR REPLACE FUNCTION create_store (name text, address text, is_franchise boolean, user_id bigint, review_event_content text[] DEFAULT NULL, regular_customer_event_content text[] DEFAULT NULL, minimum_delivery_time int DEFAULT NULL, maximum_delivery_time int DEFAULT NULL, image_urls text ARRAY DEFAULT NULL, hashtags text ARRAY DEFAULT NULL, out inserted_store_id bigint)
LANGUAGE SQL
AS $$
  WITH inserted_store AS (
    INSERT INTO store (
      name,
      address,
      business_registration_name,
      business_registration_number,
      business_registration_address,
      business_representative_name,
      is_franchise,
      user_id,
      review_event_content,
      regular_customer_event_content,
      minimum_delivery_time,
      maximum_delivery_time,
      image_urls)
    VALUES (
      name,
      address,
      '상호명',
      '1502315983',
      '사업장소재지',
      '대표자',
      is_franchise,
      user_id,
      review_event_content,
      regular_customer_event_content,
      minimum_delivery_time,
      maximum_delivery_time,
      image_urls)
  RETURNING
    id
),
hashtag_input (
  name
) AS (
  SELECT
    unnest(hashtags)
),
inserted_hashtag (
  id
) AS (
  INSERT INTO hashtag (
    name)
  SELECT
    *
  FROM
    hashtag_input
  ON CONFLICT (name)
    DO NOTHING
  RETURNING
    id
),
store_hashtag (
  id
) AS (
  SELECT
    id
  FROM
    inserted_hashtag
  UNION ALL
  SELECT
    hashtag.id
  FROM
    hashtag_input
    JOIN hashtag USING (name)
),
inserted_store_x_hashtag AS (
  INSERT INTO store_x_hashtag (
    store_id,
    hashtag_id)
  SELECT
    inserted_store.id,
    store_hashtag.id
  FROM
    inserted_store,
    store_hashtag
)
SELECT
  id
FROM
  inserted_store;

$$;

CREATE OR REPLACE FUNCTION select_insert_menu_category (_name text, OUT menu_category_id int)
AS $$
BEGIN
  LOOP
    SELECT
      id
    FROM
      menu_category
    WHERE
      name = _name INTO menu_category_id;
    EXIT
    WHEN FOUND;
    INSERT INTO menu_category (
      name)
    VALUES (
      _name)
  ON CONFLICT (
    name)
    DO NOTHING
  RETURNING
    menu_category.id INTO menu_category_id;
    EXIT
    WHEN FOUND;
  END LOOP;
END
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_menu (name text, price int, category_name text, store_id bigint, image_urls text ARRAY DEFAULT NULL, hashtags text ARRAY DEFAULT NULL, out inserted_menu_id bigint)
LANGUAGE SQL
AS $$
  WITH inserted_menu AS (
    INSERT INTO menu (
      name,
      price,
      category_id,
      store_id,
      image_urls)
    VALUES (
      name,
      price,
      select_insert_menu_category (
        category_name),
      store_id,
      image_urls)
  RETURNING
    id
),
hashtag_input (
  name
) AS (
  SELECT
    unnest(hashtags)
),
inserted_hashtag AS (
  INSERT INTO hashtag (
    name)
  SELECT
    name
  FROM
    hashtag_input
  ON CONFLICT (name)
    DO NOTHING
  RETURNING
    id
),
menu_hashtag AS (
  SELECT
    id
  FROM
    inserted_hashtag
  UNION ALL
  SELECT
    hashtag.id
  FROM
    hashtag_input
    JOIN hashtag USING (name)
),
inserted_menu_x_hashtag AS (
  INSERT INTO menu_x_hashtag (
    menu_id,
    hashtag_id)
  SELECT
    inserted_menu.id,
    menu_hashtag.id
  FROM
    inserted_menu,
    menu_hashtag
)
SELECT
  id
FROM
  inserted_menu;

$$;

CREATE OR REPLACE FUNCTION toggle_user_favorite_menu (_user_id bigint, _menu_id bigint)
  RETURNS boolean
  LANGUAGE plpgsql
  AS $$
BEGIN
  PERFORM
  FROM
    user_x_favorite_menu
  WHERE
    user_id = _user_id
    AND menu_id = _menu_id;
  IF NOT FOUND THEN
    INSERT INTO user_x_favorite_menu (
      user_id,
      menu_id)
    VALUES (
      _user_id,
      _menu_id);
    RETURN TRUE;
  ELSE
    INSERT INTO deleted.user_x_favorite_menu (
      user_id,
      menu_id,
      creation_date)
    SELECT
      user_id,
      menu_id,
      creation_date
    FROM
      user_x_favorite_menu
    WHERE
      user_id = _user_id
      AND menu_id = _menu_id;
    DELETE FROM user_x_favorite_menu
    WHERE user_id = _user_id
      AND menu_id = _menu_id;
    RETURN FALSE;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION toggle_user_favorite_store (_user_id bigint, _store_id bigint)
  RETURNS boolean
  LANGUAGE plpgsql
  AS $$
BEGIN
  PERFORM
  FROM
    user_x_favorite_store
  WHERE
    user_id = _user_id
    AND store_id = _store_id;
  IF NOT FOUND THEN
    INSERT INTO user_x_favorite_store (
      user_id,
      store_id)
    VALUES (
      _user_id,
      _store_id);
    RETURN TRUE;
  ELSE
    INSERT INTO deleted.user_x_favorite_store (
      user_id,
      store_id,
      creation_date)
    SELECT
      user_id,
      store_id,
      creation_date
    FROM
      user_x_favorite_store
    WHERE
      user_id = _user_id
      AND store_id = _store_id;
    DELETE FROM user_x_favorite_store
    WHERE user_id = _user_id
      AND store_id = _store_id;
    RETURN FALSE;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION get_total_price_from (menu_ids bigint ARRAY, menu_option_ids bigint ARRAY DEFAULT NULL, out total_price int)
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT
    sum(sum)::int
  FROM (
    SELECT
      sum(price)
    FROM
      menu
      JOIN (
        SELECT
          unnest(menu_ids) AS id) AS selected_menu ON menu.id = selected_menu.id
    UNION ALL
    SELECT
      sum(price)
    FROM
      menu_option
      JOIN (
        SELECT
          unnest(menu_option_ids) AS id) AS selected_menu_option ON menu_option.id = selected_menu_option.id) AS total_selection;

$$;

CREATE OR REPLACE FUNCTION get_delivery_charge_from (store_id bigint, out delivery_charge int)
LANGUAGE SQL
IMMUTABLE
AS $$
  SELECT
    delivery_charge
  FROM
    store
  WHERE
    id = store_id;

$$;

CREATE OR REPLACE FUNCTION create_order (store_id bigint, menu_total int, payment_id bigint, payment_date timestamptz, user_id bigint, delivery_address varchar(64), delivery_phone_number varchar(32), delivery_request varchar(256) DEFAULT NULL, store_request varchar(256) DEFAULT NULL, review_reward boolean DEFAULT NULL, regular_reward boolean DEFAULT NULL, point_used int DEFAULT NULL, coupon_id bigint DEFAULT NULL, out inserted_order_id bigint)
LANGUAGE SQL
AS $$
  WITH inserted_order AS (
    INSERT INTO "order" (
      menu_total,
      delivery_charge,
      payment_date,
      delivery_address,
      point_used,
      user_id,
      payment_id,
      store_id,
      delivery_request,
      store_request,
      review_reward,
      regular_reward,
      coupon_id)
    VALUES (
      menu_total,
      get_delivery_charge_from (
        store_id),
      payment_date,
      delivery_address,
      point_used,
      user_id,
      payment_id,
      store_id,
      delivery_request,
      store_request,
      review_reward,
      regular_reward,
      coupon_id)
  RETURNING
    id
),
update_user_point AS (
  UPDATE
    "user"
  SET
    point = point - point_used
  WHERE
    id = user_id
)
SELECT
  id
FROM
  inserted_order;

$$;

CREATE OR REPLACE FUNCTION create_post (content text, store_id bigint, image_urls text[] DEFAULT NULL, hashtags text[] DEFAULT NULL, out inserted_post_id bigint)
LANGUAGE SQL
AS $$
  WITH inserted_post AS (
    INSERT INTO post (
      content,
      store_id,
      image_urls)
    VALUES (
      content,
      store_id,
      image_urls)
  RETURNING
    id
),
hashtag_input (
  name
) AS (
  SELECT
    unnest(hashtags)
),
inserted_hashtag AS (
  INSERT INTO hashtag (
    name)
  SELECT
    *
  FROM
    hashtag_input
  ON CONFLICT (name)
    DO NOTHING
  RETURNING
    id
),
post_hashtag AS (
  SELECT
    id
  FROM
    inserted_hashtag
  UNION ALL
  SELECT
    hashtag.id
  FROM
    hashtag_input
    JOIN hashtag USING (name)
),
inserted_post_x_hashtag AS (
  INSERT INTO post_x_hashtag (
    post_id,
    hashtag_id)
  SELECT
    inserted_post.id,
    post_hashtag.id
  FROM
    inserted_post,
    post_hashtag
)
SELECT
  id
FROM
  inserted_post;

$$;

CREATE OR REPLACE FUNCTION social_login (_email text, _name text DEFAULT NULL, _phone_number text DEFAULT NULL, _gender text DEFAULT NULL, _birth_date timestamptz DEFAULT NULL, _image_urls text[] DEFAULT NULL, _delivery_addresses text[] DEFAULT NULL, _representative_delivery_address int DEFAULT NULL, _google_oauth text DEFAULT NULL, _naver_oauth text DEFAULT NULL, _kakao_oauth text DEFAULT NULL, out user_id bigint)
LANGUAGE SQL
AS $$
  WITH new_user_id AS (
    INSERT INTO "user" (
      email,
      password_hash_hash,
      name,
      phone_number,
      gender,
      birth_date,
      image_urls,
      delivery_addresses,
      representative_delivery_address,
      google_oauth,
      naver_oauth,
      kakao_oauth)
    VALUES (
      _email,
      'password_hash_hash',
      _name,
      _phone_number,
      _gender,
      _birth_date,
      _image_urls,
      _delivery_addresses,
      _representative_delivery_address,
      _google_oauth,
      _naver_oauth,
      _kakao_oauth)
  ON CONFLICT
    DO NOTHING
  RETURNING
    id)
  SELECT
    id
  FROM
    new_user_id
  UNION
  SELECT
    id
  FROM
    "user"
  WHERE (_email IS NULL
    OR email = _email)
  AND (_google_oauth IS NULL
    OR google_oauth = _google_oauth)
  AND (_naver_oauth IS NULL
    OR naver_oauth = _naver_oauth)
  AND (_kakao_oauth IS NULL
    OR kakao_oauth = _kakao_oauth);

$$;

CREATE PROCEDURE create_order_new (selected_menu_ids bigint[])
LANGUAGE plpgsql
AS $$
DECLARE
  t anycompatable;
BEGIN
  SELECT
    id,
    price,
    store_id
  FROM
    menu INTO t
  WHERE
    id = ANY ($1);
  FOR r IN t LOOP
    RAISE NOTICE '%', r.id;
  END LOOP;
END;
$$;

INSERT INTO "user" (
  email,
  password_hash_hash,
  name,
  phone_number,
  gender,
  birth_date,
  image_urls,
  delivery_addresses,
  representative_delivery_address)
VALUES (
  'asdf@google.com',
  'asdfasdf',
  'name',
  'phone_number',
  'gender',
  '2021-01-01',
  ARRAY['image_url'],
  ARRAY['delivery_address'],
  1);

INSERT INTO payment (
  name)
VALUES (
  'payment1');

SELECT
  create_store ('스노우플라워', '동작구 흑석동', FALSE, 1, ARRAY['크림치즈 타르트 1개', '쇼콜라 카스테라 1개'], ARRAY['콘 프레즐 1개', '플레인 머핀 1개'], 1, 2, ARRAY['https://mp-seoul-image-production-s3.mangoplate.com/879146_1528178423311716.jpg?fit=around|512:512&crop=512:512;*,*&output-format=jpg&output-quality=80'], ARRAY['#얼죽이', '#팥빙수맛집']);

SELECT
  create_store ('프랑세즈', '동작구 흑석동', FALSE, 1, ARRAY['화이트초코 브라우니 1개', '바질치즈스콘 1개'], ARRAY['딸기크림치즈베이글 1개', '소프트빅초코쿠키 1개'], 10, 19, ARRAY['https://gramho.com/hosted-by-instagram/url=https%3A%7C%7C%7C%7Cinstagram.fiev22-2.fna.fbcdn.net%7C%7Cv%7C%7Ct51.2885-19%7C%7Cs150x150%7C%7C68942085_2078724385769327_6993920587278057472_n.jpg%3Ftp%3D1%26_nc_ht%3Dinstagram.fiev22-2.fna.fbcdn.net%26_nc_ohc%3D421zzR11zF0AX9bM85r%26edm%3DABfd0MgBAAAA%26ccb%3D7-4%26oh%3Df371f0534b2ab26c76f633d325e73581%26oe%3D60BBFEF4%26_nc_sid%3D7bff83'], ARRAY['#블루리본맛집', '#빵맛집', '#흑석동빵집', '#100%유기농밀가루']);

SELECT
  create_store ('스타벅스', '동작구 흑석동', TRUE, 1, NULL, NULL, 10, 19, ARRAY['https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png'], ARRAY['#무난', '#인테리어', '#갬성']);

SELECT
  create_store ('디저트정', '동작구 흑석동', FALSE, 1, ARRAY['오토밀레이즌쿠키 2개'], ARRAY['오토밀레이즌쿠키 1개'], 10, 19, ARRAY['https://gramho.com/hosted-by-instagram/url=https%3A%7C%7C%7C%7Cinstagram.fiev22-2.fna.fbcdn.net%7C%7Cv%7C%7Ct51.2885-19%7C%7Cs150x150%7C%7C133784715_672813013398326_5083752991447256061_n.jpg%3Ftp%3D1%26_nc_ht%3Dinstagram.fiev22-2.fna.fbcdn.net%26_nc_ohc%3DkKzoh7bNOMsAX_yPtQp%26edm%3DABfd0MgBAAAA%26ccb%3D7-4%26oh%3Dd3276fb2af511a2070378be742c0d0aa%26oe%3D60BCEDE6%26_nc_sid%3D7bff83'], ARRAY['#디저트맛집', '#딸기프레지에', '#마카롱', '#스콘맛집', '디저트전문점']);

SELECT
  create_store ('조이마카롱', '동작구 흑석동', FALSE, 1, NULL, NULL, 10, 19, ARRAY['https://gramho.com/hosted-by-instagram/url=https%3A%7C%7C%7C%7Cinstagram.flwo4-2.fna.fbcdn.net%7C%7Cv%7C%7Ct51.2885-19%7C%7Cs150x150%7C%7C42004074_177135123188065_7686061194162995200_n.jpg%3Ftp%3D1%26_nc_ht%3Dinstagram.flwo4-2.fna.fbcdn.net%26_nc_ohc%3DLdSWx0FNwwIAX_BKYEx%26edm%3DABfd0MgBAAAA%26ccb%3D7-4%26oh%3Daedda2bcb382c58edcc7197359ce522c%26oe%3D60BB6B74%26_nc_sid%3D7bff83'], ARRAY['#마카롱', '#돼지바마카롱', '#흑석마카롱', '#중앙대마카롱']);

SELECT
  create_store ('앳더블랑', '동작구 흑석동', FALSE, 1, NULL, NULL, 10, 19, ARRAY['https://gramho.com/hosted-by-instagram/url=https%3A%7C%7C%7C%7Cinstagram.flwo4-1.fna.fbcdn.net%7C%7Cv%7C%7Ct51.2885-15%7C%7Csh0.08%7C%7Ce35%7C%7Cs640x640%7C%7C78938102_525987777998121_4789919033269535958_n.jpg%3Ftp%3D1%26_nc_ht%3Dinstagram.flwo4-1.fna.fbcdn.net%26_nc_cat%3D109%26_nc_ohc%3DImwtEl48_ecAX9YnL83%26edm%3DABfd0MgBAAAA%26ccb%3D7-4%26oh%3D2db8d2f1332cca15e66c7571e135de29%26oe%3D60BE5D32%26_nc_sid%3D7bff83'], ARRAY['#마카롱', '#중앙대마카롱', '#꼬끄쫀득']);

SELECT
  create_store ('페이브베이커리', '동작구 흑석동', FALSE, 1, NULL, NULL, 10, 19, ARRAY['https://gramho.com/hosted-by-instagram/url=https%3A%7C%7C%7C%7Cinstagram.flwo4-1.fna.fbcdn.net%7C%7Cv%7C%7Ct51.2885-19%7C%7Cs150x150%7C%7C139738853_899770377434330_7020595757327953624_n.jpg%3Ftp%3D1%26_nc_ht%3Dinstagram.flwo4-1.fna.fbcdn.net%26_nc_ohc%3D9OhzIGgsbzgAX_61RcG%26edm%3DAHG7ALcBAAAA%26ccb%3D7-4%26oh%3Dd12a9c3256f52569a3a93c144eb87ecc%26oe%3D60BEA86A%26_nc_sid%3D5cbaad'], ARRAY['#fave', '#베이커리']);

SELECT
  create_store ('샌드위드', '동작구 흑석동', FALSE, 1, NULL, NULL, 10, 19, ARRAY['https://gramho.com/hosted-by-instagram/url=https%3A%7C%7C%7C%7Cinstagram.flwo4-1.fna.fbcdn.net%7C%7Cv%7C%7Ct51.2885-19%7C%7Cs150x150%7C%7C116604105_293630558532301_5586921821807191993_n.jpg%3Ftp%3D1%26_nc_ht%3Dinstagram.flwo4-1.fna.fbcdn.net%26_nc_ohc%3DIYmRJ8bzBQYAX_AL2kr%26edm%3DAHG7ALcBAAAA%26ccb%3D7-4%26oh%3Dbd66b18bd02800fbe601a7d1779bd842%26oe%3D60BBB6DE%26_nc_sid%3D5cbaad'], ARRAY['#샌드위치', '#커피']);

SELECT
  create_store ('메이카페', '동작구 흑석동', FALSE, 1, NULL, NULL, 10, 19, ARRAY['https://gramho.com/hosted-by-instagram/url=https%3A%7C%7C%7C%7Cinstagram.flwo4-1.fna.fbcdn.net%7C%7Cv%7C%7Ct51.2885-15%7C%7Csh0.08%7C%7Ce35%7C%7Cc0.180.1440.1440a%7C%7Cs640x640%7C%7C153742806_786075462009418_8165076528213687573_n.jpg%3Ftp%3D1%26_nc_ht%3Dinstagram.flwo4-1.fna.fbcdn.net%26_nc_cat%3D110%26_nc_ohc%3Dj61nqkfEw0YAX-IZu3j%26edm%3DAA0rjkIBAAAA%26ccb%3D7-4%26oh%3De8b90111698ac9e933c2970e9cb70f1c%26oe%3D60BCB56F%26_nc_sid%3Dd997c6'], ARRAY['#스무디맛집', '#스무디탑', '#뷰맛집']);

SELECT
  create_store ('콜렉티보', '영등포구 영등포동 타임스퀘어', FALSE, 1, NULL, NULL, 10, 19, ARRAY['data:image/png;base64,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'], ARRAY['#콜렉티보', '#커피']);

SELECT
  create_store ('토크넌센스', '동작구 흑석동', FALSE, 1, NULL, NULL, 10, 19, ARRAY['https://gramho.com/hosted-by-instagram/url=https%3A%7C%7C%7C%7Cinstagram.fiev22-2.fna.fbcdn.net%7C%7Cv%7C%7Ct51.2885-19%7C%7Cs150x150%7C%7C100100744_384820995728409_8267646718623875072_n.jpg%3Ftp%3D1%26_nc_ht%3Dinstagram.fiev22-2.fna.fbcdn.net%26_nc_ohc%3D6vmc9yIXLdoAX-X3vvU%26edm%3DABfd0MgBAAAA%26ccb%3D7-4%26oh%3Da2675129f9ba956b094ea7b758941aca%26oe%3D60BDA0E5%26_nc_sid%3D7bff83'], ARRAY['#강아지고양이동반환영', '#갬성힙합', '#단호박크림치즈케이크']);

SELECT
  create_store ('흑석커피', '동작구 흑석동', FALSE, 1, NULL, NULL, 10, 19, ARRAY['https://gramho.com/hosted-by-instagram/url=https%3A%7C%7C%7C%7Cinstagram.flwo4-2.fna.fbcdn.net%7C%7Cv%7C%7Ct51.2885-19%7C%7Cs150x150%7C%7C89612254_2482370515424880_1547784446860591104_n.jpg%3Ftp%3D1%26_nc_ht%3Dinstagram.flwo4-2.fna.fbcdn.net%26_nc_ohc%3D4fQFRGCyI40AX_b7Zwm%26edm%3DABfd0MgBAAAA%26ccb%3D7-4%26oh%3D84dc5a54aebd24d4f153011023a054c7%26oe%3D60BCD641%26_nc_sid%3D7bff83'], ARRAY['#인테리어맛집', '#사진찍기좋은', '#공부카페']);

SELECT
  create_store ('오후홍콩', '동작구 흑석동', TRUE, 1, NULL, NULL, 10, 19, ARRAY['https://gramho.com/hosted-by-instagram/url=https%3A%7C%7C%7C%7Cinstagram.fiev22-2.fna.fbcdn.net%7C%7Cv%7C%7Ct51.2885-19%7C%7Cs150x150%7C%7C74670575_2232053477086306_7828407066166296576_n.jpg%3Ftp%3D1%26_nc_ht%3Dinstagram.fiev22-2.fna.fbcdn.net%26_nc_ohc%3D8TE39iEHdxIAX9Wx0yx%26edm%3DABfd0MgBAAAA%26ccb%3D7-4%26oh%3D13594cd6c1ad34e1912000fd56f6f166%26oe%3D60BC4BFB%26_nc_sid%3D7bff83'], ARRAY['#뽀로야우', '#오후홍콩', '#밀크티']);

SELECT
  create_store ('베러댄와플', '동작구 흑석동', TRUE, 1, NULL, NULL, 10, 19, ARRAY['https://gramho.com/hosted-by-instagram/url=https%3A%7C%7C%7C%7Cinstagram.flwo4-2.fna.fbcdn.net%7C%7Cv%7C%7Ct51.2885-19%7C%7Cs150x150%7C%7C37403094_234544373846843_3166643782061916160_n.jpg%3Ftp%3D1%26_nc_ht%3Dinstagram.flwo4-2.fna.fbcdn.net%26_nc_ohc%3D9llHimL9O6AAX92Sq8b%26edm%3DAHG7ALcBAAAA%26ccb%3D7-4%26oh%3Dcc1b0bb6bddf96865e47971ef60a308b%26oe%3D60BDA5E1%26_nc_sid%3D5cbaad'], ARRAY['#와플', '#벨기에와플']);

SELECT
  create_store ('띵똥와플', '동작구 흑석동', FALSE, 1, NULL, NULL, 10, 19, ARRAY['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo8Bu6YsXXPkYxgkCG5zQQRFPx6lQ9Um3XxQ&usqp=CAU'], ARRAY['#학교앞와플', '#가성비']);

SELECT
  create_store ('그랩커피', '동작구 흑석동', FALSE, 1, NULL, NULL, 10, 19, ARRAY['https://gramho.com/hosted-by-instagram/url=https%3A%7C%7C%7C%7Cinstagram.flwo4-1.fna.fbcdn.net%7C%7Cv%7C%7Ct51.2885-19%7C%7Cs150x150%7C%7C66715537_1068274296704508_6882066204232515584_n.jpg%3Ftp%3D1%26_nc_ht%3Dinstagram.flwo4-1.fna.fbcdn.net%26_nc_ohc%3DRYXE-2ZCAqAAX9QE6Lj%26edm%3DAHG7ALcBAAAA%26ccb%3D7-4%26oh%3D1c1e5937a8349c74bbb85741ee9c4ce2%26oe%3D60BC8AFA%26_nc_sid%3D5cbaad'], ARRAY['#커피맛집', '#브런치']);

SELECT
  create_store ('스마일꽈배기', '동작구 흑석동', TRUE, 1, NULL, NULL, 10, 19, ARRAY['https://mblogthumb-phinf.pstatic.net/MjAyMDA3MjlfMjQy/MDAxNTk1OTg1ODAwNzUx.wtdCVsi3ovwvKe2Hsd6Spdillfz1ft_4vZ_gtG3lPtcg.jGfhSclKGmI0thYN3hOlE4NYDBUcKCObL-diY0EKBccg.JPEG.hyeminsecond/IMG_8474.JPG?type=w800'], ARRAY['#갓성비', '#마카마카']);

SELECT
  create_store ('리앤홍', '동작구 흑석동', FALSE, 1, NULL, NULL, 10, 19, ARRAY['https://mblogthumb-phinf.pstatic.net/MjAyMDA3MjlfMjQy/MDAxNTk1OTg1ODAwNzUx.wtdCVsi3ovwvKe2Hsd6Spdillfz1ft_4vZ_gtG3lPtcg.jGfhSclKGmI0thYN3hOlE4NYDBUcKCObL-diY0EKBccg.JPEG.hyeminsecond/IMG_8474.JPG?type=w800'], ARRAY['#갓성비', '#마카마카']);

SELECT
  create_store ('언니네식빵', '동작구 흑석동', FALSE, 1, NULL, NULL, 10, 19, ARRAY['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmU2cntJrUQ_l08OhpSE2aB18P6m76BmgSiA&usqp=CAU'], ARRAY['#언니네', '#식빵가게']);

SELECT
  create_store ('뚜스뚜스', '동작구 흑석동', TRUE, 1, NULL, NULL, 10, 19, ARRAY['https://gramho.com/hosted-by-instagram/url=https%3A%7C%7C%7C%7Cinstagram.flwo4-1.fna.fbcdn.net%7C%7Cv%7C%7Ct51.2885-19%7C%7Cs150x150%7C%7C65596671_1329984990503210_532379359755894784_n.jpg%3Ftp%3D1%26_nc_ht%3Dinstagram.flwo4-1.fna.fbcdn.net%26_nc_ohc%3DV6zWQ4X7PJ8AX9AgGwF%26edm%3DAHG7ALcBAAAA%26ccb%3D7-4%26oh%3D0f13414efe3dcfac166eaee25d225835%26oe%3D60BE54A5%26_nc_sid%3D5cbaad'], ARRAY['#베이커리', '#브런치', '#카페']);

SELECT
  create_store ('마얘', '영등포구 여의동 더현대', FALSE, 1, NULL, NULL, 10, 19, ARRAY['https://post-phinf.pstatic.net/MjAyMTAzMDlfNDMg/MDAxNjE1MjcwOTEzMDkx.iKy7VXccfQrXFJ9xcLZfYFD0uRVmKGXBNG2mnVZIoi8g.bncAOnbR4jmo9vf2kYJUuyDE5yobf0IBJK06HJ38g8gg.JPEG/seoultravel_1565899068128458059680254575519669482261410n.jpg?type=w1200'], ARRAY['#디저트천국', '#신규오픈']);

SELECT
  create_store ('나미네양과점', '영등포구 문래동', FALSE, 1, NULL, NULL, 10, 19, ARRAY['https://blogfiles.pstatic.net/MjAyMTA0MTBfMjMx/MDAxNjE4MDI4Mzk3OTI3.OLfRvBjTY62aZV3Lw2zndsPuEIAqXT8HyB4P5WZiT0Qg.g5o0ca3OIX5oYKOQ4QNZMeaIxu4yXB0SrdOofgMEX24g.JPEG.imina74/2021-03-31-13-08-06-268.jpg?type=w2'], ARRAY['#마카롱맛집', '#문래동디저트맛집', '#뚱카롱', '#존맛', '#달달']);

SELECT
  create_store ('브릿지엣지', '동작구 상도동', FALSE, 1, NULL, NULL, 10, 19, ARRAY['https://postfiles.pstatic.net/MjAyMDAyMjNfMjA2/MDAxNTgyNDUxNTMwMTcz.I9I8KLwnx2moUXzkN5PFmS4FIx-psMhuP6Agv9ZC2hUg.B5CsQEIxY2aUAp5EZoQyOOeQIMtxivQxtGJaaw4Km4Qg.JPEG.lisagracie7762/SE-c61185a0-07e4-4ddb-bdb9-337af4449f7d.jpg?type=w966'], ARRAY['#스콘맛집', '#브릿지엣지', '#공정무역커피', '#수제스콘', '#스콘']);

SELECT
  create_store ('플디', '압구정동 압구정로', FALSE, 1, NULL, NULL, 10, 19, ARRAY['https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMTAyMTBfMTIz%2FMDAxNjEyOTMwNDQ2Mjk3.z59nOVeZvFpgma9c0S5zXRwilAvu5FGL8zlycCxFbhcg.bEbuGyY99Vgdf-_lW2UKCqJ8MebT1ATN1vKKVoUzbpog.JPEG.njkmj51%2FIMG_5104.jpg&type=sc960_832'], ARRAY['#디저트맛집', '#plate_d', '#딸기케이크', '#압구정', '#플디']);

SELECT
  create_store ('어글리베이커리', '마포구 망원동', FALSE, 1, NULL, NULL, 15, 20, ARRAY['https://gramho.com/hosted-by-instagram/url=https%3A%7C%7C%7C%7Cinstagram.fiev22-2.fna.fbcdn.net%7C%7Cv%7C%7Ct51.2885-19%7C%7Cs150x150%7C%7C80597625_2342545629368935_267113400641781760_n.jpg%3Ftp%3D1%26_nc_ht%3Dinstagram.fiev22-2.fna.fbcdn.net%26_nc_ohc%3D3viFoOWESBUAX9r6XJD%26edm%3DABfd0MgBAAAA%26ccb%3D7-4%26oh%3D39d161b5342ecaa518df7b620f0e49b3%26oe%3D60BE270A%26_nc_sid%3D7bff83'], ARRAY['#망원동빵대장', '#망원동', '#맘모스빵', '#스콘맛집']);

SELECT
  toggle_user_favorite_store (1, 9);

SELECT
  toggle_user_favorite_store (1, 2);

SELECT
  toggle_user_favorite_store (1, 3);

SELECT
  toggle_user_favorite_store (1, 4);

SELECT
  create_menu ('말차초코맘모스빵', 4000, '빵', 25, ARRAY['https://t1.daumcdn.net/cfile/tistory/9956113D5E3F830718'], ARRAY['#녹차', '#말차', '#초코', '#맘모스빵']);

INSERT INTO menu_option_category (
  name,
  "type",
  is_necessary,
  store_id)
VALUES (
  '생크림 양',
  '단일선택형',
  TRUE,
  25);

INSERT INTO menu_x_menu_option_category (
  menu_id,
  menu_option_category_id)
VALUES (
  1,
  1);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  '적게',
  0,
  1);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  '보통',
  0,
  1);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  '많이',
  0,
  1);

INSERT INTO menu_option_category (
  name,
  "type",
  is_necessary,
  store_id)
VALUES (
  '추가 메뉴',
  '다중선택형',
  FALSE,
  25);

INSERT INTO menu_x_menu_option_category (
  menu_id,
  menu_option_category_id)
VALUES (
  1,
  2);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  '초코 마카롱',
  2000,
  2);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  '딸기 마카롱',
  2000,
  2);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  '아이스 아메리카노',
  2500,
  2);

SELECT
  create_menu ('딸기초코마카롱', 2500, '마카롱', 1, ARRAY['https://img.insight.co.kr/static/2019/12/12/700/6490208yeeh514wh4t0l.jpg'], ARRAY['#딸기', '#초코', '#마카롱', '#봄', '#달콤']);

SELECT
  create_menu ('딸기프레지에', 4500, '케이크', 4, ARRAY['https://gramho.com/hosted-by-instagram/url=https%3A%7C%7C%7C%7Cinstagram.fiev22-1.fna.fbcdn.net%7C%7Cv%7C%7Ct51.2885-15%7C%7Csh0.08%7C%7Ce35%7C%7Cc240.0.960.960a%7C%7Cs640x640%7C%7C158946380_111122944270713_4300751701509533037_n.jpg%3Ftp%3D1%26_nc_ht%3Dinstagram.fiev22-1.fna.fbcdn.net%26_nc_cat%3D109%26_nc_ohc%3DrkCtrjyJxyUAX9Jfowu%26edm%3DABfd0MgBAAAA%26ccb%3D7-4%26oh%3Dc77a4ca2297f632f9d9899e23863f216%26oe%3D60BB3A7D%26_nc_sid%3D7bff83'], ARRAY['#딸기', '#프레지에', '#케이크']);

SELECT
  create_menu ('말차달고나스콘', 3500, '스콘', 1, ARRAY['https://i.pinimg.com/564x/e5/41/d1/e541d1856ab5061172c250225d247ae5.jpg'], ARRAY['#녹차', '#말차', '#달고나', '#비건', '#비건스콘', '#다이어트']);

SELECT
  create_menu ('뽀또 스콘', 4500, '빵', 5, ARRAY['data:image/jpeg;base64,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'], ARRAY['#뽀또', '#개성', '#치즈']);

SELECT
  create_menu ('밀푀유 바니', 9500, '빵', 6, ARRAY['https://post-phinf.pstatic.net/MjAxOTA4MjJfMjc3/MDAxNTY2NDQwMjY4MDA1.iuAYTuWj97NoOtuI5ha2cPrtO0V2zCLv5U8VPe8GNuwg.LMKtLv4P4rU8d3Ow-NBkFZJDNNJMDuES14lsvohKLU4g.JPEG/%EB%B0%80%ED%91%80%EC%9C%A0%EB%B0%94%EB%8B%88.jpg?type=w1200'], ARRAY['#마얘', '#정통프렌치디저트', '#바닐라크림', '#패스츄리', '#고소', '#달달']);

SELECT
  create_menu ('춘천 감자빵', 3000, '빵', 4, ARRAY['https://shop3.daumcdn.net/thumb/R500x500/?fname=http%3A%2F%2Fshop3.daumcdn.net%2Fshophow%2Fp%2FZ12777260102.jpg%3Fut%3D20210329180551'], ARRAY['#춘천', '#감자빵', '#고소', '#으른입맛']);

SELECT
  create_menu ('팥빙수', 5900, '아이스크림', 1, ARRAY['https://cdn.crowdpic.net/list-thumb/thumb_l_F22044335599802DDF4A7ABF5778ACE5.jpg'], ARRAY['#달달', '#시원', '#팥']);

SELECT
  create_menu ('메리딸기', 6500, '음료', 2, ARRAY['https://img1.daumcdn.net/thumb/R720x0/?fname=https%3A%2F%2Ft1.daumcdn.net%2Fliveboard%2Fcemmarketing%2F88cdaed005bf44a6bcb1f228e250458d.jpg'], ARRAY['#달달', '#딸기', '#라떼']);

INSERT INTO menu_option_category (
  name,
  "type",
  is_necessary,
  store_id)
VALUES (
  '사이즈',
  '단일선택형',
  TRUE,
  2);

INSERT INTO menu_x_menu_option_category (
  menu_id,
  menu_option_category_id)
VALUES (
  9,
  3);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  'S (375ml)',
  0,
  3);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  'M (450ml)',
  500,
  3);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  'L (525ml)',
  1000,
  3);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  'XL (700ml)',
  1500,
  3);

INSERT INTO menu_option_category (
  name,
  "type",
  store_id)
VALUES (
  '당도 (기본 100%)',
  '단일선택형',
  2);

INSERT INTO menu_x_menu_option_category (
  menu_id,
  menu_option_category_id)
VALUES (
  9,
  4);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  '0%',
  0,
  4);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  '50%',
  0,
  4);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  '100%',
  0,
  4);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  '150%',
  0,
  4);

INSERT INTO menu_option_category (
  name,
  "type",
  store_id)
VALUES (
  '얼음양 (기본 100%)',
  '단일선택형',
  2);

INSERT INTO menu_x_menu_option_category (
  menu_id,
  menu_option_category_id)
VALUES (
  9,
  5);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  '더 적게',
  0,
  5);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  '적게',
  0,
  5);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  '보통',
  0,
  5);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  '많이',
  0,
  5);

SELECT
  create_menu ('나이트로 콜드 브루 톨', 5800, '음료', 3, ARRAY['https://globalassets.starbucks.com/assets/55525cd1303a4b18958b05f0705b4cbb.jpg?impolicy=1by1_wide_1242'], ARRAY['#거품', '#콜드브루', '#부드러운']);

INSERT INTO menu_option_category (
  name,
  "type",
  is_necessary,
  store_id)
VALUES (
  '사이즈',
  '단일선택형',
  TRUE,
  2);

INSERT INTO menu_x_menu_option_category (
  menu_id,
  menu_option_category_id)
VALUES (
  10,
  6);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  'Tall (355ml)',
  500,
  6);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  'Grande (473ml)',
  1000,
  6);

INSERT INTO menu_option (
  name,
  price,
  category_id)
VALUES (
  'Venti (591ml)',
  1000,
  6);

SELECT
  create_menu ('제주 한라봉 뺑오쇼콜라', 5800, '빵', 3, ARRAY['https://mblogthumb-phinf.pstatic.net/MjAxOTEyMTFfMTQ4/MDAxNTc2MDMxODQ5ODUw.9Dy4J1joxSrAXoqIp-z2HIOqkdyG3oEPP5bRE3E0d7Mg.PAqtcuA6XKqYALGCX-LjsH8RDuxZNXfiYkiGJ2oebcsg.JPEG.zzzzzangg/SE-092ff13a-3dfa-4f66-ae6f-4fbe2f0663b2.jpg?type=w800'], ARRAY['#한라봉필', '#초코스틱', '#패스츄리']);

SELECT
  create_menu ('슈크림 라떼', 3000, '커피', 3, ARRAY['https://cgeimage.commutil.kr/phpwas/restmb_allidxmake.php?idx=3&simg=2021021514073200118b45d942afb10624586229.jpg'], ARRAY['#슈크림', '#달달', '#봄음료', '#달콤']);

SELECT
  create_post ('딸기요거생크림케이크, 딸기미니우유케이크, 초코크런치케이크, 다쿠아즈(앙버터, 초코, 그린티, 핑크소금), 바닐라마카롱, 솔티카라멜마카롱, 스모어쿠키, 클래식월넛, 피넛버터, 말차초코볼, 흑임자마카롱, 크림브륄레마카롱', 4, ARRAY['https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200726_219%2F1595757353365bKuBp_JPEG%2FiT6243NPDzm9e0aPxell_Nsj.jpg&type=sc960_832'], ARRAY['#라인업', '#디저트정']);

SELECT
  create_post ('크로플이랑 디저트소진으로 조금 이른 마감합니다 내일도 찰지게 준비해서 문활짝열겠습니다 주말저녁도 편안하게 푹 쉬세요 ~^^', 2, ARRAY['https://gramho.com/hosted-by-instagram/url=https%3A%7C%7C%7C%7Cinstagram.flwo4-1.fna.fbcdn.net%7C%7Cv%7C%7Ct51.2885-15%7C%7Csh0.08%7C%7Ce35%7C%7Cc0.180.1440.1440a%7C%7Cs640x640%7C%7C170041290_1952282018257270_7366211878204213252_n.jpg%3Ftp%3D1%26_nc_ht%3Dinstagram.flwo4-1.fna.fbcdn.net%26_nc_cat%3D110%26_nc_ohc%3Dmswi8zwKupkAX_CdsFm%26edm%3DAA0rjkIBAAAA%26ccb%3D7-4%26oh%3D671aa3eeb12e57963e4b9931c2d20d40%26oe%3D60BD8134%26_nc_sid%3Dd997c6'], ARRAY['#결과물이', '#두근두근', '#일정']);

SELECT
  create_post ('이달의 쉬어가는 일정입니다! 신메뉴 개발 및 출장등으로 임시휴일이 좀 많습니다. 더 맛있고, 더 건강한 식사빵을 위해 더 노력하고 더 준비하겠습니다. 항상 감사드립니다^^', 7, ARRAY['https://gramho.com/hosted-by-instagram/url=https%3A%7C%7C%7C%7Cinstagram.flwo4-2.fna.fbcdn.net%7C%7Cv%7C%7Ct51.2885-15%7C%7Ce35%7C%7Cc0.74.594.594a%7C%7C169166100_931390371024543_4958946834384681499_n.jpg%3Ftp%3D1%26_nc_ht%3Dinstagram.flwo4-2.fna.fbcdn.net%26_nc_cat%3D103%26_nc_ohc%3DOzTaZL5COEMAX8OPpFD%26edm%3DAA0rjkIBAAAA%26ccb%3D7-4%26oh%3Dbe668239e9b60ee1636b3bec149d1d5e%26oe%3D60BDCF46%26_nc_sid%3Dd997c6'], ARRAY['#심베이커리', '#휴무일정', '#맛있는빵', '#건강한빵', '#깜빠뉴맛집', '#바게트맛집', '#삼전동빵집', '#신메뉴준비중']);

SELECT
  create_post ('🥨 빵긋 :D 행복공작소 🥨\n🕘 9:00 소프트갈릭, 단호박카스테라, 버터스콘, 초코스콘\n🕤 9:30 크로와상,에그타르트.\n🕙10:00 올리브치즈치아바타.\n🕥 10:30 식빵 5종(우유, 밤, 무화과, 올리브, 치즈)\n🍰 보틀케익 3종 (딸기/망고/ 청포도)\n🕥 10:40 홀그레인후랑크,통밀치즈\n🕚 11:00 초코크로와상,누아레장', 8, ARRAY['https://gramho.com/hosted-by-instagram/url=https%3A%7C%7C%7C%7Cinstagram.fiev22-1.fna.fbcdn.net%7C%7Cv%7C%7Ct51.2885-15%7C%7Csh0.08%7C%7Ce35%7C%7Cs640x640%7C%7C182274986_242767324294449_3745014994941802741_n.jpg%3Ftp%3D1%26_nc_ht%3Dinstagram.fiev22-1.fna.fbcdn.net%26_nc_cat%3D109%26_nc_ohc%3DZ7xpqBZAmN8AX-Y5VzP%26edm%3DAA0rjkIBAAAA%26ccb%3D7-4%26oh%3Dd42ec7b8546eebfa1bdc947028774ae6%26oe%3D60BBE316%26_nc_sid%3Dd997c6'], ARRAY['#유기농밀가루', '#천연발효종', '#동물성생크림', '#과일생크림케익', '#식빵']);

SELECT
  create_post ('4월 일정 공지합니다!\n💛 = 베이킹 클래스\n🖤 = 카페 정상 운영 기간\n일정 꼭 확인하셔서 헛걸음 없으시길 바라요🙏🏻\n오늘도 좋은 하루 보내세요 :)', 9, ARRAY['https://scontent-ssn1-1.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/83008531_824166611387598_471126081900830500_n.jpg'], ARRAY['#공지', '#일정', '#플디', '#plate_d']);

