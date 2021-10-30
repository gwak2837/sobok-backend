# ☁️ 소복 (Sobok) Back-End

소소한 행복 :)

## Requires

- macOS 11.5
- [Git](https://git-scm.com/downloads) 2.32
- [Node](https://hub.docker.com/_/node) 16 Alpine
- [Yarn](https://yarnpkg.com/getting-started/install#about-global-installs) berry
- [Visual Studio Code](https://code.visualstudio.com/Download) 1.61
- [PostgreSQL](https://hub.docker.com/_/postgres) 14 Alpine
- [Docker](https://www.docker.com/get-started) 20.10
- Docker Compose 1.29

```bash
$ git --version
$ node --version
$ yarn --version
$ code --version
$ docker --version
$ docker-compose --version
```

위 명령어를 통해 프로젝트에 필요한 모든 프로그램이 설치되어 있는지 확인합니다.

## Project structure

![images/architecture.webp](images/architecture.webp)

## Quick start

### Download codes

```bash
$ git clone https://github.com/teamsindy20/sobok-backend.git
$ cd sobok-backend
$ git checkout main
$ yarn
```

프로젝트를 다운로드 받고 해당 폴더로 이동한 후 적절한 브랜치(`main` 등)로 이동하고 프로젝트에 필요한 외부 패키지를 설치합니다.

그리고 프로젝트 폴더에서 VSCode를 실행하면 오른쪽 아래에 '권장 확장 프로그램 설치' 알림이 뜨는데, 프로젝트에서 권장하는 확장 프로그램(ESLint, Prettier 등)을 모두 설치합니다.

### Start PostgreSQL server

```bash
$ docker volume create {도커볼륨이름}
$ docker run \
  -d \
  -e POSTGRES_USER={DB계정이름} \
  -e POSTGRES_PASSWORD={DB계정비밀번호} \
  -e POSTGRES_DB={DB이름} \
  -e LANG=ko_KR.utf8 \
  -e LC_COLLATE=C \
  -e POSTGRES_INITDB_ARGS=--data-checksums \
  -p 5432:5432 \
  -v {도커볼륨이름}:/var/lib/postgresql/data \
  --name postgres \
  --restart=always \
  postgres:14-alpine
```

도커 명령어를 통해 PostgreSQL 서버 컨테이너와 볼륨을 생성합니다.

```bash
$ yarn import-db {환경 변수 파일 위치}
```

그리고 PostgreSQL 서버에 접속해서 [`database/initialization.sql`](database/initialization.sql)에 있는 SQL DDL을 실행하고 CSV 파일로 되어 있는 더미데이터를 넣어줍니다.

### Create environment variables

```
POSTGRES_HOST=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=

JWT_SECRET_KEY=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

FRONTEND_URL=
BACKEND_URL=

PORT=4000
```

루트 폴더에 `.env`, `.env.development`, `.env.test` 파일을 생성하고 프로젝트에서 사용되는 환경 변수를 설정합니다.

### Start Node.js server

```shell
$ yarn dev
```

TypeScript 파일을 그대로 사용해 Nodemon으로 서비스를 실행합니다.

or

```shell
$ yarn build && yarn start
```

TypeScript 파일을 JavaScript로 트랜스파일한 후 Node.js로 서비스를 실행합니다.

or

```shell
$ docker-compose up --detach --build --force-recreate
```

(Cloud Run 환경과 동일한) Docker 환경에서 Node.js 서버를 실행합니다.

### Deploy to Cloud Run

Cloud Run이 GitHub 저장소 변경 사항을 자동으로 감지하기 때문에 GitHub로 commit을 push할 때마다 Cloud Run에 자동으로 배포됩니다.

## Scripts

### `test`

실행 중인 GraphQL 서버에 테스트용 GraphQL 쿼리를 요청하고 응답을 검사합니다. 이 스크립트를 실행 하기 전에 `localhost` 또는 원격에서 GraphQL API 서버를 실행해야 합니다.

### `generate-db`

```bash
$ yarn generate-db {환경 변수 파일 위치}
```

PostgreSQL 데이터베이스 구조를 바탕으로 TypeScript 기반 자료형이 담긴 파일을 생성합니다.

### `export-db`

```bash
$ yarn export-db {환경 변수 파일 위치}
```

PostgreSQL 데이터베이스에 있는 모든 스키마의 모든 테이블을 CSV 파일로 저장합니다.

### `import-db`

```bash
$ yarn import-db {환경 변수 파일 위치}
```

CSV 파일을 PostgreSQL 데이터베이스에 삽입합니다.
