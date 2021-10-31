-- public 스키마 삭제 후 생성
DROP SCHEMA IF EXISTS public CASCADE;

CREATE SCHEMA public AUTHORIZATION sindy;

COMMENT ON SCHEMA public IS 'standard public schema';

GRANT ALL ON SCHEMA public TO PUBLIC;

GRANT ALL ON SCHEMA public TO sindy;

-- deleted 스키마 삭제 후 생성
DROP SCHEMA IF EXISTS deleted CASCADE;

CREATE SCHEMA deleted AUTHORIZATION sindy;

COMMENT ON SCHEMA deleted IS 'deleted records history';

GRANT ALL ON SCHEMA deleted TO sindy;

-- logout_time 이전 JWT 토큰은 유효하지 않음
CREATE TABLE "user" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique_name varchar(50) NOT NULL UNIQUE,
  email varchar(50) NOT NULL UNIQUE,
  name varchar(50) NOT NULL,
  phone varchar(20),
  gender int NOT NULL DEFAULT 0,
  is_email_verified boolean NOT NULL DEFAULT FALSE,
  is_star_user boolean NOT NULL DEFAULT FALSE,
  bio varchar(50),
  birth date,
  image_url text,
  nickname varchar(50),
  feed_count int NOT NULL DEFAULT 0,
  follower_count int NOT NULL DEFAULT 0,
  following_count int NOT NULL DEFAULT 0,
  --
  google_oauth text UNIQUE,
  naver_oauth text UNIQUE,
  kakao_oauth text UNIQUE,
  password_hash text NOT NULL,
  logout_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- user_id: 매장 소유자
CREATE TABLE store (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name varchar(50) NOT NULL,
  town varchar(20) NOT NULL,
  address varchar(50) NOT NULL,
  point point NOT NULL,
  categories int [] NOT NULL,
  tel varchar(20) UNIQUE,
  registration_number char(10) UNIQUE,
  description text,
  business_hours text [],
  holidays date [],
  image_urls text [],
  --
  user_id uuid REFERENCES "user" ON DELETE CASCADE,
  --
  UNIQUE (name, address)
);

-- store_id: 메뉴가 속한 매장
CREATE TABLE menu (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name varchar(50) NOT NULL,
  price int NOT NULL,
  is_sold_out boolean NOT NULL,
  image_urls text [] NOT NULL,
  category int NOT NULL,
  description text,
  --
  store_id bigint NOT NULL REFERENCES store ON DELETE CASCADE
);

CREATE TABLE news (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title varchar(100) NOT NULL,
  contents text [] NOT NULL,
  category int NOT NULL,
  image_urls text [],
  --
  store_id bigint NOT NULL REFERENCES store ON DELETE CASCADE
);

-- user_id: 피드를 작성한 사용자
-- store_id: 피드에 태그된 매장
CREATE TABLE feed (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  rating int NOT NULL,
  contents text [] NOT NULL,
  image_urls text [] NOT NULL,
  like_count int NOT NULL DEFAULT 0,
  comment_count int NOT NULL DEFAULT 0,
  store_id bigint NOT NULL REFERENCES store ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES "user" ON DELETE CASCADE
);

CREATE TABLE trend (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  category int NOT NULL,
  title varchar(100) NOT NULL,
  contents text [] NOT NULL,
  user_id uuid NOT NULL REFERENCES "user" ON DELETE CASCADE
);

CREATE TABLE "comment" (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  contents text [] NOT NULL,
  image_url text,
  --
  comment_id bigint REFERENCES "comment" ON DELETE CASCADE,
  feed_id bigint NOT NULL REFERENCES feed ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES "user" ON DELETE CASCADE
);

-- type: 0 = 매장, 1 = 메뉴
CREATE TABLE bucket (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name varchar(50) NOT NULL,
  "type" int NOT NULL,
  user_id uuid NOT NULL REFERENCES "user" ON DELETE CASCADE
);

