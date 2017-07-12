const express = require('express');
const app = express();

// '/'로 접속하면 function이 실행됨
app.get('/', function(req, res){
  res.send('hello world');
});

app.get('/login', function(req, res){
  res.send('Login please');
});

// (port,callback) 
// callback은 listen에 성공했을때 호출됨 
app.listen( process.env.PORT ,function(){
    console.log('Connected 3000 port!');
});