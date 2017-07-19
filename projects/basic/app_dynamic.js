const express = require('express');
const app = express();

app.get('/', function(req,res){
  var li_list = ''
  for(var i = 0 ; i < 5 ; i++ ){
      li_list += '<li>coding</li>'
  }
  
  var time = Date();
  
  // ``를 쓰면 문자열을 자유롭게 쓸 수 있다
  var output = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title></title>
    </head>
    <body>
        Hello, Dynamic!
        <ul>
          ${li_list}
        </ul>
        ${time}
        </body>
    </html>`;
   res.send(output);
});

app.listen( process.env.PORT ,function(){
    console.log('Connected 3000 port!');
});