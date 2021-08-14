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

CREATE TABLE store_x_hashtag(
  store_id bigint REFERENCES store ON DELETE CASCADE,
  hashtag_id bigint REFERENCES hashtag ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (store_id, hashtag_id)
);

CREATE TABLE menu_x_hashtag(
  menu_id bigint REFERENCES menu ON DELETE CASCADE,
  hashtag_id bigint REFERENCES hashtag ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (menu_id, hashtag_id)
);

CREATE TABLE news_x_hashtag(
  store_id bigint REFERENCES store ON DELETE CASCADE,
  hashtag_id bigint REFERENCES hashtag ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (store_id, hashtag_id)
);

CREATE TABLE feed_x_hashtag(
  store_id bigint REFERENCES store ON DELETE CASCADE,
  hashtag_id bigint REFERENCES hashtag ON DELETE CASCADE,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  --
  PRIMARY KEY (store_id, hashtag_id)
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
hashtag_id (id) AS (
  SELECT hashtag.id
  FROM hashtag_name
    JOIN hashtag USING (name)
),
inserted__store_x_hashtag AS (
  INSERT INTO store_x_hashtag (store_id, hashtag_id)
  SELECT inserted_store.id,
    hashtag_id.id
  FROM inserted_store,
    hashtag_id
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
) LANGUAGE SQL AS $$ WITH inserted_menu AS(
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

),
hashtag_name (name) AS (
  SELECT unnest(hashtags)
),
inserted_hashtag AS (
  INSERT INTO hashtag (name)
  SELECT *
  FROM hashtag_name ON CONFLICT (name) DO NOTHING
),
hashtag_id (id) AS (
  SELECT hashtag.id
  FROM hashtag_name
    JOIN hashtag USING (name)
),
inserted__menu_x_hashtag AS (
  INSERT INTO menu_x_hashtag (menu_id, hashtag_id)
  SELECT inserted_menu.id,
    hashtag_id.id
  FROM inserted_menu,
    hashtag_id
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
  image_urls text [] DEFAULT NULL,
  hashtags text [] DEFAULT NULL,
  out news_id bigint
) LANGUAGE SQL AS $$ WITH inserted_news AS(
  INSERT INTO news (title, contents, category, store_id, image_urls)
  VALUES (title, contents, category, store_id, image_urls)
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
hashtag_id (id) AS (
  SELECT hashtag.id
  FROM hashtag_name
    JOIN hashtag USING (name)
),
inserted__news_x_hashtag AS (
  INSERT INTO news_x_hashtag (news_id, hashtag_id)
  SELECT inserted_news.id,
    hashtag_id.id
  FROM inserted_news,
    hashtag_id
),
inserted__ AS ()
SELECT id
FROM inserted_news;

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
) LANGUAGE SQL AS $$ WITH inserted_feed AS(
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
hashtag_id (id) AS (
  SELECT hashtag.id
  FROM hashtag_name
    JOIN hashtag USING (name)
),
inserted__feed_x_hashtag AS (
  INSERT INTO feed_x_hashtag (feed_id, hashtag_id)
  SELECT inserted_feed.id,
    hashtag_id.id
  FROM inserted_feed,
    hashtag_id
)
SELECT id
FROM inserted_feed;

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

SELECT create_user(
    'bok6@sindy.com',
    '12345',
    '김진효',
    '010-4135-6866',
    2,
    '디저트 조아해요',
    '1997-10-16',
    'https://storage.googleapis.com/sobok/%EA%B9%80%EC%A7%84%ED%9A%A8.webp'
  );

SELECT create_user(
    'bok7@sindy.com',
    '12345',
    '곽욱태',
    '010-6827-9124',
    1,
    '유당불내증. 두유 커피가 최고!',
    '1997-10-06',
    'https://storage.googleapis.com/sobok/%EA%B3%BD%EC%9A%B1%ED%83%9C.webp'
  );

SELECT create_user(
    'bok8@sindy.com',
    '12345',
    '박현수',
    '010-7869-3665',
    2,
    '그곳에 마카롱이 있다면 어디든!',
    '1998-12-04',
    'https://storage.googleapis.com/sobok/%EB%B0%95%ED%98%84%EC%88%98.webp'
  );

SELECT create_user(
    'bok9@sindy.com',
    '12345',
    '김호민',
    '010-5980-7644',
    1,
    '주호민 아니고 김호민',
    '1997-05-05',
    'https://storage.googleapis.com/sobok/%EA%B9%80%ED%98%B8%EB%AF%BC.webp'
  );

SELECT create_user(
    'bok10@sindy.com',
    '12345',
    '기우현',
    '010-2395-6730',
    1,
    '내마음이 기우는 곳으로.',
    '1996-12-09',
    'https://storage.googleapis.com/sobok/%EA%B8%B0%ED%98%84%EC%9A%B0.webp'
  );

SELECT create_store(
    '디저트정',
    '흑석동',
    '서울 동작구 서달로14길 42',
    ARRAY [1, 7],
    false,
    '0507-1329-4338',
    '0000000000',
    '수제로 만든 정성 가득한 디저트를 판매합니다',
    array ['9:00 ~ 17:00'],
    NULL,
    array ['https://postfiles.pstatic.net/MjAyMDEwMjdfNzIg/MDAxNjAzNzgxNTQ5MDQ3.R1QJOe01vP9iYh8iXMq7iMNgp65eYJm1qqTgvn6D5F4g.PObKW3w8lQOxz5_TSJG8griA_j5szovbMuBuRXELmmIg.JPEG.jjypink81/SE-03706234-a54c-4685-85ee-0f677b29bf61.jpg?type=w773','https://postfiles.pstatic.net/MjAyMDEwMjdfMjky/MDAxNjAzNzgxNTQxMzQ2.mb2L2V5jgVjq2kBrIqHdYUv-WqxmgliYRelH5po4Wy8g.n7bH95FFsQYKPWMG3HxBhvIDMZTlTgTD_yPjqdkWVpcg.JPEG.jjypink81/SE-9ab9b0bb-949e-48b5-978a-b2c79301978d.jpg?type=w773', 'https://postfiles.pstatic.net/MjAyMDEwMjdfMjky/MDAxNjAzNzgxNTQxMzQ2.mb2L2V5jgVjq2kBrIqHdYUv-WqxmgliYRelH5po4Wy8g.n7bH95FFsQYKPWMG3HxBhvIDMZTlTgTD_yPjqdkWVpcg.JPEG.jjypink81/SE-9ab9b0bb-949e-48b5-978a-b2c79301978d.jpg?type=w773, https://postfiles.pstatic.net/MjAyMDEwMjdfNzIg/MDAxNjAzNzgxNTQ5MDQ3.R1QJOe01vP9iYh8iXMq7iMNgp65eYJm1qqTgvn6D5F4g.PObKW3w8lQOxz5_TSJG8griA_j5szovbMuBuRXELmmIg.JPEG.jjypink81/SE-03706234-a54c-4685-85ee-0f677b29bf61.jpg?type=w773'],
    NULL,
    array ['수제', '케이크' '아기자기' '테이블적음']
  )
SELECT create_store(
    '뚜스뚜스 흑석역점',
    '흑석동',
    '서울 동작구 현충로 75 원불교기념관 1층',
    ARRAY [0, 7],
    false,
    '0507-1426-9027',
    '0000000000',
    '브런치도 판매하는 빵 맛집',
    array ['7:00 ~ 10:00'],
    NULL,
    array ['https://postfiles.pstatic.net/MjAyMDAxMjFfMjQ4/MDAxNTc5NTY1MzkwMzQ3.gOx8j-FYxnxfseIOxd3TjaadGuqUsRhBPxvCtTf4jPog.k0n5hdse9XDzaBM_JrY58jaM4Bw-JwrADsb_ZGKXY1Qg.JPEG.shl992/SE-33ee3c5f-a114-4dfe-95cf-8c5e47233eb4.jpg?type=w966', 'https://postfiles.pstatic.net/MjAyMDAxMjFfMTc3/MDAxNTc5NTM1MjE1OTAx.fUYPF_Jbj83uRJsPc0RQ9HTgxLqbdlK2KxJpY0r_FX0g.BDlXxzYNkX_mihe0iD2t8S25AUIBEPdwNwjLip1V-SIg.JPEG.shl992/IMG_4554.jpg?type=w966', 'https://postfiles.pstatic.net/MjAyMDAxMjFfMTA3/MDAxNTc5NTY1MzU3MjIx.IhfWMypmOssGevgnUmWRTOV5YwU38QtxTidIx0h8208g.ChxGj03jeJSHqMIMBCezieJukvWBbwjnVXsQ7eNEPCIg.JPEG.shl992/SE-b6e797ed-e762-4937-8182-6fc8d20fa352.jpg?type=w966'],
    NULL,
    array ['주차편리', '넓다', '주문안받음', '샐러드시들', '좌석넓음']
  )
SELECT create_store(
    '프랑세즈',
    '흑석동',
    '서울 동작구 현충로 96',
    ARRAY [1,2,3],
    false,
    '02-825-5265',
    '0000000000',
    '유기농 밀가루 100%를 사용하며, 방부제를 사용하지 않는 빵집. 냉동 빵이 아니며, 생반죽으로 빵을 구워낸다. 자연 친화적인 발효종을 배양시켜 장시간 발효시키기 때문에, 빵 고유의 맛을 더욱 풍부하게 느낄 수 있다. 빵 안에 단팥과 호두가 가득 들어서, 고소한 레드빈스틱이 인기가 많다.',
    array ['09:30 - 21:30'],
    NULL,
    array ['https://postfiles.pstatic.net/MjAxOTAxMDVfMjU0/MDAxNTQ2NjgzOTI1NjIy.4xyJ--np-r5bcma0u4JmFvAS1rNpZbzuvuKtdWjG7VUg.AEqEWFhVkndCm62VoD-TCPX2sy7C-UeXqv12g_HB2pAg.JPEG.5sh417/KakaoTalk_20190105_190320699.jpg?type=w966', 'https://postfiles.pstatic.net/MjAxOTAxMDVfMjI2/MDAxNTQ2NjgzOTI1NDQy.Qbs4f0xSAXlxPdCbPD1Ghrb04naEc3ldmvUOePrjyNAg.2fhQAX1by1OwCihDhDvyVKl1e-n2QkNPgXtGUrJQkjAg.JPEG.5sh417/KakaoTalk_20190105_190308312.jpg?type=w966', 'https://postfiles.pstatic.net/MjAxOTAxMDVfMjYg/MDAxNTQ2NjgzOTI1NTIw.iRgAZoKFPxCHEhWXarwboF4o4tPHzpBoSEllJC9TxSsg.XFcY5IwxpwCQx8OeQ4PFe0V-41zSUVrhXh_6R7iB3-og.JPEG.5sh417/KakaoTalk_20190105_190307511.jpg?type=w966'],
    NULL,
    array ['친절', '따끈따끈', '보름달빵', '케이크']
  )
SELECT create_store(
    'LITITCOFFEE',
    '상도동',
    '서울 동작구 상도로47바길 48 1층',
    ARRAY [1,3],
    false,
    '070-8866-4344',
    '0000000000',
    '친절하고 공부하기 좋은 힙한 느낌의 카페',
    array ['10:00 ~ 01:00'],
    NULL,
    array ['https://postfiles.pstatic.net/MjAxODEwMjlfMTQw/MDAxNTQwNzkyNjQwMTUz.Izj58h5ZYdp-Ickpm6lUVB4ZWnxudAjbf7-lTsN-wYQg.HZQL8l0de78g0wpVJWE5Lwo_0Gb9yhGWJnXIXUSA_AAg.JPEG.cuyss/IMG_3846.jpg?type=w580, https://postfiles.pstatic.net/MjAxODEwMjlfOTEg/MDAxNTQwNzkyNjM5NTcz.55popOEnNuYOPQsVb1ScVAzKV9zdyeBglF_fmOPURHkg.KGaDAeolGyLlrJxq7gQJA4PK2RswIe7jm1MrJvDjgNkg.JPEG.cuyss/IMG_3844.jpg?type=w580', 'https://postfiles.pstatic.net/MjAxODEwMjlfMzcg/MDAxNTQwNzkyNjQwNzM2.P60hkdEXQ3be0U86DD5OK_Cnz9VsgY7dcK3PCdj22bsg.e84zLRubKj1mYXvRrtRTN-La73X9W9tSZrN2Pf9ajAwg.JPEG.cuyss/IMG_3850.jpg?type=w580'],
    NULL,
    array ['레모네이드','디저트','더치커피','소금커피']
  )
SELECT create_store(
    '그랩커피&브런치',
    '흑석동',
    '서울 동작구 흑석로8길 12 1층',
    ARRAY [3,4,5,6,7],
    false,
    '0507-1330-7209',
    '0000000000',
    '친절하고 공부하기 좋은 힙한 느낌의 카페',
    array ['10:00 ~ 22:00'],
    array ['일'],
    array ['https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20201212_253%2F1607755828928OXgIn_JPEG%2Fupload_73a904bb014476a9cf50fcbd68ca2930.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxOTA3MjVfMTI5%2FMDAxNTYzOTgyNTc3MDUz.ZZeM1uDNAyzQ9UPNhkXhiU-Eo3TQtQHcYP3u93dm4u4g.HHNXtVx5L6jQHIimVDO8xxBrPIGqY8WOeZvQFCdu0LEg.JPEG.herb8777%2F8.JPG', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20200922_131%2F1600745850236DV8Tl_JPEG%2Fupload_c1164979a2bc20a5c18718f574492aba.jpg'],
    NULL,
    array ['레모네이드', '디저트','더치커피','소금커피']
  )
SELECT create_store(
    '라임플레쉬카페',
    '흑석동',
    '서울 동작구 흑석동13가길 29',
    ARRAY [1,7],
    false,
    '02-6398-6787',
    '0000000000',
    '공부하거나 모임 하기 좋은 장소',
    array ['08:00 - 23:00'],
    NULL,
    array ['https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20200522_186%2F1590106167237R9Mft_JPEG%2Fupload_14591cf734e0bc0909d63cf4f86c2a75.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20200509_165%2F15890140395473gPLC_JPEG%2Fupload_ad2ed381ce07bec0c87186d358320a90.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20200827_48%2F1598515685368mikNB_JPEG%2Fupload_80ff969d5c9d7da70fc64dda11096f09.jpg'],
    NULL,
    array ['친절','탁트인','과일','휴식']
  )
SELECT create_store(
    '이공커피',
    '흑석동',
    '서울 동작구 서달로 151',
    ARRAY [2,4],
    false,
    '02-826-9194',
    '0000000000',
    '제주 감성을 담아낸 이로운 커피',
    array ['08:00 - 22:00'],
    NULL,
    array ['https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20210511_81%2F1620724833936X4F65_JPEG%2Fupload_0d8d1684794e0b1ff7bd1d33c66e30cd.jpeg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20210517_121%2F1621234458351F9M47_JPEG%2Fupload_eef610840b8bcb5fe33c83b3696431ba.jpeg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20210517_5%2F1621234506060O8tQb_JPEG%2Fupload_3b203844ff7f60a3399780c98cfef19d.jpeg'],
    NULL,
    array ['가성비 좋은','다양한 디저트','시원한']
  )
SELECT create_store(
    '터방내',
    '흑석동',
    '서울 동작구 흑석로 101-7',
    ARRAY [3],
    false,
    '02-813-4434',
    '0000000000',
    '7080 감성 카페, 옛날 다방 감성',
    array ['11:00 - 24:00'],
    NULL,
    array ['https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20210310_287%2F1615368900173WzeHg_JPEG%2Fupload_25c18d2d26cea23ad9850442997a829b.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20201014_49%2F1602641896802HHVDv_JPEG%2Fupload_0be84a7187d0f5c201340a4e1a2c9e9a.jpeg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20201013_188%2F1602572741414VaNmU_JPEG%2Fupload_3e04af6838f31cdf7f36753643aff8da.jpeg'],
    NULL,
    array ['옛날감성','분위기 좋은','어두운','친절한']
  )
SELECT create_store(
    '토크넌센스',
    '흑석동',
    '서울 동작구 흑석로8길 7',
    ARRAY [3],
    false,
    '0507-1405-8858',
    '0000000000',
    '토크가 맛있는 카페',
    array ['12:00 - 22:00'],
    array ['일'],
    array ['https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDEyMjNfMjA1%2FMDAxNjA4NzE5MjMxNjM1.mrnNHA6pxPRKDT1R1PtCq71xPj8C_LxlggtwOEeNb2Mg.CUi6AbZOVk9u0URMOydFIIXXZ84Pe4G0UTq3JwzEENgg.JPEG.nare3030%2FIMG_3859.jpg, https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDExMDNfMjU4%2FMDAxNjA0MzM3MzI4NTc5.IpkHgj_3wQPn98Oukxt0jlv-sxVHhvgyUi-gGUc3OUQg.dzqqFsA8qw4zMexVDtt1AVOgC4ss-6VVc39Yu3sBdBcg.JPEG.aacad85%2FIMG_2955.JPG', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDA5MTRfODUg%2FMDAxNjAwMDkzNDM5MDk0.5VRa8NVX2yf6MbCxz7Nt02gjMi8yi_ylb7klJ-IBQXgg.cSVniEigsoTgx42mA4QZL5hIu9kn4ESE31PMcI9q29gg.JPEG.kohyoeunhong%2FIMG_4001.jpg'],
    NULL,
    array ['힙한','치즈','와인','케이크']
  )
SELECT create_store(
    '흑석커피',
    '흑석동',
    '서울 동작구 서달로 14가길 5 1층',
    ARRAY [1,2,4],
    false,
    '0507-1317-9267',
    '0000000000',
    '조용하고 색다른 메뉴가 있는 카페',
    array ['10:00 - 22:00'],
    array ['일'],
    array ['https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20200812_81%2F1597223302326skrLs_JPEG%2Fupload_888e4e8977d7c4b98da4365f06c75852.jpeg', 'https://map.naver.com/v5/search/%ED%9D%91%EC%84%9D%EC%BB%A4%ED%94%BC/place/1944466175?c=14132535.8417378,4510098.5160541,15,0,0,0,dh&placePath=%3Fentry%253Dpll','https://map.naver.com/v5/search/%ED%9D%91%EC%84%9D%EC%BB%A4%ED%94%BC/place/1944466175?c=14132535.8417378,4510098.5160541,15,0,0,0,dh&placePath=%3Fentry%253Dpll'],
    NULL,
    array ['분위기가 좋은','디저트 맛집','통유리']
  )
SELECT create_menu(
    '아메리카노',
    4100,
    array ['https://storage.googleapis.com/sobok/%EC%95%84%EC%95%84.webp'],
    3,
    1,
    array ['씁쓸']
  )