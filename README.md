# Forum API Garuda Game
## ID Camp 2022
![CI Master](https://github.com/hakimamarullah/forum-api-garuda-game/actions/workflows/ci.yaml/badge.svg)
![CD Master](https://github.com/hakimamarullah/forum-api-garuda-game/actions/workflows/cd.yaml/badge.svg?branch=master)

## Jest Coverage
![Branches](./badges/coverage-branches.svg)
![Functions](./badges/coverage-functions.svg)
![Lines](./badges/coverage-lines.svg)
![Statements](./badges/coverage-statements.svg)
![Jest coverage](./badges/coverage-jest%20coverage.svg)


### How to run locally
prerequisite: `nodejs v16.x`

1. Install dependencies
 ```
 git clone https://github.com/hakimamarullah/forum-api-garuda-game.git
 cd ~/forum-api-garuda-game
 npm install
 ```
2. Please check .env.example file to see all needed values then run following commands
```
npm run migrate up # create tables for development
npm run migrate:test up # create tables in test database
```
3. Run it using this command (choose one)
```
npm run start # no auto-reload
npm run start:dev # auto-reload on code change
```
4. Server is up and running on `http://localhost:5000` or based on your environment setup

> Check out Postman Docs for all endpoints:
[Forum API V1 DOCS](https://documenter.getpostman.com/view/19278069/2s8Z72Vrxn)

> Check this link if you want to try live version: https://evil-pig-22.a276.dcdg.xyz/
<hr/>

> **Deployment**: \
**VM**: AWS EC2 \
**Database**: AWS RDS PostgresSQL \
**Reverse-Proxy**: Nginx \
**Certificate**: Certbot

