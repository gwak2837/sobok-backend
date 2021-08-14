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
  business_hours text,
  holiday text,
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

CREATE TABLE COMMENT (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  contents text [] NOT NULL,
  user_id bigint NOT NULL REFERENCES "user" ON DELETE CASCADE,
  feed_id bigint NOT NULL REFERENCES feed ON DELETE CASCADE,
  --
  image_url text,
  comment_id bigint REFERENCES COMMENT ON DELETE CASCADE
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
  business_hours text,
  holiday text,
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
  business_hours text DEFAULT NULL,
  holiday text DEFAULT NULL,
  image_urls text [] DEFAULT NULL,
  user_id bigint DEFAULT NULL,
  out store_id bigint
) LANGUAGE SQL AS $$
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
    holiday,
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
    holiday,
    image_urls,
    user_id
  )
RETURNING id;

$$;

CREATE FUNCTION create_menu (
  name varchar(50),
  price int,
  image_urls text [],
  category int,
  store_id bigint,
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