var express = require('express')
var app = express()
var session = require('express-session')
var bodyParser = require('body-parser')

var MySQLStore = require('express-mysql-session')(session);
 
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

var options = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'o2'
};

app.use(session({
  store: new MySQLStore(options),
  secret: '123456', // 암호화 key값
  resave: false,
  saveUninitialized: true
}))

app.get('/auth/login', function (req, res){
  var output = `
  <h1>Login</h1>
  <form action='/auth/login' method='POST'>
    <p>
      <input type='text' name='username' placeholder='username'>
    </p>
    <p>
      <input type='password' name='password' placeholder='password'>
    </p>
      <input type='submit'>
  </form>
  `
  
  res.send(output)
})

app.post('/auth/login', function (req, res){
  //더미용
  var user = {
    username: 'test',
    password: '123',
    displayName: 'mu'
  }
  
  var username = req.body.username
  var pwd = req.body.password
  
  if(username === user.username && pwd === user.password) {
    req.session.displayName = user.displayName
    req.session.save(function(){
      res.redirect('/welcome')
    });
  } else
    res.send(res.send('Who are you? <a href="/auth/login">home</a>'))
  
  
})

app.get('/welcome', function (req, res) {
  
  if(req.session.displayName)  
    res.send(`
      <h1>welcome, ${req.session.displayName}</h1>
      <a href='/auth/logout'>logout</a>
    `)
  else
    res.send(`
      <h1>welcome</h1>
      <a href='/auth/login'>login</a>
    `)
})

app.get('/auth/logout', function (req, res){
  delete req.session.displayName
  req.session.save(function(){
    res.redirect('/welcome')  
  });
})


app.listen(process.env.PORT, function () {
  console.log('Connected!')
})
