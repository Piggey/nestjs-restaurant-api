## Installation

```bash
$ cd sumatywny-api
$ npm install
```

## [JSON object to base64 encoder](https://codebeautify.org/json-to-base64-converter)
## [base64 to JSON object encoder](https://codebeautify.org/base64-to-json-converter)

## Running the app

### Start database Docker images
```bash
$ sudo docker-compose up -d
```
OR
```bash
$ npm run db:start

# update schema
$ npm run db:migrate
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
