var express = require("express");
var app = express();
//쿠기를 사용하기 위한 라이브러리(두번째 인자는 암호화 key)
var cookieParser = require('cookie-parser','123456');

app.use(cookieParser());

app.get('/count',function(req,res){
    
    if(req.signedcookies.count)
      var count = parseInt(req.signedcookies.count);
    else
      var count = 0;
    
    
    res.cookie('count', count+1,{signed:true});
    
    res.send('count :' + count ); 
});


app.listen(process.env.PORT,function(){
   console.log('Connected!'); 
});