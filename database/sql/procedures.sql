DO language plpgsql $$
DECLARE r boolean;

t text;

rec record;

user1_id uuid;

user2_id uuid;

user3_id uuid;

user4_id uuid;

user5_id uuid;

user6_id uuid;

user7_id uuid;

user8_id uuid;

user9_id uuid;

user10_id uuid;

BEGIN -- 비밀번호: sobok123!
SELECT user_id INTO user1_id
FROM create_user (
    'bok',
    'bok@sindy.in',
    '$2a$10$NJ3fjKrUx3rYz1YXGPFfPOz4uLkXId3VD23gKbtxBMeECxMWeYjh.',
    '김효진',
    '010-6866-4135',
    2,
    '세상의 모든 디저트를 정복할꺼야!',
    '1997-06-10',
    'https://storage.googleapis.com/sobok/%EA%B9%80%ED%9A%A8%EC%A7%84.webp',
    '묘진'
  );

SELECT user_id INTO user2_id
FROM create_user (
    'bok2',
    'bok2@sindy.in',
    '$2a$10$NJ3fjKrUx3rYz1YXGPFfPOz4uLkXId3VD23gKbtxBMeECxMWeYjh.',
    '곽태욱',
    '010-9203-2837',
    1,
    '크로플 같은 남자',
    '1998-04-12',
    'https://storage.googleapis.com/sobok/%EA%B3%BD%ED%83%9C%EC%9A%B1.webp',
    '크로플홀릭'
  );

SELECT user_id INTO user3_id
FROM create_user (
    'bok3',
    'bok3@sindy.com',
    '$2a$10$NJ3fjKrUx3rYz1YXGPFfPOz4uLkXId3VD23gKbtxBMeECxMWeYjh.',
    '박수현',
    '010-4536-7393',
    2,
    '대구의 모든 맛집!',
    '1997-05-05',
    'https://storage.googleapis.com/sobok/%EB%B0%95%EC%88%98%ED%98%84.webp',
    '디자이너'
  );

SELECT user_id INTO user4_id
FROM create_user (
    'bok4',
    'bok4@sindy.com',
    '$2a$10$NJ3fjKrUx3rYz1YXGPFfPOz4uLkXId3VD23gKbtxBMeECxMWeYjh.',
    '김민호',
    '010-7644-5980',
    1,
    '디저트에 빠진 자취남(자아도취남)',
    '1996-09-12',
    'https://storage.googleapis.com/sobok/%EA%B9%80%EB%AF%BC%ED%98%B8.webp',
    '논'
  );

SELECT user_id INTO user5_id
FROM create_user (
    'bok5',
    'bok5@sindy.com',
    '$2a$10$NJ3fjKrUx3rYz1YXGPFfPOz4uLkXId3VD23gKbtxBMeECxMWeYjh.',
    '기현우',
    '010-2563-6996',
    1,
    '아재입맛, 집 근처만 다닙니다',
    '1995-01-14',
    'https://storage.googleapis.com/sobok/%EA%B8%B0%EC%9A%B0%ED%98%84.webp',
    '문신충'
  );

SELECT user_id INTO user6_id
FROM create_user (
    'bok6',
    'bok6@sindy.com',
    '$2a$10$NJ3fjKrUx3rYz1YXGPFfPOz4uLkXId3VD23gKbtxBMeECxMWeYjh.',
    '김진효',
    '010-4135-6866',
    2,
    '디저트 조아해요',
    '1997-10-16',
    'https://storage.googleapis.com/sobok/%EA%B9%80%EC%A7%84%ED%9A%A8.webp',
    '지뇨'
  );

SELECT user_id INTO user7_id
FROM create_user (
    'bok7',
    'bok7@sindy.com',
    '$2a$10$NJ3fjKrUx3rYz1YXGPFfPOz4uLkXId3VD23gKbtxBMeECxMWeYjh.',
    '곽욱태',
    '010-6827-9124',
    1,
    '유당불내증. 두유 커피가 최고!',
    '1997-10-06',
    'https://storage.googleapis.com/sobok/%EA%B3%BD%EC%9A%B1%ED%83%9C.webp',
    '욱욱'
  );

SELECT user_id INTO user8_id
FROM create_user (
    'bok8',
    'bok8@sindy.com',
    '$2a$10$NJ3fjKrUx3rYz1YXGPFfPOz4uLkXId3VD23gKbtxBMeECxMWeYjh.',
    '박현수',
    '010-7869-3665',
    2,
    '그곳에 마카롱이 있다면 어디든!',
    '1998-12-04',
    'https://storage.googleapis.com/sobok/%EB%B0%95%ED%98%84%EC%88%98.webp',
    '강남러'
  );

SELECT user_id INTO user9_id
FROM create_user (
    'bok9',
    'bok9@sindy.com',
    '$2a$10$NJ3fjKrUx3rYz1YXGPFfPOz4uLkXId3VD23gKbtxBMeECxMWeYjh.',
    '김호민',
    '010-5980-7644',
    1,
    '주호민 아니고 김호민',
    '1997-05-05',
    'https://storage.googleapis.com/sobok/%EA%B9%80%ED%98%B8%EB%AF%BC.webp',
    '주호민'
  );

