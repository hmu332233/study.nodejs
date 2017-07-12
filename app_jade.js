const express = require('express');
const app = express();

//템플릿이 있는 디렉토리 설정
//html을 렌더링시 jade 엔진을 사용하도록 설정
app.set('views', './views')
app.set('view engine','jade');

app.get('/', function(req, res){
  res.render('index');
});


app.listen( process.env.PORT ,function(){
    console.log('Connected 3000 port!');
});