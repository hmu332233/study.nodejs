var express = require('express')
var app = express()
var session = require('express-session')
var bodyParser = require('body-parser')
var md5 = require('md5')

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
  password: '202cb962ac59075b964b07152d234b70',
  displayName: 'mu'
  },
  {
  username: 'test2',
  password: '202cb962ac59075b964b07152d234b70',
  displayName: 'mu2'
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
    
    console.log(md5(pwd))
    console.log(user.password)
    
    if(username === user.username && md5(pwd) === user.password) {
      req.session.displayName = user.displayName
      return req.session.save(function () {
        res.redirect('/welcome')
      })
    }
  }
  
  res.send('Who are you? <a href="/auth/login">home</a>')

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
  var user = {
    username: req.body.username,
    password: req.body.password,
    displayName: req.body.displayName
  }
  
  users.push(user)
  req.session.displayName = user.displayName
  res.redirect('/welcome')
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
