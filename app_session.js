var express = require('express')
var app = express()
var session = require('express-session')

app.use(session({
  secret: '123456', // 암호화 key값
  resave: false,
  saveUninitialized: true
}))

app.get('/count', function (req, res) {
  //count 라는 값을 서버에 저장하고, session id 값을 클라이언트에 넣는다
  if (req.session.count) {
    req.session.count++
  } else {
    req.session.count = 1
  }
  res.send('count : ' + req.session.count )
})

app.get('/tmp',function (req, res) {
  res.send('result : ' + req.session.count )
})

app.listen(process.env.PORT, function () {
  console.log('Connected!')
})
