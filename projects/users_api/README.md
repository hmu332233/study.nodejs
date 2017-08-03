## users_api

- nodejs를 사용해 유저의 정보를 CRUD 하는 API Server를 제작해본다

### 사용기술
- express
- MongoDB


### 설치
- **nodejs 설치**
```bash
$ apt-get install curl
$ curl -sL https://deb.nodesource.com/setup_6.x | bash -
$ apt-get install -y nodejs
```

- **MongoDB**
  - `apt-get install mongodb`
  - `mkdir -p /data/db` : 몽고DB가 사용하는 기본 데이터 디렉토리를 생성 
  - `mongod` : 서버 실행
  - `mongo` : 콘솔 접속
	
### 실행
```bash
$ npm install
$ npm start 또는 node app.js
```