CREATE TABLE hashtag (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name varchar(50) NOT NULL UNIQUE
);

CREATE TABLE user_x_liked_store (
  user_id uuid REFERENCES "user" ON DELETE CASCADE,
  store_id bigint REFERENCES store ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (user_id, store_id)
);

CREATE TABLE user_x_liked_menu (
  user_id uuid REFERENCES "user" ON DELETE CASCADE,
  menu_id bigint REFERENCES menu ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (user_id, menu_id)
);

CREATE TABLE user_x_liked_feed (
  user_id uuid REFERENCES "user" ON DELETE CASCADE,
  feed_id bigint REFERENCES feed ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (user_id, feed_id)
);

CREATE TABLE user_x_liked_news (
  user_id uuid REFERENCES "user" ON DELETE CASCADE,
  news_id bigint REFERENCES news ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (user_id, news_id)
);

CREATE TABLE user_x_liked_comment (
  user_id uuid REFERENCES "user" ON DELETE CASCADE,
  comment_id bigint REFERENCES "comment" ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (user_id, comment_id)
);

CREATE TABLE user_x_liked_trend (
  user_id uuid REFERENCES "user" ON DELETE CASCADE,
  trend_id bigint REFERENCES trend ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (user_id, trend_id)
);

CREATE TABLE bucket_x_store (
  bucket_id bigint REFERENCES bucket ON DELETE CASCADE,
  store_id bigint REFERENCES store ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (bucket_id, store_id)
);

CREATE TABLE bucket_x_menu (
  bucket_id bigint REFERENCES bucket ON DELETE CASCADE,
  menu_id bigint REFERENCES menu ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (bucket_id, menu_id)
);

CREATE TABLE leader_user_x_follower_user (
  leader_user_id uuid REFERENCES "user" ON DELETE CASCADE,
  follower_user_id uuid REFERENCES "user" ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (leader_user_id, follower_user_id)
);

-- x, y: 사진에서 태그된 x, y 위치
-- nth_image: 태그된 사진 번호
CREATE TABLE news_x_tagged_menu (
  news_id bigint REFERENCES news ON DELETE CASCADE,
  menu_id bigint REFERENCES menu ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  x int NOT NULL,
  y int NOT NULL,
  nth_image int NOT NULL,
  --
  PRIMARY KEY (news_id, menu_id)
);

-- x, y: 사진에서 태그된 x, y 위치
-- nth_image: 태그된 사진 번호
CREATE TABLE feed_x_rated_menu (
  feed_id bigint REFERENCES feed ON DELETE CASCADE,
  menu_id bigint REFERENCES menu ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  x int NOT NULL,
  y int NOT NULL,
  nth_image int NOT NULL,
  --
  PRIMARY KEY (feed_id, menu_id)
);

CREATE TABLE store_x_hashtag (
  store_id bigint REFERENCES store ON DELETE CASCADE,
  hashtag_id bigint REFERENCES hashtag ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (store_id, hashtag_id)
);

CREATE TABLE menu_x_hashtag (
  menu_id bigint REFERENCES menu ON DELETE CASCADE,
  hashtag_id bigint REFERENCES hashtag ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (menu_id, hashtag_id)
);

CREATE TABLE feed_x_hashtag (
  feed_id bigint REFERENCES feed ON DELETE CASCADE,
  hashtag_id bigint REFERENCES hashtag ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  --
  PRIMARY KEY (feed_id, hashtag_id)
);

CREATE TABLE deleted."user" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deletion_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  email varchar(50) NOT NULL UNIQUE,
  name varchar(50) NOT NULL,
  phone varchar(20),
  gender char(4) NOT NULL DEFAULT '해당없음',
  is_email_verified boolean NOT NULL DEFAULT FALSE,
  is_star_user boolean NOT NULL DEFAULT FALSE,
  --
  bio varchar(50),
  birth date,
  image_url text,
  --
  google_oauth text UNIQUE,
  naver_oauth text UNIQUE,
  kakao_oauth text UNIQUE
);

