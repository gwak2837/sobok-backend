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
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW(),
  email varchar(50) NOT NULL UNIQUE,
  password_hash_hash text NOT NULL,
  name varchar(50) NOT NULL,
  gender char(1) NOT NULL DEFAULT '해당없음',
  is_email_verified boolean NOT NULL DEFAULT FALSE,
  --
  bio varchar(50),
  phone varchar(32),
  birth date,
  image_urls text[],
  delivery_addresses varchar(64)[],
  representative_delivery_address int CHECK (representative_delivery_address >= 1),
  google_oauth text UNIQUE,
  naver_oauth text UNIQUE,
  kakao_oauth text UNIQUE,
  --
  valid_authentication_date timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE store (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE menu (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE news (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE feed (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW()
);

CREATE TABLE comment (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creation_time timestamptz NOT NULL DEFAULT NOW(),
  modification_time timestamptz NOT NULL DEFAULT NOW()
);

