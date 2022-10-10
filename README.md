# Description

### **마켓보로 백엔드 개발자 사전 과제**

### 개발 필수요건

#### 상품관리

- [x] 상품을 등록/수정/삭제 할 수 있어야 한다.

### 주문관리

- [x] 등록한 상품으로 주문을 받을 수 있어야 한다.
- [x] 주문한건당 여러개의 상품을 받을 수 있다.(1:N)
- [x] 주문은 부분취소가 가능하다.
- [x] 주문 내 일부 상품만 취소할 수 있다.
- [x] 주문상태 예시 : 주문접수/배송완료/주문취소

### 주문 및 취소 시 알림

- [x] 콘솔에 로그 출력을 알림발송으로 인정합니다.

### 개발 추가요건(선택)

- [ ] 인증/인가
- [x] 토큰 기반
- [x] 로그인사용자 관리
- [x] 예외처리
- [ ] 단위테스트
- [x] 활용가능한 기술 추가적용 가능

## Tech Stacks

- ### Nest.js Framework

- ### Postgresql

  - Postgresql은 자체적으로 구축해서 사용중인 홈 서버에 Docker로 올려서 사용했습니다.

- ### Redis(Bull Message Queue)

  - Redis도 Postgresql과 마찬가지로 홈 서버에 Docker를 이용해 사용했습니다.

- ### TypeORM

- ### Swagger Open API 3.0
- ### Passport JWT

# Installation

Node.js의 버전은 현재 공식 Node.js Relase Repository에 따른 유지보수 중인 최소 LTS 버전인 14 이상을 사용하시면 됩니다.

과제는 현재 Active 상태의 LTS인 16버전을 기준으로 개발했습니다.

```bash
$ npm install
```

## Environment

환경 변수는 프로젝트의 루트 패스 기준으로 `.env` 라는 이름으로 파일을 생성해서 아래 내용을 기입해주시면 됩니다.

### 환경변수 내용

- Postgresql 정보
- Application 정보
  - PORT
  - SECRET_KEY
- Redis 정보

```bash
DB_TYPE = postgres
DB_HOST = anjwoc.duckdns.org
DB_PORT = 15432
DB_USERNAME = anjwoc
DB_PASSWORD = k-89032141
DB_NAME = nest

# app
NODE_ENV = develop
PORT = 3000
ADMIN_USER = anjwoc
ADMIN_PASSWORD = k-89032141
SECRET_KEY = some_secert_key_nest_js
COOKIE_SECRET = some_secert_key_nest_js

# postgresql db
POSTGRES_DB = anjwoc.duckdns.org
POSTGRES_USER = anjwoc
POSTGRES_PASSWORD = k-89032141

# redis config
REDIS_HOST = anjwoc.duckdns.org
REDIS_PORT = 16379
```

## Running the app

데모를 실행해보실 때는 `npm run start`로 실행해보시면 됩니다.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug

# production mode
$ npm run start:prod
```

### Swagger 접속 주소

환경변수에서 포트 부분을 변경할 경우 해당 포트로 기입하면 됩니다.

```plaintext
http://localhost:3000/api
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# API

## Order

- 주문 조회 `(GET /orders)`
- 주문 상세 조회 `(GET /orders/{id})`
- 주문 접수 요청 `(POST /orders)`
- 주문 완료 요청 `(POST /orders/complete/{id})`
- 주문 취소 요청 `(POST /orders/cancel/{id})`
- 주문 상품 부분 취소 요청 `(POST /orders/partial-cancel)`
- 주문 수정 `(PUT /orders)`
- 주문 삭제 `(DELETE /orders)`

## Product

- 상품 조회 `(GET /products)`
- 상품 상세 조회 `(GET /products/{id})`
- 상품 등록 `(POST /products)`
- 상품 수정 `(PUT /products/{id})`
- 상품 삭제 `(DELETE /products/{id})`

## User

- 회원 전체 조회 `(GET /users)`
- 회원가입 `(POST /users/register)`
- 로그인 `(POST /users/login)`
