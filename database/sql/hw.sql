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
  );

SELECT create_news (
    '디졍 애플망고우유',
    array ['딸기가 끝나서 아쉽지만 여름에는 망고를 새로 출시했습니다.곧 복숭아우유도 출시할거에요 ~~'],
    1,
    1,
    NULL,
    array ['https://storage.googleapis.com/sobok/%EB%94%94%EC%A0%80%ED%8A%B8%EC%A0%95.webp'],
    array ['']
  );

SELECT create_news (
    '아메리카노 증정 이벤트',
    array ['20,000원 이상 구매시 아메리카노 증정드립니다.'],
    2,
    2,
    NULL,
    array ['https://storage.googleapis.com/sobok/%EB%9A%9C%EC%8A%A4%EB%9A%9C%EC%8A%A4.webp'],
    array ['']
  );

SELECT create_news (
    '긴급!긴급! 메뉴 소진',
    array ['다쿠아즈, 브륄레류 디저트 메뉴가 모두 소진되었어요!'],
    4,
    3,
    NULL,
    array ['https://storage.googleapis.com/sobok/%ED%94%84%EB%9E%91%EC%84%B8%EC%A6%88.webp'],
    array ['']
  );

SELECT create_news (
    '처음으로 만들어본 인스타 HOT메뉴 출시!',
    array ['코로나로 시간이 많아져서 새로운 쿠키들 4종류 판매합니다.'],
    1,
    4,
    NULL,
    array ['https://storage.googleapis.com/sobok/%EB%A6%BF%EC%9E%87%EC%BB%A4%ED%94%BC.webp'],
    array ['']
  );

SELECT create_news (
    'Summer 신메뉴 출시!',
    array ['오늘부터 여름한정메뉴 수박쥬스 판매를 시작해요! 고창에서 온 꿀수박만 사용합니다!'],
    1,
    5,
    NULL,
    array ['https://storage.googleapis.com/sobok/%EA%B7%B8%EB%9E%A9%EC%BB%A4%ED%94%BC%26%EB%B8%8C%EB%9F%B0%EC%B9%98.webp'],
    array ['']
  );

SELECT create_news (
    '라떼 주문 불가',
    array ['우유 소진으로 라떼류 메뉴 주문은 제한됩니다. 죄송해요~'],
    4,
    6,
    NULL,
    array ['https://storage.googleapis.com/sobok/%EB%9D%BC%EC%9E%84%ED%94%8C%EB%A0%88%EC%89%AC%EC%B9%B4%ED%8E%98.webp'],
    array ['']
  );

SELECT create_news (
    '흑임자 라떼 출시',
    array ['맛도 건강도 좋은 흑임자라떼! 한달간의 연구끝에 오늘 출시했습니다!'],
    1,
    7,
    NULL,
    array ['https://storage.googleapis.com/sobok/%EC%9D%B4%EA%B3%B5%EC%BB%A4%ED%94%BC.webp'],
    array ['']
  );

SELECT create_news (
    '한시간 빨리 닫아요 ㅠㅠ',
    array ['금일 사장님 개인사정으로 한시간 단축 영업합니다! 09:00 ~ 20:00'],
    3,
    8,
    NULL,
    array ['https://storage.googleapis.com/sobok/%ED%84%B0%EB%B0%A9%EB%82%B4.webp'],
    array ['']
  );

SELECT create_news (
    '디저트 마감 할인!',
    array ['마감까지 두시간! 모든 디저트 메뉴 20% 할인 중 입니다~'],
    2,
    9,
    NULL,
    array ['https://storage.googleapis.com/sobok/9.webp'],
    array ['']
  );

SELECT create_news (
    '방역 관련',
    array ['흑석커피는 코로나 예방을 위해 매일 매일 매장과 식기를 소독을 하고 있습니다.'],
    3,
    10,
    NULL,
    array ['https://storage.googleapis.com/sobok/%ED%9D%91%EC%84%9D%EC%BB%A4%ED%94%BC.webp'],
    array ['']
  );

SELECT create_feed(
    3,
    array ['커피 맛 굳굳!! 사장님이 너무 친절하셔요 :) 흑석동 최고의 카페! '],
    array ['https://storage.googleapis.com/sobok/%EB%A6%AC%EB%B7%B0%EC%98%90%EB%A1%9C%EC%9A%B0%EC%BB%A4%ED%94%BC.webp'],
    32,
    1,
    10,
    array [34],
    array ['해시태그'],
  );