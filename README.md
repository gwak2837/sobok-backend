# 2021-1 Capstone Backend (Node.js)

## 실행 방법

### 개발 환경

- macOS 11.2
- Git 2.31
- Node.js LTS
- Yarn 1.22
- PostgreSQL 13.2
- Docker 20.10
- Docker Compose 1.28
- Visual Studio Code 1.54

GCP Cloud Run이 컨테이너 기반 환경이기 때문에 Docker는 컨테이너 환경을 테스트하고 싶을 때 설치합니다.

### 프로젝트 다운로드

```bash
> git clone 프로젝트-주소
> cd 프로젝트-폴더
> git checkout 브랜치-이름
> yarn
```

프로젝트를 다운로드 받고 해당 폴더로 이동한 후 적절한 브랜치로 이동하고 프로젝트에 필요한 외부 패키지를 설치합니다.

그리고 프로젝트 폴더에서 VSCode를 실행하면 오른쪽 아래에 '권장 확장 프로그램 설치' 알림이 뜹니다.

프로젝트에서 권장하는 확장 프로그램(ESLint, Prettier 등)을 모두 설치해줍니다.

만약 이미 프로젝트를 다운로드 받았다면 다른 사람의 변경 사항을 반영하기 위해 `git fetch, git pull` 도 실행해줍니다.

### 환경 변수 설정

```
POSTGRES_HOST=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=

JWT_SECRET_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

FRONTEND_URL=
BACKEND_URL=

PORT=4000
```

루트 폴더에 `.env`, `.env.development` 파일을 생성하고 거기에 프로젝트에 필요한 환경 변수를 설정합니다.

만약 로컬 데이터베이스를 사용하려면 `POSTGRES_HOST=localhost`로 설정하고 `localhost:5432` 주소에서 PostgreSQL 데이터베이스를 실행합니다.

### 개발 모드 (Local)

```shell
> yarn dev
```

TypeScript 파일을 그대로 사용해 Nodemon으로 서비스를 실행합니다.

### 프로덕션 모드 (Local)

```shell
> yarn build
> yarn start
```

TypeScript 파일을 JavaScript로 트랜스파일한 후 Node.js로 서비스를 실행합니다.

### 프로덕션 모드 (Docker)

```shell
> docker-compose up --detach --build --force-recreate
```

배포 서버 환경이랑 동일한 Docker 환경을 생성합니다.

### 브라우저 실행

```
http://localhost:4000
```

브라우저에서 아래 주소로 접속하면 개발 중인 사이트를 볼 수 있습니다.

## GCP Cloud Run 배포

GCP Cloud Run이 GitHub 저장소 변경 사항을 자동으로 감지하기 때문에 GitHub로 commit을 push할 때마다 Cloud Run에 자동으로 배포됩니다.

## 데이터베이스 ERD

[database/erd.html](database/erd.html)

## 프로젝트 구조

## 의문점

- 스케일링에 의해 백엔드 컨테이너 수가 늘어날 수록 pg에서 제공하는 client pooling의 의미가 퇴색될까?

- menu 개수에 비례해서 sql 수가 증가하는 문제점. query chaining. optional field는 sql에서 select 하지 않기