CREATE TABLE deleted.store (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name varchar(50) NOT NULL,
  registration_number char(10) NOT NULL UNIQUE,
  town varchar(20) NOT NULL,
  address varchar(50) NOT NULL,
  tel varchar(20) NOT NULL UNIQUE,
  --
  description text,
  business_hours text [],
  holidays char(1) [],
  image_urls text [],
  user_id uuid REFERENCES deleted."user" ON DELETE CASCADE
);

CREATE TABLE deleted.menu (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name varchar(50) NOT NULL,
  price int NOT NULL,
  image_urls text [] NOT NULL,
  description text,
  store_id bigint NOT NULL REFERENCES deleted.store ON DELETE CASCADE
);

CREATE TABLE deleted.news (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  title varchar(100) NOT NULL,
  contents text [] NOT NULL,
  category int NOT NULL,
  store_id bigint NOT NULL REFERENCES deleted.store ON DELETE CASCADE,
  --
  image_urls text []
);

-- user_id: 피드를 작성한 사용자
-- store_id: 피드에 태그된 매장
CREATE TABLE deleted.feed (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  rating int NOT NULL,
  contents text [] NOT NULL,
  image_urls text [] NOT NULL,
  like_count int NOT NULL DEFAULT 0,
  user_id uuid NOT NULL REFERENCES deleted."user" ON DELETE CASCADE,
  store_id bigint NOT NULL REFERENCES deleted.store ON DELETE CASCADE
);

CREATE TABLE deleted.comment (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  contents text [] NOT NULL,
  user_id uuid NOT NULL REFERENCES deleted."user" ON DELETE CASCADE,
  feed_id bigint NOT NULL REFERENCES deleted.feed ON DELETE CASCADE
);

CREATE TABLE deleted.bucket (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modification_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name varchar(50) NOT NULL,
  "type" int NOT NULL,
  user_id uuid NOT NULL REFERENCES "user" ON DELETE CASCADE
);

CREATE TABLE deleted.hashtag (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name varchar(50) NOT NULL UNIQUE
);

CREATE FUNCTION create_user (
  unique_name varchar(50),
  email varchar(50),
  password_hash text,
  name varchar(50),
  phone varchar(20),
  gender int,
  bio varchar(50) DEFAULT NULL,
  birth date DEFAULT NULL,
  image_url text DEFAULT NULL,
  nickname varchar(50) DEFAULT NULL,
  out user_id uuid,
  out user_unique_name varchar(50)
) LANGUAGE plpgsql AS $$
DECLARE identifier text [] := ARRAY [unique_name, email];

BEGIN PERFORM
FROM "user"
WHERE "user".email = ANY(identifier)
  OR "user".unique_name = ANY(identifier);

IF found THEN RETURN;

END IF;

INSERT INTO "user" (
    unique_name,
    email,
    name,
    phone,
    gender,
    bio,
    birth,
    image_url,
    nickname,
    password_hash
  )
VALUES (
    unique_name,
    email,
    name,
    phone,
    gender,
    bio,
    birth,
    image_url,
    nickname,
    password_hash
  )
RETURNING "user".id,
  "user".unique_name INTO user_id,
  user_unique_name;

INSERT INTO bucket (name, "type", user_id)
VALUES ('기본', 0, user_id);

INSERT INTO bucket (name, "type", user_id)
VALUES ('기본', 1, user_id);

END $$;

