-- public 스키마 삭제 후 생성
DROP SCHEMA public CASCADE;

CREATE SCHEMA public AUTHORIZATION sindy;

COMMENT ON SCHEMA public IS 'standard public schema';

GRANT ALL ON SCHEMA public TO PUBLIC;

GRANT ALL ON SCHEMA public TO sindy;

-- deleted 스키마 삭제 후 생성
DROP SCHEMA deleted CASCADE;

CREATE SCHEMA deleted AUTHORIZATION sindy;

COMMENT ON SCHEMA deleted IS 'deleted records history';

GRANT ALL ON SCHEMA deleted TO sindy;

-- logout_time 이전 JWT 토큰은 유효하지 않음
CREATE TABLE "user" (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  email varchar(50) NOT NULL UNIQUE,
  password_hash text NOT NULL,
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
  --
  description text,
  business_hours text,
  holiday text,
  image_urls text[]
);

CREATE TABLE menu (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  name varchar(50) NOT NULL,
  price int NOT NULL,
  image_urls text[] NOT NULL,
  store_id bigint NOT NULL REFERENCES store ON DELETE CASCADE
);

CREATE TABLE news (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  title varchar(100) NOT NULL,
  contents text[] NOT NULL,
  category varchar(10) NOT NULL, -- 나중에 int로 바꾸고 enum으로 맵핑도 가능
  store_id bigint NOT NULL REFERENCES store ON DELETE CASCADE,
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
  store_id bigint NOT NULL REFERENCES store ON DELETE CASCADE,
  menu_id bigint NOT NULL REFERENCES menu ON DELETE CASCADE
);

CREATE TABLE comment (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  contents text[] NOT NULL,
  user_id bigint NOT NULL REFERENCES "user" ON DELETE CASCADE,
  feed_id bigint NOT NULL REFERENCES feed ON DELETE CASCADE
);

