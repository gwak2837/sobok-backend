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
$ git clone https://github.com/rmfpdlxmtidl/sobok-backend.git
$ cd sobok-backend
$ git checkout main
$ yarn
```

프로젝트를 다운로드 받고 해당 폴더로 이동한 후 적절한 브랜치(`main` 등)로 이동하고 프로젝트에 필요한 외부 패키지를 설치합니다.

그리고 프로젝트 폴더에서 VSCode를 실행하면 오른쪽 아래에 '권장 확장 프로그램 설치' 알림이 뜨는데, 프로젝트에서 권장하는 확장 프로그램(ESLint, Prettier 등)을 모두 설치합니다.

### Create environment variables

```
PORT=4000

CONNECTION_STRING=postgresql://DB계정이름:DB계정암호@DB서버주소:포트/DB이름

JWT_SECRET_KEY=임의의문자열

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

FRONTEND_URL=
BACKEND_URL=

# for yarn generate-db
POSTGRES_DB=DB이름
```

루트 폴더에 `.env`, `.env.development`, `.env.test` 파일을 생성하고 프로젝트에서 사용되는 환경 변수를 설정합니다.

### Start PostgreSQL server

```shell
DOCKER_VOLUME_NAME=도커볼륨이름
POSTGRES_HOST=DB서버주소
POSTGRES_USER=DB계정이름
POSTGRES_PASSWORD=DB계정암호
POSTGRES_DB=DB이름

# Install Docker Engine on Ubuntu https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository
sudo apt remove docker docker-engine docker.io containerd runc

sudo apt update
sudo apt install \
  ca-certificates \
  curl \
  gnupg \
  lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io

# generate the server.key and server.crt https://www.postgresql.org/docs/14/ssl-tcp.html
openssl req -new -nodes -text -out root.csr -keyout root.key -subj "/CN=$POSTGRES_HOST"
chmod og-rwx root.key

openssl x509 -req -in root.csr -text -days 3650 \
  -extfile /etc/ssl/openssl.cnf -extensions v3_ca \
  -signkey root.key -out root.crt

openssl req -new -nodes -text -out server.csr \
  -keyout server.key -subj "/CN=$POSTGRES_HOST"

openssl x509 -req -in server.csr -text -days 365 \
  -CA root.crt -CAkey root.key -CAcreateserial \
  -out server.crt

# set postgres (alpine) user as owner of the server.key and permissions to 600
sudo chown 0:70 server.key
sudo chmod 640 server.key

# start a postgres docker container, mapping the .key and .crt into the image.
sudo docker volume create $DOCKER_VOLUME_NAME
sudo docker run \
  -d \
  -e POSTGRES_USER=$POSTGRES_USER \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -e POSTGRES_DB=$POSTGRES_DB \
  -e LANG=ko_KR.utf8 \
  -e LC_COLLATE=C \
  -e POSTGRES_INITDB_ARGS=--data-checksums \
  -p 5432:5432 \
  -v "$PWD/server.crt:/var/lib/postgresql/server.crt:ro" \
  -v "$PWD/server.key:/var/lib/postgresql/server.key:ro" \
  -v $DOCKER_VOLUME_NAME:/var/lib/postgresql/data \
  --name postgres \
  --restart=always \
  postgres:14-alpine \
  -c ssl=on \
  -c ssl_cert_file=/var/lib/postgresql/server.crt \
  -c ssl_key_file=/var/lib/postgresql/server.key
```

도커를 통해 PostgreSQL 컨테이너와 도커 볼륨을 생성하고, OpenSSL을 이용해 자체 서명된 인증서를 생성해서 SSL 연결을 활성화합니다.

```bash
yarn import-db 환경변수파일위치
```

그리고 PostgreSQL 서버에 접속해서 [`database/initialization.sql`](database/initialization.sql)에 있는 SQL DDL을 실행하고 CSV 파일로 되어 있는 더미데이터를 넣어줍니다.

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

## Cloud

### GCP Cloud Run

Cloud Run이 GitHub 저장소 변경 사항을 자동으로 감지하기 때문에 GitHub로 commit을 push할 때마다 Cloud Run에 자동으로 배포됩니다.

### Oracle Instance

```shell
$ ssh -i {Oracle Instance 비밀키 경로} {Oracle Instance 사용자 이름}@{Oracle Instance 공용 IP}
```

SSH 접속하기

```shell
$ scp -i {Oracle Instance 비밀키 경로} {Oracle Instance 사용자 이름}@{Oracle Instance 공용 IP}:{CA 인증서 경로}/root.crt ./
```

SCP로 파일 다운로드 받기

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

PostgreSQL 데이터베이스에 있는 모든 스키마의 모든 테이블을 CSV 파일로 저장합니다. 더미 데이터 CSV 파일을 변경하기 전에 수행합니다.

### `import-db`

```bash
$ yarn import-db {환경 변수 파일 위치}
```

CSV 파일을 PostgreSQL 데이터베이스에 삽입합니다.