CREATE FUNCTION create_store (
  name varchar(50),
  town varchar(20),
  address varchar(50),
  point point,
  categories int [],
  tel varchar(20) DEFAULT NULL,
  registration_number char(10) DEFAULT NULL,
  description text DEFAULT NULL,
  business_hours text [] DEFAULT NULL,
  holidays date [] DEFAULT NULL,
  image_urls text [] DEFAULT NULL,
  user_id uuid DEFAULT NULL,
  hashtags text [] DEFAULT NULL,
  out store_id bigint
) LANGUAGE SQL AS $$ WITH inserted_store (id) AS (
  INSERT INTO store (
      name,
      town,
      address,
      point,
      categories,
      tel,
      registration_number,
      description,
      business_hours,
      holidays,
      image_urls,
      user_id
    )
  VALUES (
      name,
      town,
      address,
      point,
      categories,
      tel,
      registration_number,
      description,
      business_hours,
      holidays,
      image_urls,
      user_id
    )
  RETURNING id
),
hashtag_name (name) AS (
  SELECT unnest(hashtags)
),
new_hashtag_id (id) AS (
  INSERT INTO hashtag (name)
  SELECT name
  FROM hashtag_name ON CONFLICT (name) DO NOTHING
  RETURNING id
),
existing_hashtag_id (id) AS (
  SELECT hashtag.id
  FROM hashtag_name
    JOIN hashtag USING (name)
),
inserted__store_x_hashtag AS (
  INSERT INTO store_x_hashtag (store_id, hashtag_id)
  SELECT inserted_store.id,
    hashtag_union.id
  FROM inserted_store,
    (
      SELECT id
      FROM existing_hashtag_id
      UNION
      SELECT id
      FROM new_hashtag_id
    ) AS hashtag_union
)
SELECT id
FROM inserted_store;

$$;

CREATE FUNCTION create_menu (
  name varchar(50),
  price int,
  is_sold_out boolean,
  image_urls text [],
  category int,
  store_id bigint,
  hashtags text [] DEFAULT NULL,
  out menu_id bigint
) LANGUAGE SQL AS $$ WITH inserted_menu (id) AS (
  INSERT INTO menu (
      name,
      price,
      is_sold_out,
      image_urls,
      category,
      store_id
    )
  VALUES (
      name,
      price,
      is_sold_out,
      image_urls,
      category,
      store_id
    )
  RETURNING id
),
hashtag_name (name) AS (
  SELECT unnest(hashtags)
),
new_hashtag_id (id) AS (
  INSERT INTO hashtag (name)
  SELECT name
  FROM hashtag_name ON CONFLICT (name) DO NOTHING
  RETURNING id
),
existing_hashtag_id (id) AS (
  SELECT hashtag.id
  FROM hashtag_name
    JOIN hashtag USING (name)
),
inserted__menu_x_hashtag AS (
  INSERT INTO menu_x_hashtag (menu_id, hashtag_id)
  SELECT inserted_menu.id,
    hashtag_union.id
  FROM inserted_menu,
    (
      SELECT id
      FROM existing_hashtag_id
      UNION
      SELECT id
      FROM new_hashtag_id
    ) AS hashtag_union
)
SELECT id
FROM inserted_menu;

$$;

CREATE FUNCTION create_news (
  title varchar(100),
  contents text [],
  category int,
  store_id bigint,
  menu_ids bigint [] DEFAULT NULL,
  xs int [] DEFAULT NULL,
  ys int [] DEFAULT NULL,
  nth_images int [] DEFAULT NULL,
  image_urls text [] DEFAULT NULL,
  out news_id bigint
) LANGUAGE SQL AS $$ WITH inserted_news (id) AS (
  INSERT INTO news (title, contents, category, store_id, image_urls)
  VALUES (title, contents, category, store_id, image_urls)
  RETURNING id
),
tagged_menu (id, x, y, nth) AS (
  SELECT unnest(menu_ids),
    unnest(xs),
    unnest(ys),
    unnest(nth_images)
),
inserted__news_x_tagged_menu AS (
  INSERT INTO news_x_tagged_menu (news_id, menu_id, x, y, nth_image)
  SELECT inserted_news.id,
    tagged_menu.id,
    tagged_menu.x,
    tagged_menu.y,
    tagged_menu.nth
  FROM inserted_news,
    tagged_menu
)
SELECT id
FROM inserted_news;

