const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const mongoose   = require("mongoose");


/*외부에서 접근 가능*/
app.use(express.static('public'));
/*bodyParser*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* 데이터 베이스 서버 연결 */
var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  console.log("Connected to mongod server");
});
mongoose.connect('mongodb://localhost:27017/study');

/*route*/
app.use('/', require('./router/index'));


app.listen(process.env.PORT, function (){
   console.log('server start!'); 
});