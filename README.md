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

# Tech Stacks

- ### Nest.js Framework

- ### Postgresql

  - Postgresql은 자체적으로 구축해서 사용중인 홈 서버에 Docker로 올려서 사용했습니다.

- ### Redis(Bull Message Queue)

  - Redis도 Postgresql과 마찬가지로 홈 서버에 Docker를 이용해 사용했습니다.

- ### TypeORM

- ### Swagger Open API 3.0

# ERD

![ERD](/resources/erd.png)

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

# Workflow 및 구현 패턴

## Message Broker Workflow

주문 및 취소 시 알림 요구사항을 보고 만든 부분입니다.

Redis를 Bull Message Queue라는 패키지를 이용해서 메세지 브로커로서 이용했습니다.

아래 그림의 플로우는 다음과 같습니다.

1. 클라이언트가 Orders Controller로 주문 접수 요청 또는 주문의 상품 부분 취소 요청을 한다.
2. 해당 요청에 대응되는 Service Layer의 메소드를 통해 요청을 처리한다.
3. 요청이 성공일 경우에 결과 데이터를 Order Queue로 주문 접수일 경우 requestOrder란 키값으로 부분 취소 요청일 경우 partialCancel이란 키값으로 메세지를 전달한다.
4. Orders Consumer에서는 지정해놓은 키값들에 메세지가 생성되면 구독해서 대응되는 메소드에서 로직을 처리

그림에서는 Orders Controller와 Users Controller가 가장 앞단에 존재하지만 사실 메세지 브로커로 메세지를 생성해서 전달하는 프로듀서 역할은 각 Service들이 하고 있습니다.

![message_broker](/resources/message_broker.png)

## Transaction 구현 패턴

`Nest.js`와 `TypeORM`은 튜토리얼을 제외하면 처음 사용해서 트랜잭션을 처리하는 방법을 몰라 여러 방법을 조사해서 한 가지 방법을 선택했습니다.

`TypeORM` 공식문서에 따르면 트랜잭션을 사용하는 방법은 [3가지](https://typeorm.io/transactions)가 있고 저는 그 중 권장사항이라고 말하는 `QueryRunner`를 이용하는 방법을 사용했습니다.

스프링 프레임워크를 사용하는 사람들이 익숙한 어노테이션을 이용하는(Typescript에서는 데코레이터) 방법도 있지만 아직 `Typescript`에서는 데코레이터가 `Experimental`한 기능이면서 여러 제약 사항으로 완벽히 지원이 안되기 때문에 권장을 하지 않는다는 의미로 이해해서 제외했습니다.

### QueryRunner Example

아래 코드와 같이 queryRunner객체를 생성하고 연결 후 트랜잭션을 시작하고 서비스 로직을 실행합니다.

만약 에러가 발생하면 catch 블록으로 빠지게 되고 rollback을 하게 되고 서비스 로직이 무사히 끝나면 finally 블록으로 가서 커넥션을 release시킵니다.

```typescript
async someFunc(requestOrderDto: RequestOrderDto): Promise<Entity> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      /* ... Service Logic ... */

      return data;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
```

## AOP 구현 패턴

Nest.js에서도 AOP를 위해 제공하는 패턴이 있고 거기서 사용한 패턴은 총 3가지 입니다.

1. `HttpExceptionFilter`

   - 애플리케이션 단에서 발생하는 모든 예외를 캐치해서 처리하는 글로벌 필터입니다.
   - API에서 발생한 에러일 경우 의도한 리스폰스 포맷으로 응답하도록 구현해놓고 그 이외의 예외는 Nest.js의 기본 내장 예외 필터가 처리하게 됩니다.
   - `Sample Response`
   - ```typescript
       {
           "success": false,
           "statusCode": 401,
           "timestamp": "2022-10-10T17:27:53.754Z",
           "path": "/users/login",
           "message": {
               "statusCode": 401,
               "message": "로그인에 실패했습니다.",
               "error": "Unauthorized",
               "stacktrace": "UnauthorizedException: 로그인에 실패했습니다.\n    at UsersService.verifyUserAndSignJwt (/Users/jcjeong/project/product-order-management/src/users/users.service.ts:94:13)"
           }
       }
     ```

2. `TransformInterceptor`

   - 모든 API의 표준 응답 포맷을 적용하기 위해 사용한 인터셉터입니다.
   - 각 API의 결과 데이터를 아래 객체에서 data넣어서 응답하게 됩니다.
   - ```typescript
      {
          "success": true,
          "data": []
      }
     ```

3. `LoggingInterceptor`
   - 모든 API 요청에 대한 특정 로깅을 위한 인터셉터입니다.
   - 과제에서는 API가 수행되는 걸린 시간을 로깅하도록 구현했고 실제로 서비스를 개발할 떄는 로깅을 위해 디비에 저장한다던지 하는 여러 동작을 수행할 수 있습니다.
   - ![Logging](/resources/logging_interceptor.png)

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
