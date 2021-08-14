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
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  email varchar(50) NOT NULL UNIQUE,
  name varchar(50) NOT NULL,
  phone varchar(20),
  gender int NOT NULL DEFAULT 0,
  is_email_verified boolean NOT NULL DEFAULT FALSE,
  is_star_user boolean NOT NULL DEFAULT FALSE,
  --
  bio varchar(50),
  birth date,
  image_url text,
  --
  google_oauth text UNIQUE,
  naver_oauth text UNIQUE,
  kakao_oauth text UNIQUE,
  password_hash text NOT NULL,
  logout_time timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE store (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  name varchar(50) NOT NULL,
  town varchar(20) NOT NULL,
  address varchar(50) NOT NULL,
  categories int [] NOT NULL,
  takeout boolean NOT NULL DEFAULT FALSE,
  --
  tel varchar(20) UNIQUE,
  registration_number char(10) UNIQUE,
  description text,
  business_hours text [],
  holidays char(1) [],
  image_urls text [],
  user_id bigint REFERENCES "user" ON DELETE CASCADE -- 매장 소유자
);

CREATE TABLE menu (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  name varchar(50) NOT NULL,
  price int NOT NULL,
  image_urls text [] NOT NULL,
  category int NOT NULL,
  store_id bigint NOT NULL REFERENCES store ON DELETE CASCADE -- 매장에 있는 메뉴
);

CREATE TABLE news (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  title varchar(100) NOT NULL,
  contents text [] NOT NULL,
  category int NOT NULL,
  store_id bigint NOT NULL REFERENCES store ON DELETE CASCADE,
  --
  image_urls text []
);

-- user_id: 피드를 작성한 사용자
-- store_id: 피드에 태그된 매장
CREATE TABLE feed (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  rating int NOT NULL,
  contents text [] NOT NULL,
  image_urls text [] NOT NULL,
  like_count int NOT NULL DEFAULT 0,
  user_id bigint NOT NULL REFERENCES "user" ON DELETE CASCADE,
  store_id bigint NOT NULL REFERENCES store ON DELETE CASCADE
);

CREATE TABLE "comment" (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  contents text [] NOT NULL,
  user_id bigint NOT NULL REFERENCES "user" ON DELETE CASCADE,
  feed_id bigint NOT NULL REFERENCES feed ON DELETE CASCADE,
  --
  image_url text,
  comment_id bigint REFERENCES "comment" ON DELETE CASCADE
);

CREATE TABLE hashtag (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  name varchar(50) NOT NULL UNIQUE
);

CREATE TABLE user_x_liked_store (
  user_id bigint REFERENCES "user" ON DELETE CASCADE,
  store_id bigint REFERENCES store ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (user_id, store_id)
);

CREATE TABLE user_x_liked_menu (
  user_id bigint REFERENCES "user" ON DELETE CASCADE,
  menu_id bigint REFERENCES menu ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (user_id, menu_id)
);

CREATE TABLE user_x_store_bucket_list (
  user_id bigint REFERENCES "user" ON DELETE CASCADE,
  store_id bigint REFERENCES store ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (user_id, store_id)
);

CREATE TABLE user_x_menu_bucket_list (
  user_id bigint REFERENCES "user" ON DELETE CASCADE,
  menu_id bigint REFERENCES menu ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (user_id, menu_id)
);

CREATE TABLE leader_user_x_follower_user (
  leader_user_id bigint REFERENCES "user" ON DELETE CASCADE,
  follower_user_id bigint REFERENCES "user" ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (leader_user_id, follower_user_id)
);

CREATE TABLE news_x_tagged_menu (
  news_id bigint REFERENCES news ON DELETE CASCADE,
  menu_id bigint REFERENCES menu ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (news_id, menu_id)
);

CREATE TABLE feed_x_rated_menu (
  feed_id bigint REFERENCES feed ON DELETE CASCADE,
  menu_id bigint REFERENCES menu ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (feed_id, menu_id)
);

CREATE TABLE deleted."user" (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  deletion_time timestamptz NOT NULL DEFAULT NOW(),
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
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  name varchar(50) NOT NULL,
  registration_number char(10) NOT NULL UNIQUE,
  town varchar(20) NOT NULL,
  address varchar(50) NOT NULL,
  tel varchar(20) NOT NULL UNIQUE,
  takeout boolean NOT NULL DEFAULT FALSE,
  --
  description text,
  business_hours text [],
  holidays char(1) [],
  image_urls text [],
  user_id bigint REFERENCES deleted."user" ON DELETE CASCADE -- 매장 소유자
);

CREATE TABLE deleted.menu (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  name varchar(50) NOT NULL,
  price int NOT NULL,
  image_urls text [] NOT NULL,
  store_id bigint NOT NULL REFERENCES deleted.store ON DELETE CASCADE -- 메뉴가 있는 매장
);

CREATE TABLE deleted.news (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
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
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  rating int NOT NULL,
  contents text [] NOT NULL,
  image_urls text [] NOT NULL,
  like_count int NOT NULL DEFAULT 0,
  user_id bigint NOT NULL REFERENCES deleted."user" ON DELETE CASCADE,
  store_id bigint NOT NULL REFERENCES deleted.store ON DELETE CASCADE,
  menu_id bigint NOT NULL REFERENCES deleted.menu ON DELETE CASCADE -- 피드에 태그된 메뉴
);

CREATE TABLE deleted.comment (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  contents text [] NOT NULL,
  user_id bigint NOT NULL REFERENCES deleted."user" ON DELETE CASCADE,
  feed_id bigint NOT NULL REFERENCES deleted.feed ON DELETE CASCADE
);

