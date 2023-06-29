# NestJS Restaurant RESTful API
## Features
- Docker integration
- Prisma ORM with auto generated types
- PostgreSQL and MongoDB databases integration with Prisma
- Swagger documentation
- JWT Authorization
- Protected endpoints

## Installation

```bash
$ cd sumatywny-api
$ npm install
```

## [JSON object to base64 encoder](https://codebeautify.org/json-to-base64-converter)
## [base64 to JSON object encoder](https://codebeautify.org/base64-to-json-converter)
## [JSON Web Token](https://jwt.io/)

## Running the app

### Run production through Docker
1. Make sure correct environment variables are set in `.env` file
2. Start docker images using this command:
```bash
$ sudo docker-compose up -d
```

### generating schema files
```bash
npm run db:generate # generate DTO and Entity files
npm run db:migrate # apply changes to Postgres database
```

### Start backend server
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# start both docker database servers and backend server in watch mode
$ npm run start:all
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
