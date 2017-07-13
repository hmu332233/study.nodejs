var express = require('express');
var app = express();
var bodyParser = require('body-parser');

//POST를 사용해도 req에서 데이터를 사용할 수 있게해줌
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//서버에서 정적파일을 사용할 수 있도록 함
app.use(express.static('public'));

//서버가 읽을 수 있도록 HTML 의 위치를 정의해줍니다.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//서버가 HTML 렌더링을 할 때, EJS 엔진을 사용하도록 설정합니다.
app.engine('html', require('ejs').renderFile);


app.get('/',function(req,res){
  res.render('post.html')
});


app.post('/',function(req,res){
//   res.send(req.body.email + "," + req.body.pw);
  res.send(req.body);
});


app.listen(process.env.PORT, function(){
    console.log("Express server has started on port 3000")
});

