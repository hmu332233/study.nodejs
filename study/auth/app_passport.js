var express = require('express')
var app = express()
var session = require('express-session')
var bodyParser = require('body-parser')
var bkfd2Password = require("pbkdf2-password")
var hasher = bkfd2Password();
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(session({
  secret: '123456', // 암호화 key값
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//더미용
var users = [
  {
  id: 1,
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

// app.post('/auth/login', function (req, res){

//   var username = req.body.username
//   var pwd = req.body.password
  
//   for(var i in users){
//     var user = users[i]
    
//     if(username === user.username){
      
//       var opts = {
//         password: pwd,
//         salt: user.salt
//       }
       
//       return hasher(opts, function(err, pass, salt, hash) {
//         if(hash === user.password){
//           req.session.displayName = user.displayName
//             req.session.save(function () {
//               res.redirect('/welcome')
//           })
//         } else {
//           res.send('Who are you? <a href="/auth/login">home</a>')
//         }
//       })
//     }
    
//   }
// })

app.post( '/auth/login',  
          passport.authenticate(
            //local 이라는 인증 방식이 사용됨 만약 facebook을 사용중이면 facebook을 입력하면된다.
            'local', 
            { 
              //로그인에 성공하면 redirect 되는 url
              successRedirect: '/welcome',
              //로그인에 실패하면 redirect 되는 url
              failureRedirect: '/auth/login',
              //실패했을 시, 메세지를 띄우기 위함
              failureFlash: false 
            }
          )
);

passport.serializeUser(function(user, done) {
  console.log('serializeUser',user);
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser',id);
  for(var i in users){
      var user = users[i];
      
      if(user.username === id){
        done(null, user);
      }
  }
});

//여기서 정의한 함수가 사용자 인증에 사용된다
passport.use(new LocalStrategy(
  function(username, pwd, done) {

    for(var i in users){
      var user = users[i]
      
      if(username === user.username){
        
        var opts = {
          password: pwd,
          salt: user.salt
        }
         
        return hasher(opts, function(err, pass, salt, hash) {
          if(hash === user.password){
            console.log('LocalStrategy',user);
            done(null, user);
          } else {
            done(null,false);
          }
        })
      }
    }
    done(null,false);
  }
));

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

app.post('/auth/register', function (req, res,next){
  
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
    
    req.login(user,function(err){
      if(err) return next(err);
      return res.redirect('/welcome')
    });
    
    })
})

app.get('/welcome', function (req, res) {
  
  if(req.user)  
    res.send(`
      <h1>welcome, ${req.user.displayName}</h1>
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
  req.logout();
  req.session.save(function(){
    res.redirect('/welcome');  
  });
})


app.listen(process.env.PORT, function () {
  console.log('Connected!')
})
