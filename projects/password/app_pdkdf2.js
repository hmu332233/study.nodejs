var express = require('express')
var app = express()
var session = require('express-session')
var bodyParser = require('body-parser')
var bkfd2Password = require("pbkdf2-password")
var hasher = bkfd2Password();

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(session({
  secret: '123456', // 암호화 key값
  resave: false,
  saveUninitialized: true
}))

//더미용
var users = [
  {
  username: 'test',
  password: 'Xxa0AsRY/SoAnSwBItT/nSufYIMvjCZIrhDJ8xw3XIbECOOnQAkWIDrIvcuNlewvemZ02uL21IcENH9883ZrwgowgMrjbczdQTUaTzQnJoTnNB/gNTNfZkdbOGjlfnhEicZDKJED48dD28ZxzUBLHNp4jJ31ligvbMqsmqEcFEA=',
  displayName: 'mu',
  salt: 'GWbQSE9NELweMj/Vvb842xjC982fvjpzXS2MweGSln4uAnxGbZpHV23yYuo73qOh8yfMyfqVt1xkE411ZRWebg=='
  }
]

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

  var username = req.body.username
  var pwd = req.body.password
  
  for(var i in users){
    var user = users[i]
    
    if(username === user.username){
      
      var opts = {
        password: pwd,
        salt: user.salt
      }
       
      return hasher(opts, function(err, pass, salt, hash) {
        if(hash === user.password){
          req.session.displayName = user.displayName
            req.session.save(function () {
              res.redirect('/welcome')
          })
        } else {
          res.send('Who are you? <a href="/auth/login">home</a>')
        }
      })
    }
    
  }
})

app.get('/auth/register', function (req, res){
  
  var output = `
  <h1>Login</h1>
  <form action='/auth/register' method='POST'>
    <p>
      <input type='text' name='username' placeholder='username'>
    </p>
    <p>
      <input type='password' name='password' placeholder='password'>
    </p>
    <p>
      <input type='text' name='displayName' placeholder='displayName'>
    </p>
      <input type='submit'>
  </form>
  `
  
  res.send(output)
})

app.post('/auth/register', function (req, res){
  
  var opts = {
    password: req.body.password
  }
  
  hasher(opts, function(err, pass, _salt, hash) {
    var user = {
      username: req.body.username,
      password: hash,
      displayName: req.body.displayName,
      salt: _salt
    }
    
    users.push(user)
    req.session.displayName = user.displayName
    res.redirect('/welcome')
    })
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
      <li><a href='/auth/login'>login</a></li>
      <li><a href='/auth/register'>register</a></li>
    `)
})

app.get('/auth/logout', function (req, res){
  delete req.session.displayName
  res.redirect('/welcome')
})


app.listen(process.env.PORT, function () {
  console.log('Connected!')
})
