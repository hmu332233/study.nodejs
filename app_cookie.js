var express = require("express");
var app = express();
//쿠기를 사용하기 위한 라이브러리
var cookieParser = require('cookie-parser');

app.use(cookieParser());

app.get('/count',function(req,res){
    
    if(req.cookies.count)
      var count = parseInt(req.cookies.count);
    else
      var count = 0;
    
    
    res.cookie('count', count+1);
    
    res.send('count :' + count ); 
});


app.listen(process.env.PORT,function(){
   console.log('Connected!'); 
});