$$;

CREATE FUNCTION create_feed (
  rating int,
  contents text [],
  image_urls text [],
  like_count int,
  user_id uuid,
  store_id bigint,
  menu_ids bigint [] DEFAULT NULL,
  xs int [] DEFAULT NULL,
  ys int [] DEFAULT NULL,
  nth_images int [] DEFAULT NULL,
  hashtags text [] DEFAULT NULL,
  out feed_id bigint
) LANGUAGE SQL AS $$ WITH inserted_feed (id) AS (
  INSERT INTO feed (
      rating,
      contents,
      image_urls,
      like_count,
      user_id,
      store_id
    )
  VALUES (
      rating,
      contents,
      image_urls,
      like_count,
      user_id,
      store_id
    )
  RETURNING id
),
hashtag_name (name) AS (
  SELECT unnest(hashtags)
),
new_hashtag_id (id) AS (
  INSERT INTO hashtag (name)
  SELECT name
  FROM hashtag_name ON CONFLICT (name) DO NOTHING
  RETURNING id
),
existing_hashtag_id (id) AS (
  SELECT hashtag.id
  FROM hashtag_name
    JOIN hashtag USING (name)
),
inserted__feed_x_hashtag AS (
  INSERT INTO feed_x_hashtag (feed_id, hashtag_id)
  SELECT inserted_feed.id,
    hashtag_union.id
  FROM inserted_feed,
    (
      SELECT id
      FROM existing_hashtag_id
      UNION
      SELECT id
      FROM new_hashtag_id
    ) AS hashtag_union
),
tagged_menu (id, x, y, nth) AS (
  SELECT unnest(menu_ids),
    unnest(xs),
    unnest(ys),
    unnest(nth_images)
),
inserted__feed_x_rated_menu AS (
  INSERT INTO feed_x_rated_menu (feed_id, menu_id, x, y, nth_image)
  SELECT inserted_feed.id,
    tagged_menu.id,
    tagged_menu.x,
    tagged_menu.y,
    tagged_menu.nth
  FROM inserted_feed,
    tagged_menu
)
SELECT id
FROM inserted_feed;

$$;

CREATE FUNCTION create_comment (
  contents text [],
  user_id uuid,
  feed_id bigint,
  image_url text DEFAULT NULL,
  comment_id bigint DEFAULT NULL,
  out comment_id bigint
) LANGUAGE SQL AS $$
INSERT INTO "comment" (
    contents,
    user_id,
    feed_id,
    image_url,
    comment_id
  )
VALUES (
    contents,
    user_id,
    feed_id,
    image_url,
    comment_id
  )
RETURNING id;

$$;

CREATE PROCEDURE create_bucket (
  _name varchar(50),
  user_id uuid,
  INOUT bucket_id bigint DEFAULT NULL
) LANGUAGE plpgsql AS $$ BEGIN PERFORM
FROM bucket
WHERE name = _name;

IF found THEN RETURN;

END IF;

INSERT INTO bucket (name, user_id)
VALUES (_name, user_id)
RETURNING id INTO bucket_id;

END $$;

CREATE FUNCTION create_trend (
  category int,
  title varchar(100),
  contents text [],
  user_id uuid,
  OUT trend_id bigint
) LANGUAGE SQL AS $$
INSERT INTO trend (category, title, contents, user_id)
VALUES (category, title, contents, user_id)
RETURNING id;

$$;

CREATE PROCEDURE toggle_liked_store (
  _user_id uuid,
  _store_id bigint,
  INOUT result boolean DEFAULT FALSE
) LANGUAGE plpgsql AS $$ BEGIN PERFORM
FROM user_x_liked_store
WHERE user_id = _user_id
  AND store_id = _store_id;

