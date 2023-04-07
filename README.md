## Installation

```bash
$ cd sumatywny-api
$ npm install
```

## Running the app

### Start database Docker images
```bash
$ sudo docker-compose up -d
```
OR
```bash
$ sudo npm run db:start

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
$ sudo npm run start:all
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```
