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
  gender char(4) NOT NULL DEFAULT '해당없음',
  phone varchar(20),
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
  registration_number char(10) NOT NULL UNIQUE,
  town varchar(20) NOT NULL,
  address varchar(50) NOT NULL,
  tel varchar(20) NOT NULL UNIQUE,
  takeout boolean NOT NULL DEFAULT FALSE,
  categories int[] NOT NULL,
  --
  description text,
  business_hours text,
  holiday text,
  image_urls text[],
  user_id bigint REFERENCES "user" ON DELETE CASCADE -- 매장 소유자
);

CREATE TABLE menu (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  name varchar(50) NOT NULL,
  price int NOT NULL,
  image_urls text[] NOT NULL,
  category int NOT NULL,
  store_id bigint NOT NULL REFERENCES store ON DELETE CASCADE -- 매장에 있는 메뉴
);

CREATE TABLE news (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  title varchar(100) NOT NULL,
  contents text[] NOT NULL,
  category int NOT NULL,
  store_id bigint NOT NULL REFERENCES store ON DELETE CASCADE, -- 소식을 작성한 매장
  --
  image_urls text[]
);

CREATE TABLE feed (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  rating int NOT NULL,
  contents text[] NOT NULL,
  like_count int NOT NULL DEFAULT 0,
  image_urls text[] NOT NULL,
  user_id bigint NOT NULL REFERENCES "user" ON DELETE CASCADE,
  store_id bigint NOT NULL REFERENCES store ON DELETE CASCADE
);

CREATE TABLE comment (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  contents text[] NOT NULL,
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
  gender char(4) NOT NULL DEFAULT '해당없음',
  phone varchar(20),
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
  image_urls text[],
  user_id bigint REFERENCES deleted."user" ON DELETE CASCADE -- 매장 소유자
);

CREATE TABLE deleted.menu (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  name varchar(50) NOT NULL,
  price int NOT NULL,
  image_urls text[] NOT NULL,
  store_id bigint NOT NULL REFERENCES deleted.store ON DELETE CASCADE -- 메뉴가 있는 매장
);

CREATE TABLE deleted.news (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  title varchar(100) NOT NULL,
  contents text[] NOT NULL,
  category int NOT NULL,
  store_id bigint NOT NULL REFERENCES deleted.store ON DELETE CASCADE, -- 소식을 작성한 매장
  --
  image_urls text[]
);

CREATE TABLE deleted.feed (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  rating int NOT NULL,
  contents text[] NOT NULL,
  like_count int NOT NULL DEFAULT 0,
  image_urls text[] NOT NULL,
  user_id bigint NOT NULL REFERENCES deleted."user" ON DELETE CASCADE, -- 피드를 작성한 사용자
  store_id bigint NOT NULL REFERENCES deleted.store ON DELETE CASCADE, -- 피드에 태그된 매장
  menu_id bigint NOT NULL REFERENCES deleted.menu ON DELETE CASCADE -- 피드에 태그된 메뉴
);

CREATE TABLE deleted.comment (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  contents text[] NOT NULL,
  user_id bigint NOT NULL REFERENCES deleted."user" ON DELETE CASCADE,
  feed_id bigint NOT NULL REFERENCES deleted.feed ON DELETE CASCADE
);

CREATE TABLE deleted.hashtag (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  name varchar(50) NOT NULL UNIQUE
);