IF FOUND THEN
DELETE FROM user_x_liked_store
WHERE user_id = _user_id
  AND store_id = _store_id;

COMMIT;

result = FALSE;

ELSE
INSERT INTO user_x_liked_store (user_id, store_id)
VALUES (_user_id, _store_id);

COMMIT;

result = TRUE;

END IF;

END;

$$;

CREATE PROCEDURE toggle_liked_menu (
  _user_id uuid,
  _menu_id bigint,
  INOUT result boolean DEFAULT FALSE
) LANGUAGE plpgsql AS $$ BEGIN PERFORM
FROM user_x_liked_menu
WHERE user_id = _user_id
  AND menu_id = _menu_id;

IF FOUND THEN
DELETE FROM user_x_liked_menu
WHERE user_id = _user_id
  AND menu_id = _menu_id;

COMMIT;

result = FALSE;

ELSE
INSERT INTO user_x_liked_menu (user_id, menu_id)
VALUES (_user_id, _menu_id);

COMMIT;

result = TRUE;

END IF;

END;

$$;

CREATE PROCEDURE toggle_liked_feed (
  _user_id uuid,
  _feed_id bigint,
  INOUT result boolean DEFAULT FALSE
) LANGUAGE plpgsql AS $$ BEGIN PERFORM
FROM user_x_liked_feed
WHERE user_id = _user_id
  AND feed_id = _feed_id;

IF FOUND THEN
DELETE FROM user_x_liked_feed
WHERE user_id = _user_id
  AND feed_id = _feed_id;

COMMIT;

result = FALSE;

ELSE
INSERT INTO user_x_liked_feed (user_id, feed_id)
VALUES (_user_id, _feed_id);

COMMIT;

result = TRUE;

END IF;

END;

$$;

CREATE PROCEDURE toggle_liked_news (
  _user_id uuid,
  _news_id bigint,
  INOUT result boolean DEFAULT FALSE
) LANGUAGE plpgsql AS $$ BEGIN PERFORM
FROM user_x_liked_news
WHERE user_id = _user_id
  AND news_id = _news_id;

IF FOUND THEN
DELETE FROM user_x_liked_news
WHERE user_id = _user_id
  AND news_id = _news_id;

COMMIT;

result = FALSE;

ELSE
INSERT INTO user_x_liked_news (user_id, news_id)
VALUES (_user_id, _news_id);

COMMIT;

result = TRUE;

END IF;

END;

$$;

CREATE PROCEDURE toggle_liked_comment (
  _user_id uuid,
  _comment_id bigint,
  INOUT result boolean DEFAULT FALSE
) LANGUAGE plpgsql AS $$ BEGIN PERFORM
FROM user_x_liked_comment
WHERE user_id = _user_id
  AND comment_id = _comment_id;

IF FOUND THEN
DELETE FROM user_x_liked_comment
WHERE user_id = _user_id
  AND comment_id = _comment_id;

COMMIT;

result = FALSE;

ELSE
INSERT INTO user_x_liked_comment (user_id, comment_id)
VALUES (_user_id, _comment_id);

COMMIT;

result = TRUE;

END IF;

END;

$$;

CREATE PROCEDURE toggle_liked_trend (
  _user_id uuid,
  _trend_id bigint,
  INOUT result boolean DEFAULT NULL
) LANGUAGE plpgsql AS $$ BEGIN PERFORM
FROM user_x_liked_trend
WHERE user_id = _user_id
  AND trend_id = _trend_id;

IF FOUND THEN
DELETE FROM user_x_liked_trend
WHERE user_id = _user_id
  AND trend_id = _trend_id;

COMMIT;

result = FALSE;

ELSE
INSERT INTO user_x_liked_trend (user_id, trend_id)
VALUES (_user_id, _trend_id);

COMMIT;

result = TRUE;

END IF;

END;

$$;