CREATE TABLE deleted.hashtag (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  name varchar(50) NOT NULL UNIQUE
);

CREATE FUNCTION create_user (
  email varchar(50),
  password_hash text,
  name varchar(50),
  phone varchar(20),
  gender int,
  bio varchar(50) DEFAULT NULL,
  birth date DEFAULT NULL,
  image_url text DEFAULT NULL,
  out user_id bigint
) LANGUAGE SQL AS $$
INSERT INTO "user" (
    email,
    name,
    phone,
    gender,
    bio,
    birth,
    image_url,
    password_hash
  )
VALUES (
    email,
    name,
    phone,
    gender,
    bio,
    birth,
    image_url,
    password_hash
  )
RETURNING id;

$$;

CREATE FUNCTION create_store (
  name varchar(50),
  town varchar(20),
  address varchar(50),
  categories int [],
  takeout boolean DEFAULT false,
  tel varchar(20) DEFAULT NULL,
  registration_number char(10) DEFAULT NULL,
  description text DEFAULT NULL,
  business_hours text [] DEFAULT NULL,
  holidays char(1) [] DEFAULT NULL,
  image_urls text [] DEFAULT NULL,
  user_id bigint DEFAULT NULL,
  hashtags text [] DEFAULT NULL,
  out store_id bigint
) LANGUAGE SQL AS $$ WITH inserted_store AS(
  INSERT INTO store (
      name,
      town,
      address,
      categories,
      takeout,
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
      categories,
      takeout,
      tel,
      registration_number,
      description,
      business_hours,
      holidays,
      image_urls,
      user_id
    )
  RETURNING id;

),
hashtag_name (name) AS (
  SELECT unnest(hashtags)
),
inserted_hashtag AS (
  INSERT INTO hashtag (name)
  SELECT *
  FROM hashtag_name ON CONFLICT (name) DO NOTHING
),
store_all_hashtag (id) AS (
  SELECT hashtag.id
  FROM hashtag_name
    JOIN hashtag USING (name)
),
inserted__store_x_hashtags AS (
  INSERT INTO store_x_hashtag (store_id, hashtag_id)
  SELECT inserted_store.id,
    store_all_hashtag.id
  FROM inserted_store,
    store_all_hashtag
)
SELECT id
FROM inserted_store;

$$;

CREATE FUNCTION create_menu (
  name varchar(50),
  price int,
  image_urls text [],
  category int,
  store_id bigint,
  hashtags text [] DEFAULT NULL,
  out menu_id bigint
) LANGUAGE SQL AS $$
INSERT INTO menu (
    name,
    price,
    image_urls,
    category,
    store_id
  )
VALUES (
    name,
    price,
    image_urls,
    category,
    store_id
  )
RETURNING id;

$$;

CREATE FUNCTION create_news (
  title varchar(100),
  contents text [],
  category int,
  store_id bigint,
  menu_ids bigint [] DEFAULT NULL,
  image_urls text [] DEFAULT NULL,
  hashtags text [] DEFAULT NULL,
  out news_id bigint
) LANGUAGE SQL AS $$
INSERT INTO news (title, contents, category, store_id)
VALUES (title, contents, category, store_id)
RETURNING id;

$$;

CREATE FUNCTION create_feed (
  rating int,
  contents text [],
  image_urls text [],
  like_count int,
  user_id bigint,
  store_id bigint,
  menu_ids bigint [] DEFAULT NULL,
  hashtags text [] DEFAULT NULL,
  out feed_id bigint
) LANGUAGE SQL AS $$
INSERT INTO news (
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
RETURNING id;

$$;

CREATE FUNCTION create_comment (
  contents text [],
  user_id bigint,
  feed_id bigint,
  image_url text,
  comment_id bigint,
  out comment_id bigint
) LANGUAGE SQL AS $$
INSERT INTO news (
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

SELECT create_user(
    'bok1@sindy.com',
    '12345',
    '김효진',
    '010-6866-4135',
    2,
    '세상의 모든 디저트를 정복할꺼야!',
    '1997-06-10',
    'https://storage.googleapis.com/sobok/%EA%B9%80%ED%9A%A8%EC%A7%84.webp'
  );

SELECT create_user(
    'bok2@sindy.com',
    '12345',
    '곽태욱',
    '010-9203-2837',
    1,
    '크로플 같은 남자',
    '1998-04-12',
    'https://storage.googleapis.com/sobok/%EA%B3%BD%ED%83%9C%EC%9A%B1.webp'
  );

SELECT create_user(
    'bok3@sindy.com',
    '12345',
    '박수현',
    '010-4536-7393',
    2,
    '대구의 모든 맛집!',
    '1997-05-05',
    'https://storage.googleapis.com/sobok/%EB%B0%95%EC%88%98%ED%98%84.webp'
  );

SELECT create_user(
    'bok4@sindy.com',
    '12345',
    '김민호',
    '010-7644-5980',
    1,
    '디저트에 빠진 자취남(자아도취남)',
    '1996-09-12',
    'https://storage.googleapis.com/sobok/%EA%B9%80%EB%AF%BC%ED%98%B8.webp'
  );

SELECT create_user(
    'bok5@sindy.com',
    '12345',
    '기현우',
    '010-2563-6996',
    1,
    '아재입맛, 집 근처만 다닙니다',
    '1995-01-14',
    'https://storage.googleapis.com/sobok/%EA%B8%B0%EC%9A%B0%ED%98%84.webp'
  );