SELECT user_id INTO user10_id
FROM create_user (
    'bok10',
    'bok10@sindy.com',
    '$2a$10$NJ3fjKrUx3rYz1YXGPFfPOz4uLkXId3VD23gKbtxBMeECxMWeYjh.',
    '기우현',
    '010-2395-6730',
    1,
    '내마음이 기우는 곳으로.',
    '1996-12-09',
    'https://storage.googleapis.com/sobok/%EA%B8%B0%ED%98%84%EC%9A%B0.webp',
    '직녀'
  );

SELECT create_store (
    '디저트정',
    '흑석동',
    '서울 동작구 서달로14길 42',
    '(37.50727586562332, 126.96508302238094)',
    ARRAY [1, 7],
    '0507-1329-4338',
    '0000000000',
    '수제로 만든 정성 가득한 디저트를 판매합니다',
    ARRAY ['9:00 ~ 17:00'],
    NULL,
    ARRAY ['https://postfiles.pstatic.net/MjAyMDEwMjdfNzIg/MDAxNjAzNzgxNTQ5MDQ3.R1QJOe01vP9iYh8iXMq7iMNgp65eYJm1qqTgvn6D5F4g.PObKW3w8lQOxz5_TSJG8griA_j5szovbMuBuRXELmmIg.JPEG.jjypink81/SE-03706234-a54c-4685-85ee-0f677b29bf61.jpg?type=w773', 'https://postfiles.pstatic.net/MjAyMDEwMjdfMjky/MDAxNjAzNzgxNTQxMzQ2.mb2L2V5jgVjq2kBrIqHdYUv-WqxmgliYRelH5po4Wy8g.n7bH95FFsQYKPWMG3HxBhvIDMZTlTgTD_yPjqdkWVpcg.JPEG.jjypink81/SE-9ab9b0bb-949e-48b5-978a-b2c79301978d.jpg?type=w773', 'https://postfiles.pstatic.net/MjAyMDEwMjdfMjky/MDAxNjAzNzgxNTQxMzQ2.mb2L2V5jgVjq2kBrIqHdYUv-WqxmgliYRelH5po4Wy8g.n7bH95FFsQYKPWMG3HxBhvIDMZTlTgTD_yPjqdkWVpcg.JPEG.jjypink81/SE-9ab9b0bb-949e-48b5-978a-b2c79301978d.jpg?type=w773, https://postfiles.pstatic.net/MjAyMDEwMjdfNzIg/MDAxNjAzNzgxNTQ5MDQ3.R1QJOe01vP9iYh8iXMq7iMNgp65eYJm1qqTgvn6D5F4g.PObKW3w8lQOxz5_TSJG8griA_j5szovbMuBuRXELmmIg.JPEG.jjypink81/SE-03706234-a54c-4685-85ee-0f677b29bf61.jpg?type=w773'],
    NULL,
    ARRAY ['수제', '케이크', '아기자기', '테이블적음']
  ),
  create_store (
    '뚜스뚜스 흑석역점',
    '흑석동',
    '서울 동작구 현충로 75 원불교기념관 1층',
    '(37.50993906524828, 126.96390942937472)',
    ARRAY [0, 7, 10],
    '0507-1426-9027',
    '0000000001',
    '브런치도 판매하는 빵 맛집',
    ARRAY ['7:00 ~ 10:00'],
    NULL,
    ARRAY ['https://postfiles.pstatic.net/MjAyMDAxMjFfMjQ4/MDAxNTc5NTY1MzkwMzQ3.gOx8j-FYxnxfseIOxd3TjaadGuqUsRhBPxvCtTf4jPog.k0n5hdse9XDzaBM_JrY58jaM4Bw-JwrADsb_ZGKXY1Qg.JPEG.shl992/SE-33ee3c5f-a114-4dfe-95cf-8c5e47233eb4.jpg?type=w966', 'https://postfiles.pstatic.net/MjAyMDAxMjFfMTc3/MDAxNTc5NTM1MjE1OTAx.fUYPF_Jbj83uRJsPc0RQ9HTgxLqbdlK2KxJpY0r_FX0g.BDlXxzYNkX_mihe0iD2t8S25AUIBEPdwNwjLip1V-SIg.JPEG.shl992/IMG_4554.jpg?type=w966', 'https://postfiles.pstatic.net/MjAyMDAxMjFfMTA3/MDAxNTc5NTY1MzU3MjIx.IhfWMypmOssGevgnUmWRTOV5YwU38QtxTidIx0h8208g.ChxGj03jeJSHqMIMBCezieJukvWBbwjnVXsQ7eNEPCIg.JPEG.shl992/SE-b6e797ed-e762-4937-8182-6fc8d20fa352.jpg?type=w966'],
    NULL,
    ARRAY ['주차편리', '넓다', '주문안받음', '샐러드시들', '좌석넓음']
  ),
  create_store (
    '프랑세즈',
    '흑석동',
    '서울 동작구 현충로 96',
    '(37.50792281447149, 126.96427646730544)',
    ARRAY [1, 2, 3],
    '02-825-5265',
    '0000000002',
    '유기농 밀가루 100%를 사용하며, 방부제를 사용하지 않는 빵집. 냉동 빵이 아니며, 생반죽으로 빵을 구워낸다. 자연 친화적인 발효종을 배양시켜 장시간 발효시키기 때문에, 빵 고유의 맛을 더욱 풍부하게 느낄 수 있다. 빵 안에 단팥과 호두가 가득 들어서, 고소한 레드빈스틱이 인기가 많다.',
    ARRAY ['09:30 - 21:30'],
    NULL,
    ARRAY ['https://postfiles.pstatic.net/MjAxOTAxMDVfMjU0/MDAxNTQ2NjgzOTI1NjIy.4xyJ--np-r5bcma0u4JmFvAS1rNpZbzuvuKtdWjG7VUg.AEqEWFhVkndCm62VoD-TCPX2sy7C-UeXqv12g_HB2pAg.JPEG.5sh417/KakaoTalk_20190105_190320699.jpg?type=w966', 'https://postfiles.pstatic.net/MjAxOTAxMDVfMjI2/MDAxNTQ2NjgzOTI1NDQy.Qbs4f0xSAXlxPdCbPD1Ghrb04naEc3ldmvUOePrjyNAg.2fhQAX1by1OwCihDhDvyVKl1e-n2QkNPgXtGUrJQkjAg.JPEG.5sh417/KakaoTalk_20190105_190308312.jpg?type=w966', 'https://postfiles.pstatic.net/MjAxOTAxMDVfMjYg/MDAxNTQ2NjgzOTI1NTIw.iRgAZoKFPxCHEhWXarwboF4o4tPHzpBoSEllJC9TxSsg.XFcY5IwxpwCQx8OeQ4PFe0V-41zSUVrhXh_6R7iB3-og.JPEG.5sh417/KakaoTalk_20190105_190307511.jpg?type=w966'],
    NULL,
    ARRAY ['친절', '따끈따끈', '보름달빵', '케이크']
  ),
  create_store (
    'LITITCOFFEE',
    '상도동',
    '서울 동작구 상도로47바길 48 1층',
    '(37.50400055148826, 126.95331793178354)',
    ARRAY [1, 3],
    '070-8866-4344',
    '0000000003',
    '친절하고 공부하기 좋은 힙한 느낌의 카페',
    ARRAY ['10:00 ~ 01:00'],
    NULL,
    ARRAY ['https://postfiles.pstatic.net/MjAxODEwMjlfMTQw/MDAxNTQwNzkyNjQwMTUz.Izj58h5ZYdp-Ickpm6lUVB4ZWnxudAjbf7-lTsN-wYQg.HZQL8l0de78g0wpVJWE5Lwo_0Gb9yhGWJnXIXUSA_AAg.JPEG.cuyss/IMG_3846.jpg?type=w580, https://postfiles.pstatic.net/MjAxODEwMjlfOTEg/MDAxNTQwNzkyNjM5NTcz.55popOEnNuYOPQsVb1ScVAzKV9zdyeBglF_fmOPURHkg.KGaDAeolGyLlrJxq7gQJA4PK2RswIe7jm1MrJvDjgNkg.JPEG.cuyss/IMG_3844.jpg?type=w580', 'https://postfiles.pstatic.net/MjAxODEwMjlfMzcg/MDAxNTQwNzkyNjQwNzM2.P60hkdEXQ3be0U86DD5OK_Cnz9VsgY7dcK3PCdj22bsg.e84zLRubKj1mYXvRrtRTN-La73X9W9tSZrN2Pf9ajAwg.JPEG.cuyss/IMG_3850.jpg?type=w580'],
    NULL,
    ARRAY ['레모네이드', '디저트', '더치커피', '소금커피']
  ),
  create_store (
    '그랩커피&브런치',
    '흑석동',
    '서울 동작구 흑석로8길 12 1층',
    '(37.506620538533454, 126.95954265365377)',
    ARRAY [3, 4, 5, 6, 7],
    '0507-1330-7209',
    '0000000004',
    '친절하고 공부하기 좋은 힙한 느낌의 카페',
    ARRAY ['10:00 ~ 22:00'],
    ARRAY ['2022-01-14'::date, '2022-04-12', '2022-05-05', '2022-06-10', '2022-09-12'],
    ARRAY ['https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20201212_253%2F1607755828928OXgIn_JPEG%2Fupload_73a904bb014476a9cf50fcbd68ca2930.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAxOTA3MjVfMTI5%2FMDAxNTYzOTgyNTc3MDUz.ZZeM1uDNAyzQ9UPNhkXhiU-Eo3TQtQHcYP3u93dm4u4g.HHNXtVx5L6jQHIimVDO8xxBrPIGqY8WOeZvQFCdu0LEg.JPEG.herb8777%2F8.JPG', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20200922_131%2F1600745850236DV8Tl_JPEG%2Fupload_c1164979a2bc20a5c18718f574492aba.jpg'],
    NULL,
    ARRAY ['레모네이드', '디저트', '더치커피', '소금커피']
  ),
  create_store (
    '라임플레쉬카페',
    '흑석동',
    '서울 동작구 흑석동13가길 29',
    '(37.50784835429369, 126.96007794498546)',
    ARRAY [1, 7, 10],
    '02-6398-6787',
    '0000000005',
    '공부하거나 모임 하기 좋은 장소',
    ARRAY ['08:00 - 23:00'],
    NULL,
    ARRAY ['https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20200522_186%2F1590106167237R9Mft_JPEG%2Fupload_14591cf734e0bc0909d63cf4f86c2a75.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20200509_165%2F15890140395473gPLC_JPEG%2Fupload_ad2ed381ce07bec0c87186d358320a90.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20200827_48%2F1598515685368mikNB_JPEG%2Fupload_80ff969d5c9d7da70fc64dda11096f09.jpg'],
    NULL,
    ARRAY ['친절', '탁트인', '과일', '휴식']
  ),
  create_store (
    '이공커피',
    '흑석동',
    '서울 동작구 서달로 151',
    '(37.50694032711747, 126.9615198388504)',
    ARRAY [2, 4],
    '02-826-9194',
    '0000000006',
    '제주 감성을 담아낸 이로운 커피',
    ARRAY ['08:00 - 22:00'],
    NULL,
    ARRAY ['https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20210511_81%2F1620724833936X4F65_JPEG%2Fupload_0d8d1684794e0b1ff7bd1d33c66e30cd.jpeg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20210517_121%2F1621234458351F9M47_JPEG%2Fupload_eef610840b8bcb5fe33c83b3696431ba.jpeg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20210517_5%2F1621234506060O8tQb_JPEG%2Fupload_3b203844ff7f60a3399780c98cfef19d.jpeg'],
    NULL,
    ARRAY ['가성비 좋은', '다양한 디저트', '시원한']
  ),
  create_store (
    '터방내',
    '흑석동',
    '서울 동작구 흑석로 101-7',
    '(37.50800934516435, 126.960741474928)',
    ARRAY [3, 10],
    '02-813-4434',
    '0000000007',
    '7080 감성 카페, 옛날 다방 감성',
    ARRAY ['11:00 - 24:00'],
    NULL,
    ARRAY ['https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20210310_287%2F1615368900173WzeHg_JPEG%2Fupload_25c18d2d26cea23ad9850442997a829b.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20201014_49%2F1602641896802HHVDv_JPEG%2Fupload_0be84a7187d0f5c201340a4e1a2c9e9a.jpeg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20201013_188%2F1602572741414VaNmU_JPEG%2Fupload_3e04af6838f31cdf7f36753643aff8da.jpeg'],
    NULL,
    ARRAY ['옛날감성', '분위기 좋은', '어두운', '친절한']
  ),
  create_store (
    '토크넌센스',
    '흑석동',
    '서울 동작구 흑석로8길 7',
    '(37.50678949974395, 126.95963072566376)',
    ARRAY [3],
    '0507-1405-8858',
    '0000000008',
    '토크가 맛있는 카페',
    ARRAY ['12:00 - 22:00'],
    ARRAY ['2023-01-14'::date, '2023-04-12', '2023-05-05', '2023-06-10', '2023-09-12'],
    ARRAY ['https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDEyMjNfMjA1%2FMDAxNjA4NzE5MjMxNjM1.mrnNHA6pxPRKDT1R1PtCq71xPj8C_LxlggtwOEeNb2Mg.CUi6AbZOVk9u0URMOydFIIXXZ84Pe4G0UTq3JwzEENgg.JPEG.nare3030%2FIMG_3859.jpg, https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDExMDNfMjU4%2FMDAxNjA0MzM3MzI4NTc5.IpkHgj_3wQPn98Oukxt0jlv-sxVHhvgyUi-gGUc3OUQg.dzqqFsA8qw4zMexVDtt1AVOgC4ss-6VVc39Yu3sBdBcg.JPEG.aacad85%2FIMG_2955.JPG', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDA5MTRfODUg%2FMDAxNjAwMDkzNDM5MDk0.5VRa8NVX2yf6MbCxz7Nt02gjMi8yi_ylb7klJ-IBQXgg.cSVniEigsoTgx42mA4QZL5hIu9kn4ESE31PMcI9q29gg.JPEG.kohyoeunhong%2FIMG_4001.jpg'],
    NULL,
    ARRAY ['힙한', '치즈', '와인', '케이크']
  ),
  create_store (
    '흑석커피',
    '흑석동',
    '서울 동작구 서달로 14가길 5 1층',
    '(37.50752420082978, 126.9630734132259)',
    ARRAY [1, 2, 4, 10],
    '0507-1317-9267',
    '0000000009',
    '조용하고 색다른 메뉴가 있는 카페',
    ARRAY ['10:00 - 22:00'],
    ARRAY ['2024-01-14'::date, '2024-04-12', '2024-05-05', '2024-06-10', '2024-09-12'],
    ARRAY ['https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fmyplace-phinf.pstatic.net%2F20200812_81%2F1597223302326skrLs_JPEG%2Fupload_888e4e8977d7c4b98da4365f06c75852.jpeg', 'https://search.pstatic.net/common/?autoRotate=true&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200901_111%2F1598947940824eIdD3_JPEG%2F77tjOTxyABizz9LznvZS3a5T.jpg', 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20200901_114%2F1598947896591784R0_JPEG%2FAvlUhB3gdz55x-nQuVguaRgK.jpg'],
    NULL,
    ARRAY ['분위기가 좋은', '디저트 맛집', '통유리']
  ),
  create_menu (
    '아메리카노',
    4100,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EC%95%84%EC%95%84.webp'],
    3,
    1,
    ARRAY ['씁쓸']
  ),
  create_menu (
    '폼폼라떼',
    3000,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%ED%8F%BC%ED%8F%BC%EB%9D%BC%EB%96%BC_%EB%94%94%EC%A0%80%ED%8A%B8%EC%A0%95.webp'],
    3,
    1,
    ARRAY ['폼가득']
  ),
  create_menu (
    '카페라떼',
    5000,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EC%B9%B4%ED%8E%98%EB%9D%BC%EB%96%BC_%EB%94%94%EC%A0%80%ED%8A%B8%EC%A0%95.webp'],
    3,
    1,
    ARRAY ['우유맛집']
  ),
  create_menu (
    '복숭아 아이스티',
    3400,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EB%B3%B5%EC%88%AD%EC%95%84%20%EC%95%84%EC%9D%B4%EC%8A%A4%ED%8B%B0_%EB%94%94%EC%A0%80%ED%8A%B8%EC%A0%95.webp'],
    0,
    1,
    ARRAY ['새콤']
  ),
  create_menu (
    '죠리퐁프라페',
    5000,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EC%A3%A0%EB%A6%AC%ED%90%81%20%EB%9D%BC%EB%96%BC_%EB%94%94%EC%A0%80%ED%8A%B8%EC%A0%95.webp'],
    0,
    1,
    ARRAY ['죠리퐁']
  ),
  create_menu (
    '돌체라떼',
    6300,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EB%8F%8C%EC%B2%B4%EB%9D%BC%EB%96%BC.webp'],
    3,
    1,
    ARRAY ['연유']
  ),
  create_menu (
    '꿀자몽주스',
    7000,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EA%BF%80%EC%9E%90%EB%AA%BD%EC%A3%BC%EC%8A%A4.webp'],
    0,
    1,
    ARRAY ['자몽']
  ),
  create_menu (
    '샷그린티',
    5000,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EC%83%B7%EA%B7%B8%EB%A6%B0%ED%8B%B0.webp'],
    0,
    1,
    ARRAY ['녹차']
  ),
  create_menu (
    '마카롱',
    2300,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EB%A7%88%EC%B9%B4%EB%A1%B1.webp'],
    5,
    1,
    ARRAY ['뚱뚱']
  ),
  create_menu (
    '아메리카노',
    4300,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EC%95%84%EC%95%84.webp'],
    3,
    2,
    ARRAY ['케냐 원두', '씁쓸']
  ),
  create_menu (
    '생과일주스',
    6500,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EC%83%9D%EA%B3%BC%EC%9D%BC%EC%A3%BC%EC%8A%A4_%EB%9A%9C%EC%8A%A4%EB%9A%9C%EC%8A%A4.webp'],
    0,
    2,
    ARRAY ['무설탕']
  ),
  create_menu (
    '프렌치 토스트 세트',
    14900,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EB%B8%8C%EB%9F%B0%EC%B9%98.webp'],
    6,
    2,
    ARRAY ['이탈리안']
  ),
  create_menu (
    '통밀 견과류 스콘',
    7000,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%ED%86%B5%EB%B0%80%20%EA%B2%AC%EA%B3%BC%EB%A5%98%20%EC%8A%A4%EC%BD%98_%ED%94%84%EB%9E%91%EC%84%B8%EC%A6%88.webp'],
    4,
    3,
    ARRAY ['아몬드']
  ),
  create_menu (
    '치아바타샌드위치',
    6000,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EC%B9%98%EC%95%84%EB%B0%94%ED%83%80%20%EC%83%8C%EB%93%9C%EC%9C%84%EC%B9%98_%ED%94%84%EB%9E%91%EC%84%B8%EC%A6%88.webp'],
    4,
    3,
    ARRAY ['치아바타']
  ),
  create_menu (
    '블루베리타르트',
    6500,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EB%B8%94%EB%A3%A8%EB%B2%A0%EB%A6%AC%ED%83%80%EB%A5%B4%ED%8A%B8_%ED%94%84%EB%9E%91%EC%84%B8%EC%A6%88.webp'],
    4,
    3,
    ARRAY ['생블루베리']
  ),
  create_menu (
    '아인슈페너',
    4800,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EC%95%84%EC%9D%B8%EC%8A%88%ED%8E%98%EB%84%88_%EB%A6%BF%EC%9E%87%EC%BB%A4%ED%94%BC.webp'],
    3,
    4,
    ARRAY ['크림']
  ),
  create_menu (
    '밀크쉐이크',
    4500,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EB%B0%80%ED%81%AC%EC%89%90%EC%9D%B4%ED%81%AC_%EB%A6%BF%EC%9E%87%EC%BB%A4%ED%94%BC.webp'],
    0,
    4,
    ARRAY ['달달']
  ),
  create_menu (
    '쑥라떼',
    4800,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EC%91%A5%EB%9D%BC%EB%96%BC_%EB%A6%BF%EC%9E%87%EC%BB%A4%ED%94%BC.webp'],
    0,
    4,
    ARRAY ['임진쑥']
  ),
  create_menu (
    '후지산 말차',
    5000,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%ED%9B%84%EC%A7%80%EC%82%B0%EB%A7%90%EC%B0%A8%EB%9D%BC%EB%96%BC_%EA%B7%B8%EB%9E%A9%EC%BB%A4%ED%94%BC%26%EB%B8%8C%EB%9F%B0%EC%B9%98.webp'],
    0,
    5,
    ARRAY ['국산']
  ),
  create_menu (
    '플랫 화이트',
    5000,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%ED%94%8C%EB%9E%AB%ED%99%94%EC%9D%B4%ED%8A%B8_%EA%B7%B8%EB%9E%A9%EC%BB%A4%ED%94%BC%26%EB%B8%8C%EB%9F%B0%EC%B9%98.webp'],
    3,
    5,
    ARRAY ['플랫화이트 정석']
  ),
  create_menu (
    '치즈 케이크',
    4800,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EA%BE%B8%EB%8D%95%20%EC%B9%98%EC%A6%88%EC%BC%80%EC%9D%B4%ED%81%AC_%EA%B7%B8%EB%9E%A9%EC%BB%A4%ED%94%BC%26%EB%B8%8C%EB%9F%B0%EC%B9%98.webp'],
    0,
    5,
    ARRAY ['꾸덕꾸덕']
  ),
  create_menu (
    '카페 몬스터',
    4500,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EC%B9%B4%ED%8E%98%EB%AA%AC%EC%8A%A4%ED%84%B0_%EB%9D%BC%EC%9E%84%ED%94%8C%EB%A0%88%EC%89%AC%EC%B9%B4%ED%8E%98.webp'],
    3,
    6,
    ARRAY ['커피']
  ),
  create_menu (
    '천혜향 주소',
    6000,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EC%B2%9C%ED%98%9C%ED%96%A5%EC%A3%BC%EC%8A%A4_%EB%9D%BC%EC%9E%84%ED%94%8C%EB%A0%88%EC%89%AC%EC%B9%B4%ED%8E%98.webp'],
    0,
    6,
    ARRAY ['천혜향']
  ),
  create_menu (
    '스모키 얼그레이 초코렛 라떼',
    4500,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EC%8A%A4%EB%AA%A8%ED%82%A4%EC%96%BC%EA%B7%B8%EB%A0%88%EC%9D%B4%EC%B4%88%EC%BD%9C%EB%A6%BF%EB%9D%BC%EB%96%BC_%EB%9D%BC%EC%9E%84%ED%94%8C%EB%A0%88%EC%89%AC%EC%B9%B4%ED%8E%98.webp'],
    0,
    6,
    ARRAY ['얼그레이']
  ),
  create_menu (
    '고구마 라떼',
    4200,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EA%B3%A0%EA%B5%AC%EB%A7%88%EB%9D%BC%EB%96%BC.webp'],
    0,
    7,
    ARRAY ['국산 고구마']
  ),
  create_menu (
    '초코 라떼',
    3500,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EC%B4%88%EC%BD%94%EB%9D%BC%EB%96%BC.webp'],
    0,
    7,
    ARRAY ['달달']
  ),
  create_menu (
    '미숫가루라떼',
    3500,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EB%AF%B8%EC%88%AB%EA%B0%80%EB%A3%A8%EB%9D%BC%EB%96%BC.webp'],
    0,
    7,
    ARRAY ['미숫가루']
  ),
  create_menu (
    '팥빙수',
    3000,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%ED%8C%A5%EB%B9%99%EC%88%98.webp'],
    0,
    8,
    ARRAY ['과일듬뿍']
  ),
  create_menu (
    '카페로얄',
    4000,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EC%B9%B4%ED%8E%98%EB%A1%9C%EC%96%84.webp'],
    3,
    8,
    ARRAY ['레트로', '감성커피']
  ),
  create_menu (
    '비엔나커피',
    4000,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EB%B9%84%EC%97%94%EB%82%98%20%EC%BB%A4%ED%94%BC.webp'],
    3,
    8,
    ARRAY ['다방커피']
  ),
  create_menu (
    '코르타도',
    4500,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EC%BD%94%EB%A5%B4%ED%83%80%EB%8F%84.webp'],
    3,
    9,
    ARRAY ['스페인식 진한 카페라떼']
  ),
  create_menu (
    '오이또 에이드',
    5500,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EC%98%A4%EC%9D%B4%EB%98%90%20%EC%97%90%EC%9D%B4%EB%93%9C.webp'],
    0,
    9,
    ARRAY ['모히또', '오이', '레몬']
  ),
  create_menu (
    '머스캣 밀크티',
    5000,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EB%A8%B8%EC%8A%A4%EC%BA%A3%20%EB%B0%80%ED%81%AC%ED%8B%B0.webp'],
    0,
    9,
    ARRAY ['머스캣', '밀크티']
  ),
  create_menu (
    '옐로우커피',
    5000,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EC%98%90%EB%A1%9C%20%EC%BB%A4%ED%94%BC.webp'],
    3,
    10,
    ARRAY ['커피']
  ),
  create_menu (
    '파인애플망고주스',
    5000,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%ED%8C%8C%EC%9D%B8%EC%95%A0%ED%94%8C%EB%A7%9D%EA%B3%A0%EC%A3%BC%EC%8A%A4.webp'],
    0,
    10,
    ARRAY ['상콤']
  ),
  create_menu (
    '아이스크림 크로플',
    7000,
    FALSE,
    ARRAY ['https://storage.googleapis.com/sobok/%EC%95%84%EC%9D%B4%EC%8A%A4%ED%81%AC%EB%A6%BC%20%ED%81%AC%EB%A1%9C%ED%94%8C.webp'],
    4,
    10,
    ARRAY ['크로플', '브라운치즈']
  ),
  create_news (
    '디졍 애플망고우유',
    ARRAY ['딸기가 끝나서 아쉽지만 여름에는 망고를 새로 출시했습니다.곧 복숭아우유도 출시할거에요 ~~'],
    1,
    1,
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY ['https://storage.googleapis.com/sobok/%EB%94%94%EC%A0%80%ED%8A%B8%EC%A0%95.webp']
  ),
  create_news (
    '아메리카노 증정 이벤트',
    ARRAY ['20,000원 이상 구매시 아메리카노 증정드립니다.'],
    2,
    2,
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY ['https://storage.googleapis.com/sobok/%EB%9A%9C%EC%8A%A4%EB%9A%9C%EC%8A%A4.webp']
  ),
  create_news (
    '긴급!긴급! 메뉴 소진',
    ARRAY ['다쿠아즈, 브륄레류 디저트 메뉴가 모두 소진되었어요!'],
    4,
    3,
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY ['https://storage.googleapis.com/sobok/%ED%94%84%EB%9E%91%EC%84%B8%EC%A6%88.webp']
  ),
  create_news (
    '처음으로 만들어본 인스타 HOT메뉴 출시!',
    ARRAY ['코로나로 시간이 많아져서 새로운 쿠키들 4종류 판매합니다.'],
    1,
    4,
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY ['https://storage.googleapis.com/sobok/%EB%A6%BF%EC%9E%87%EC%BB%A4%ED%94%BC.webp']
  ),
  create_news (
    'Summer 신메뉴 출시!',
    ARRAY ['오늘부터 여름한정메뉴 수박쥬스 판매를 시작해요! 고창에서 온 꿀수박만 사용합니다!'],
    1,
    5,
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY ['https://storage.googleapis.com/sobok/%EA%B7%B8%EB%9E%A9%EC%BB%A4%ED%94%BC%26%EB%B8%8C%EB%9F%B0%EC%B9%98.webp']
  ),
  create_news (
    '라떼 주문 불가',
    ARRAY ['우유 소진으로 라떼류 메뉴 주문은 제한됩니다. 죄송해요~'],
    4,
    6,
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY ['https://storage.googleapis.com/sobok/%EB%9D%BC%EC%9E%84%ED%94%8C%EB%A0%88%EC%89%AC%EC%B9%B4%ED%8E%98.webp']
  ),
  create_news (
    '흑임자 라떼 출시',
    ARRAY ['맛도 건강도 좋은 흑임자라떼! 한달간의 연구끝에 오늘 출시했습니다!'],
    1,
    7,
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY ['https://storage.googleapis.com/sobok/%EC%9D%B4%EA%B3%B5%EC%BB%A4%ED%94%BC.webp']
  ),
  create_news (
    '한시간 빨리 닫아요 ㅠㅠ',
    ARRAY ['금일 사장님 개인사정으로 한시간 단축 영업합니다! 09:00 ~ 20:00'],
    3,
    8,
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY ['https://storage.googleapis.com/sobok/%ED%84%B0%EB%B0%A9%EB%82%B4.webp']
  ),
  create_news (
    '디저트 마감 할인!',
    ARRAY ['마감까지 두시간! 모든 디저트 메뉴 20% 할인 중 입니다~'],
    2,
    9,
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY ['https://storage.googleapis.com/sobok/9.webp']
  ),
  create_news (
    '방역 관련',
    ARRAY ['흑석커피는 코로나 예방을 위해 매일 매일 매장과 식기를 소독을 하고 있습니다.'],
    3,
    10,
    NULL,
    NULL,
    NULL,
    NULL,
    ARRAY ['https://storage.googleapis.com/sobok/%ED%9D%91%EC%84%9D%EC%BB%A4%ED%94%BC.webp']
  ),
  create_feed (
    3,
    ARRAY ['커피 맛 굳굳!! 사장님이 너무 친절하셔요 :) 흑석동 최고의 카페!'],
    ARRAY ['https://storage.googleapis.com/sobok/%EB%A6%AC%EB%B7%B0%EC%98%90%EB%A1%9C%EC%9A%B0%EC%BB%A4%ED%94%BC.webp'],
    32,
    user1_id,
    10,
    ARRAY [34],
    ARRAY [1],
    ARRAY [2],
    ARRAY [1],
    ARRAY ['커피맛집', '친절', '흑석동', '카공']
  ),
  create_feed (
    3,
    ARRAY ['통밀 견과류 스콘 한번도 못먹어본 사람은 있어도 한번만 먹어본 사람은 없다.'],
    ARRAY ['https://storage.googleapis.com/sobok/%EB%A6%AC%EB%B7%B0%ED%86%B5%EB%B0%80%EA%B2%AC%EA%B3%BC%EB%A5%98%EC%8A%A4%EC%BD%98.webp'],
    63,
    user2_id,
    3,
    ARRAY [13],
    ARRAY [1],
    ARRAY [2],
    ARRAY [1],
    ARRAY ['통밀', '스콘', '견과류', '청결', '데이트']
  ),
  create_feed (
    1,
    ARRAY ['오이 향이 너무 안났어요. 오이를 좋아하는데...'],
    ARRAY ['https://storage.googleapis.com/sobok/%EB%A6%AC%EB%B7%B0%EC%98%A4%EC%9D%B4%EB%98%90.webp'],
    48,
    user3_id,
    9,
    ARRAY [32],
    ARRAY [50],
    ARRAY [50],
    ARRAY [1],
    ARRAY ['오이', '실망', '양많음', '분위기좋음']
  ),
  create_feed (
    2,
    ARRAY ['그냥 미숫가루 맛이었어요'],
    ARRAY ['https://storage.googleapis.com/sobok/%EB%A6%AC%EB%B7%B0%EB%AF%B8%EC%88%AB%EA%B0%80%EB%A3%A8%EB%9D%BC%EB%96%BC.webp'],
    65,
    user4_id,
    7,
    ARRAY [27],
    ARRAY [50],
    ARRAY [50],
    ARRAY [1],
    ARRAY ['미숫가루', '고칼로리', '아침식사', '쏘쏘']
  ),
  create_feed (
    3,
    ARRAY ['달달하고 상큼하고 넘 맛있어용 가격이 쪼금 있지만 눈감고 먹어줄만한 맛!'],
    ARRAY ['https://storage.googleapis.com/sobok/%EB%A6%AC%EB%B7%B0%EA%BF%80%EC%9E%90%EB%AA%BD%EC%A5%AC%EC%8A%A4.webp'],
    56,
    user5_id,
    1,
    ARRAY [7],
    ARRAY [50],
    ARRAY [50],
    ARRAY [1],
    ARRAY ['비쌈', '달달', '상큼', '자몽', '꿀']
  ),
  create_feed (
    3,
    ARRAY ['고구마 진짜 좋아하는데 여기 진짜 꿀맛ㅠㅠㅠ 강추!'],
    ARRAY ['https://storage.googleapis.com/sobok/%EB%A6%AC%EB%B7%B0%EA%B3%A0%EA%B5%AC%EB%A7%88%EB%9D%BC%EB%96%BC.webp'],
    65,
    user1_id,
    7,
    ARRAY [25],
    ARRAY [50],
    ARRAY [50],
    ARRAY [1],
    ARRAY ['고구마라떼', '다이어트', '친구랑', '아늑']
  ),
  create_comment (
    ARRAY ['신기해용 노란색은 뭔가요? 망고??!'],
    user1_id,
    1,
    NULL,
    NULL
  ),
  create_comment (ARRAY ['망고 맛있겠네용ㅎㅎ'], user2_id, 1, NULL, NULL),
  create_comment (ARRAY ['저 매주 가서 먹어요ㅠ'], user2_id, 2, NULL, NULL),
  create_comment (
    ARRAY ['오이가 얼마나 맛있는데!! ㅋㅋ'],
    user3_id,
    3,
    NULL,
    NULL
  ),
  create_comment (
    ARRAY ['미숫가루 맛이 강한게 매력이던데용 ㅎ'],
    user4_id,
    4,
    NULL,
    NULL
  ),
  create_comment (
    ARRAY ['그치만 조금만 더 저렴했으면 좋겠어요ㅠ'],
    user5_id,
    5,
    NULL,
    NULL
  ),
  create_comment (
    ARRAY ['여기 고구마 라떼가 정말 달더라구요'],
    user6_id,
    6,
    NULL,
    NULL
  ) INTO rec;

CALL toggle_liked_store (user1_id, 2, r);

CALL toggle_liked_store (user1_id, 3, r);

CALL toggle_liked_store (user1_id, 7, r);

CALL toggle_liked_store (user2_id, 2, r);

CALL toggle_liked_store (user3_id, 3, r);

CALL toggle_liked_store (user4_id, 4, r);

CALL toggle_liked_store (user5_id, 5, r);

CALL toggle_liked_store (user6_id, 6, r);

CALL toggle_liked_store (user7_id, 7, r);

CALL toggle_liked_store (user8_id, 8, r);

CALL toggle_liked_store (user9_id, 9, r);

CALL toggle_liked_store (user10_id, 10, r);

CALL toggle_liked_menu (user1_id, 1, r);

CALL toggle_liked_menu (user2_id, 2, r);

CALL toggle_liked_menu (user3_id, 3, r);

CALL toggle_liked_menu (user4_id, 4, r);

CALL toggle_liked_menu (user5_id, 5, r);

CALL toggle_liked_menu (user6_id, 6, r);

CALL toggle_liked_menu (user7_id, 7, r);

CALL toggle_liked_menu (user8_id, 8, r);

CALL toggle_liked_menu (user9_id, 9, r);

CALL toggle_liked_menu (user10_id, 10, r);

CALL toggle_following_user(user1_id, user2_id, t);

CALL toggle_following_user(user1_id, user3_id, t);

CALL toggle_following_user(user1_id, user4_id, t);

CALL toggle_following_user(user2_id, user3_id, t);

CALL toggle_following_user(user2_id, user4_id, t);

CALL toggle_following_user(user2_id, user5_id, t);

CALL toggle_store_bucket_list(user1_id, 1, 1, t);

CALL toggle_store_bucket_list(user1_id, 2, 1, t);

CALL toggle_store_bucket_list(user1_id, 3, 1, t);

CALL toggle_menu_bucket_list(user1_id, 1, 2, t);

CALL toggle_menu_bucket_list(user1_id, 2, 2, t);

CALL toggle_menu_bucket_list(user1_id, 3, 2, t);

CALL toggle_store_bucket_list(user2_id, 4, 3, t);

CALL toggle_store_bucket_list(user2_id, 5, 3, t);

CALL toggle_store_bucket_list(user2_id, 6, 3, t);

CALL toggle_menu_bucket_list(user2_id, 4, 4, t);

CALL toggle_menu_bucket_list(user2_id, 5, 4, t);

CALL toggle_menu_bucket_list(user2_id, 6, 4, t);

END $$;