CREATE PROCEDURE toggle_menu_bucket_list (
  _user_id uuid,
  _menu_id bigint,
  _bucket_id bigint DEFAULT NULL,
  INOUT result text DEFAULT NULL
) LANGUAGE plpgsql AS $$
DECLARE selected_bucket_ids bigint [];

BEGIN
SELECT array_agg(id) INTO selected_bucket_ids
FROM bucket
WHERE user_id = _user_id;

IF NOT found
OR _bucket_id != ALL(selected_bucket_ids) THEN result = '사용자가 해당 버켓을 소유하고 있지 않습니다.';

RETURN;

END IF;

PERFORM
FROM bucket_x_menu
WHERE bucket_id = _bucket_id
  AND menu_id = _menu_id;

IF FOUND THEN
DELETE FROM bucket_x_menu
WHERE bucket_id = _bucket_id
  AND menu_id = _menu_id;

COMMIT;

result = 'F';

ELSE
INSERT INTO bucket_x_menu (bucket_id, menu_id)
VALUES (_bucket_id, _menu_id);

COMMIT;

result = 'T';

END IF;

END $$;

CREATE PROCEDURE toggle_store_bucket_list (
  _user_id uuid,
  _store_id bigint,
  _bucket_id bigint DEFAULT NULL,
  INOUT result text DEFAULT NULL
) LANGUAGE plpgsql AS $$
DECLARE selected_bucket_ids bigint [];

BEGIN
SELECT array_agg(id) INTO selected_bucket_ids
FROM bucket
WHERE user_id = _user_id;

IF NOT found
OR _bucket_id != ALL(selected_bucket_ids) THEN result = '사용자가 해당 버켓을 소유하고 있지 않습니다.';

RETURN;

END IF;

PERFORM
FROM bucket_x_store
WHERE bucket_id = _bucket_id
  AND store_id = _store_id;

IF FOUND THEN
DELETE FROM bucket_x_store
WHERE bucket_id = _bucket_id
  AND store_id = _store_id;

COMMIT;

result = 'F';

ELSE
INSERT INTO bucket_x_store (bucket_id, store_id)
VALUES (_bucket_id, _store_id);

COMMIT;

result = 'T';

END IF;

END $$;

CREATE PROCEDURE toggle_following_user (
  _leader_user_id uuid,
  _follower_user_id uuid,
  INOUT result text DEFAULT NULL
) LANGUAGE plpgsql AS $$ BEGIN PERFORM
FROM leader_user_x_follower_user
WHERE leader_user_id = _leader_user_id
  AND follower_user_id = _follower_user_id;

IF FOUND THEN
DELETE FROM leader_user_x_follower_user
WHERE leader_user_id = _leader_user_id
  AND follower_user_id = _follower_user_id;

COMMIT;

result = 'F';

ELSE
INSERT INTO leader_user_x_follower_user (leader_user_id, follower_user_id)
VALUES (_leader_user_id, _follower_user_id);

COMMIT;

result = 'T';

END IF;

END $$;

CREATE FUNCTION verify_user_bucket(
  bucket_id bigint,
  bucket_type int,
  user_unique_name varchar(50),
  _user_id uuid DEFAULT NULL
) RETURNS bigint LANGUAGE plpgsql STABLE AS $$
DECLARE selected_bucket_user record;

BEGIN
SELECT bucket.user_id,
  bucket."type",
  "user".unique_name
FROM bucket
  JOIN "user" ON "user".id = bucket.user_id INTO selected_bucket_user
WHERE bucket.id = bucket_id;

IF NOT FOUND THEN RETURN 1;

END IF;

IF selected_bucket_user.type != bucket_type THEN RETURN 2;

END IF;

IF selected_bucket_user.unique_name != user_unique_name THEN RETURN 3;

END IF;

IF _user_id IS NULL THEN RETURN 4;

END IF;

IF selected_bucket_user.user_id != _user_id THEN RETURN 4;

END IF;

RETURN 0;

END $$;